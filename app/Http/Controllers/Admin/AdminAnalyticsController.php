<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->period ?? 'today';
        [$from, $to] = match($period) {
            'week'  => [now()->startOfWeek(), now()->endOfWeek()],
            'month' => [now()->startOfMonth(), now()->endOfMonth()],
            default => [today(), today()],
        };

        $base = Visitor::whereBetween('date', [$from, $to]);

        $hourly = (clone $base)
            ->selectRaw("HOUR(COALESCE(arrived_at, CONCAT(date, ' ', time_in))) as hr, COUNT(*) as count")
            ->groupBy('hr')->orderBy('hr')->get()
            ->map(fn($r) => ['hour' => str_pad($r->hr, 2, '0', STR_PAD_LEFT).':00', 'count' => $r->count]);

        $daily = $period !== 'today'
            ? (clone $base)->selectRaw("DATE(date) as day, COUNT(*) as count")->groupBy('day')->orderBy('day')->get()
                ->map(fn($r) => ['day' => Carbon::parse($r->day)->format('D'), 'count' => $r->count])
            : collect();

        $byPurpose = (clone $base)->selectRaw("purpose, COUNT(*) as count")->groupBy('purpose')->orderByDesc('count')->get();

        $total   = (clone $base)->count();
        $invited = (clone $base)->where('type', 'invited')->count();
        $walkins = $total - $invited;

        return Inertia::render('admin/Analytics', [
            'period'    => $period,
            'hourly'    => $hourly,
            'daily'     => $daily,
            'byPurpose' => $byPurpose,
            'stats'     => [
                'total'   => $total,
                'invited' => $invited,
                'walkins' => $walkins,
                'avg_day' => $period === 'today' ? $total : round($daily->avg('count') ?? 0),
            ],
        ]);
    }
}
