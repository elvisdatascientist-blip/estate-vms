<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
    public function tenantIndex(Request $request)
    {
        return Inertia::render('tenant/Incidents', [
            'incidents' => $request->user()->incidents()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type'        => 'required|string',
            'title'       => 'required|string|max:150',
            'description' => 'required|string',
            'severity'    => 'required|in:low,medium,high',
        ]);

        $request->user()->incidents()->create([
            ...$request->only('type', 'title', 'description', 'severity'),
            'status' => 'pending',
        ]);

        return redirect()->route('tenant.incidents.index')->with('success', 'Incident reported. Admin will review shortly.');
    }
}
