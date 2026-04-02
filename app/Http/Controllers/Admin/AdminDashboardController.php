<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use App\Models\Incident;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        $hourly = Visitor::whereDate('date', $today)
            ->selectRaw("strftime('%H', arrived_at) as hr, COUNT(*) as count")
            ->whereNotNull('arrived_at')
            ->groupBy('hr')
            ->orderBy('hr')
            ->get()
            ->map(fn($r) => ['hour' => $r->hr . ':00', 'count' => $r->count]);

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'today'          => Visitor::whereDate('date', $today)->count(),
                'inside'         => Visitor::whereDate('date', $today)->where('status', 'checked-in')->count(),
                'open_incidents' => Incident::where('status', 'pending')->count(),
                'guards'         => User::where('role', 'guard')->count(),
            ],
            'hourly'          => $hourly,
            'incidents'       => Incident::where('status', 'pending')->with('tenant')->latest()->take(4)->get()
                ->map(fn($i) => [...$i->toArray(), 'unit' => $i->tenant->unit, 'tenant_name' => $i->tenant->name]),
            'recentVisitors'  => Visitor::whereDate('date', $today)->with('tenant')->latest()->take(6)->get()
                ->map(fn($v) => [...$v->toArray(), 'unit' => $v->tenant->unit]),
        ]);
    }
}
