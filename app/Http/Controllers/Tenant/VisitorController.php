<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitorController extends Controller
{
    public function index(Request $request)
    {
        $visitors = $request->user()
            ->visitors()
            ->when($request->search, fn($q, $s) =>
                $q->where('name', 'like', "%$s%")->orWhere('phone', 'like', "%$s%")
            )
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest('date')
            ->get();

        return Inertia::render('tenant/MyVisitors', [
            'visitors' => $visitors,
            'filters'  => $request->only('search', 'status'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:100',
            'id_number' => 'required|string|max:30|regex:/^[A-Za-z0-9]+$/',
            'phone'     => 'required|string|regex:/^[0-9]{10,13}$/',
            'purpose'   => 'required|string|max:100',
            'date'      => 'required|date|after_or_equal:today',
            'time_in'   => 'required|date_format:H:i',
            'time_out'  => 'required|date_format:H:i|after:time_in',
        ]);

        $visitor = $request->user()->visitors()->create([
            ...$validated,
            'type'   => 'invited',
            'status' => 'pending',
        ]);

        return Inertia::render('tenant/InviteVisitor', [
            'visitor' => $visitor->only(['id', 'name', 'phone', 'purpose', 'date', 'time_in', 'time_out', 'token']),
            'flash' => ['success' => 'Visitor invited. QR code generated.'],
        ]);
    }

    public function sendSms(Request $request, Visitor $visitor, SmsService $sms)
    {
        $message = "Hi {$visitor->name}, you are invited to visit SmartVisitor.\n"
                 . "Unit: {$visitor->tenant->unit}\n"
                 . "Date: {$visitor->date->format('d M Y')}, {$visitor->time_in}–{$visitor->time_out}\n"
                 . "Show this code at the gate: {$visitor->token}";

        $sms->send($visitor->phone, $message);

        return redirect()->back()->with('success', "SMS sent to {$visitor->phone}");
    }

    public function destroy(Request $request, Visitor $visitor)
    {
        $visitor->delete();
        return redirect()->route('tenant.visitors.index')->with('success', 'Visitor invitation removed.');
    }
}
