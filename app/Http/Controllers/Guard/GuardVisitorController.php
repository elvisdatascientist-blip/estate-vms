<?php

namespace App\Http\Controllers\Guard;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuardVisitorController extends Controller
{
    public function dashboard()
    {
        $today   = now()->toDateString();
        $inside  = Visitor::whereDate('date', $today)->where('status', 'checked-in')->with('tenant')->get();
        $pending = Visitor::whereDate('date', $today)->where('status', 'pending')->count();

        return Inertia::render('guard/Dashboard', [
            'stats'  => [
                'inside'   => $inside->count(),
                'expected' => $pending,
                'total'    => Visitor::whereDate('date', $today)->count(),
            ],
            'inside' => $inside->map(fn($v) => [
                ...$v->toArray(),
                'unit'        => $v->tenant->unit,
                'tenant_name' => $v->tenant->name,
            ]),
        ]);
    }

    public function scanPage(Request $request)
    {
        $scanned = null;

        if ($request->token) {
            $visitor = Visitor::where('token', $request->token)
                ->where('status', 'pending')
                ->whereDate('date', today())
                ->with('tenant')
                ->first();

            if ($visitor) {
                $scanned = [
                    ...$visitor->toArray(),
                    'unit'        => $visitor->tenant->unit,
                    'tenant_name' => $visitor->tenant->name,
                ];
            }
        }

        return Inertia::render('guard/ScanQR', ['scanned' => $scanned]);
    }

    public function walkin(Request $request, SmsService $sms)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:100',
            'id_number' => 'required|string|max:30',
            'phone'     => 'required|string|max:20',
            'unit'      => 'required|string|max:10',
            'purpose'   => 'required|string|max:100',
            'time_in'   => 'required|date_format:H:i',
            'time_out'  => 'required|date_format:H:i',
        ]);

        $tenant = User::where('unit', $validated['unit'])->where('role', 'tenant')->first();
        abort_unless($tenant, 422, "No tenant found for unit {$validated['unit']}");

        $visitor = Visitor::create([
            ...$validated,
            'user_id'        => $tenant->id,
            'checked_in_by'  => $request->user()->id,
            'date'           => today()->toDateString(),
            'type'           => 'walkin',
            'status'         => 'checked-in',
            'arrived_at'     => now(),
        ]);

        $sms->send($tenant->phone,
            "A visitor ({$visitor->name}) has arrived at the gate and is heading to Unit {$tenant->unit}."
        );

        return redirect()->route('guard.walkin')->with('success', "{$visitor->name} checked in. Tenant notified.");
    }

    public function index(Request $request)
    {
        $visitors = Visitor::whereDate('date', today())
            ->when($request->search, fn($q, $s) =>
                $q->where('name', 'like', "%$s%")
                  ->orWhereHas('tenant', fn($q) => $q->where('unit', 'like', "%$s%"))
            )
            ->with('tenant')
            ->latest()
            ->get()
            ->map(fn($v) => [...$v->toArray(), 'unit' => $v->tenant->unit]);

        return Inertia::render('guard/VisitorList', [
            'visitors' => $visitors,
            'filters'  => $request->only('search', 'tab'),
        ]);
    }

    public function checkin(Visitor $visitor, SmsService $sms)
    {
        $visitor->update(['status' => 'checked-in', 'arrived_at' => now()]);

        $sms->send($visitor->tenant->phone,
            "Your visitor {$visitor->name} has been checked in at the gate and is heading to Unit {$visitor->tenant->unit}."
        );

        return redirect()->back()->with('success', "{$visitor->name} checked in.");
    }

    public function checkout(Visitor $visitor)
    {
        $visitor->update(['status' => 'checked-out', 'left_at' => now()]);
        return redirect()->back()->with('success', "{$visitor->name} checked out.");
    }
}
