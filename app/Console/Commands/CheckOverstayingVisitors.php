<?php

namespace App\Console\Commands;

use App\Models\Visitor;
use App\Services\SmsService;
use Illuminate\Console\Command;

class CheckOverstayingVisitors extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'visitors:check-overstay';

    /**
     * The console command description.
     */
    protected $description = 'Check for visitors who have overstayed and notify tenants';

    /**
     * Execute the console command.
     */
    public function handle(SmsService $sms): int
    {
        $now = now();
        $today = $now->toDateString();
        $currentTime = $now->format('H:i');

        // Find checked-in visitors whose expected time_out has passed
        $overstayingVisitors = Visitor::where('status', 'checked-in')
            ->whereDate('date', $today)
            ->where('time_out', '<', $currentTime)
            ->whereNull('overstay_notified_at') // Only notify once
            ->with('tenant')
            ->get();

        if ($overstayingVisitors->isEmpty()) {
            $this->info('No overstaying visitors found.');
            return 0;
        }

        $this->info("Found {$overstayingVisitors->count()} overstaying visitor(s).");

        foreach ($overstayingVisitors as $visitor) {
            try {
                $sms->notifyVisitorOverstay($visitor);

                // Mark as notified
                $visitor->update(['overstay_notified_at' => now()]);

                $this->info("Notified tenant for visitor: {$visitor->name} (Unit {$visitor->tenant->unit})");
            } catch (\Exception $e) {
                $this->error("Failed to notify for visitor {$visitor->name}: {$e->getMessage()}");
            }
        }

        return 0;
    }
}
