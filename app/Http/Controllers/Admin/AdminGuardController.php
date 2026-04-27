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
            'name'     => 'required|string|max:100',
            'badge'    => 'required|string|max:20|unique:users|regex:/^[A-Za-z0-9]+$/',
            'phone'    => 'required|string|regex:/^[0-9]{10,13}$/',
            'email'    => 'nullable|email|unique:users',
            'shift'    => 'required|string|max:40',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name'     => $validated['name'],
            'badge'    => $validated['badge'],
            'phone'    => $validated['phone'],
            'email'    => $validated['email'],
            'shift'    => $validated['shift'],
            'role'     => 'guard',
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.guards')->with('success', 'Guard registered successfully.');
    }

    public function update(Request $request, User $guard)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:100',
            'badge' => 'required|string|max:20|unique:users,badge,' . $guard->id . '|regex:/^[A-Za-z0-9]+$/',
            'phone' => 'required|string|regex:/^[0-9]{10,13}$/',
            'email' => 'nullable|email|unique:users,email,' . $guard->id,
            'shift' => 'required|string|max:40',
        ]);

        $guard->update($validated);

        return redirect()->route('admin.guards')->with('success', 'Guard updated successfully.');
    }

    public function destroy(User $guard)
    {
        $guard->delete();
        return redirect()->route('admin.guards')->with('success', 'Guard removed.');
    }
}
