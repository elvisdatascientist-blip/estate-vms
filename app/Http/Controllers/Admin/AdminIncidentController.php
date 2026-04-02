<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Inertia\Inertia;

class AdminIncidentController extends Controller
{
    public function index()
    {
        $incidents = Incident::with('tenant')->latest()->get()
            ->map(fn($i) => [
                ...$i->toArray(),
                'unit'        => $i->tenant->unit,
                'tenant_name' => $i->tenant->name,
                'resolved_at' => $i->resolved_at?->format('d M Y'),
            ]);

        return Inertia::render('admin/Incidents', ['incidents' => $incidents]);
    }

    public function resolve(Incident $incident)
    {
        $incident->update([
            'status'      => 'resolved',
            'resolved_by' => auth()->id(),
            'resolved_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Incident marked as resolved.');
    }
}
