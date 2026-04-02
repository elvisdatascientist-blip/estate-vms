<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminGuardController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/ManageGuards', [
            'guards' => User::where('role', 'guard')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:100',
            'badge' => 'required|string|max:20|unique:users',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|unique:users',
            'shift' => 'required|string|max:40',
        ]);

        User::create([
            ...$validated,
            'role'     => 'guard',
            'password' => Hash::make(Str::random(12)),
        ]);

        return redirect()->route('admin.guards')->with('success', 'Guard registered successfully.');
    }

    public function destroy(User $guard)
    {
        $guard->delete();
        return redirect()->route('admin.guards')->with('success', 'Guard removed.');
    }
}
