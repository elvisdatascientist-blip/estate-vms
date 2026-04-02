<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'phone'       => $user->phone,
                    'role'        => $user->role,
                    'unit'        => $user->unit,
                    'block'       => $user->block,
                    'badge'       => $user->badge,
                    'shift'       => $user->shift,
                    'lease_start' => $user->lease_start?->format('M Y'),
                ] : null,
            ],
            'flash' => [
                'success'      => $request->session()->get('success'),
                'error'        => $request->session()->get('error'),
                'notification' => $request->session()->get('notification'),
            ],
        ]);
    }
}
