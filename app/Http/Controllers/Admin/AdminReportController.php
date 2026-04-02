<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->date ?? today()->toDateString();

        $visitors = Visitor::whereDate('date', $date)
            ->when($request->search, fn($q, $s) =>
                $q->where('name', 'like', "%$s%")->orWhere('id_number', 'like', "%$s%")
                  ->orWhereHas('tenant', fn($q) => $q->where('unit', 'like', "%$s%"))
            )
            ->when($request->type, fn($q, $t) => $q->where('type', $t))
            ->with('tenant')
            ->orderBy('date')->orderBy('time_in')
            ->get()
            ->map(fn($v) => [...$v->toArray(), 'unit' => $v->tenant->unit]);

        return Inertia::render('admin/DailyReport', [
            'date'     => $date,
            'visitors' => $visitors,
            'filters'  => $request->only('search', 'type'),
            'stats'    => [
                'total'   => $visitors->count(),
                'invited' => $visitors->where('type', 'invited')->count(),
                'walkins' => $visitors->where('type', 'walkin')->count(),
                'inside'  => $visitors->where('status', 'checked-in')->count(),
            ],
        ]);
    }

    public function download(Request $request)
    {
        $date     = $request->date ?? today()->toDateString();
        $visitors = Visitor::whereDate('date', $date)->with('tenant')->orderBy('time_in')->get();

        $headers = ['Content-Type' => 'text/csv', 'Content-Disposition' => "attachment; filename=visitors-{$date}.csv"];
        $rows    = $visitors->map(fn($v) => [
            $v->name, $v->id_number, $v->phone, $v->tenant->unit,
            $v->purpose, $v->time_in, $v->time_out, $v->type, $v->status,
        ]);

        $callback = function () use ($rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Name','ID Number','Phone','Unit','Purpose','Time In','Time Out','Type','Status']);
            foreach ($rows as $row) fputcsv($out, $row);
            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }
}
