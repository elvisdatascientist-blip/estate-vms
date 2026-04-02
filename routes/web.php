<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Tenant\VisitorController;
use App\Http\Controllers\Tenant\IncidentController;
use App\Http\Controllers\Tenant\ProfileController;
use App\Http\Controllers\Guard\GuardVisitorController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminGuardController;
use App\Http\Controllers\Admin\AdminIncidentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/* ─── Guest routes ──────────────────────────────────────────────── */
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login',   [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register',[RegisteredUserController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/* ─── Redirect after login based on role ───────────────────────── */
Route::get('/', function () {
    if (!auth()->check()) return redirect('/login');
    return match(auth()->user()->role) {
        'guard' => redirect('/guard/dashboard'),
        'admin' => redirect('/admin/dashboard'),
        default => redirect('/tenant/dashboard'),
    };
})->middleware('auth');

/* ═══════════════════════════════════════════════════════════════
   TENANT ROUTES
   ═══════════════════════════════════════════════════════════════ */
Route::middleware(['auth', 'role:tenant'])->prefix('tenant')->name('tenant.')->group(function () {

    Route::get('/dashboard', function () {
        $user     = auth()->user();
        $today    = now()->toDateString();
        $visitors = $user->visitors()->whereDate('date', $today)->latest()->get();
        return Inertia::render('tenant/Dashboard', [
            'visitors'     => $visitors,
            'stats'        => [
                'today'       => $visitors->count(),
                'inside'      => $visitors->where('status', 'checked-in')->count(),
                'pending'     => $visitors->where('status', 'pending')->count(),
                'total_month' => $user->visitors()->whereMonth('date', now()->month)->count(),
            ],
            'notification' => session('notification'),
        ]);
    })->name('dashboard');

    Route::get('/invite', fn() => Inertia::render('tenant/InviteVisitor'))->name('invite');
    Route::post('/visitors', [VisitorController::class, 'store'])->name('visitors.store');
    Route::post('/visitors/{visitor}/send-sms', [VisitorController::class, 'sendSms'])->name('visitors.sms');
    Route::get('/visitors', [VisitorController::class, 'index'])->name('visitors.index');
    Route::delete('/visitors/{visitor}', [VisitorController::class, 'destroy'])->name('visitors.destroy');

    Route::get('/incidents', [IncidentController::class, 'tenantIndex'])->name('incidents.index');
    Route::post('/incidents', [IncidentController::class, 'store'])->name('incidents.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
});

/* ═══════════════════════════════════════════════════════════════
   GUARD ROUTES
   ═══════════════════════════════════════════════════════════════ */
Route::middleware(['auth', 'role:guard'])->prefix('guard')->name('guard.')->group(function () {
    Route::get('/dashboard', [GuardVisitorController::class, 'dashboard'])->name('dashboard');
    Route::get('/scan', [GuardVisitorController::class, 'scanPage'])->name('scan');
    Route::get('/walkin', fn() => Inertia::render('guard/WalkIn'))->name('walkin');
    Route::post('/walkin', [GuardVisitorController::class, 'walkin'])->name('walkin.store');
    Route::get('/visitors', [GuardVisitorController::class, 'index'])->name('visitors');
    Route::patch('/visitors/{visitor}/checkin',  [GuardVisitorController::class, 'checkin'])->name('checkin');
    Route::patch('/visitors/{visitor}/checkout', [GuardVisitorController::class, 'checkout'])->name('checkout');
});

/* ═══════════════════════════════════════════════════════════════
   ADMIN ROUTES
   ═══════════════════════════════════════════════════════════════ */
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard',  [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/analytics',  [AdminAnalyticsController::class, 'index'])->name('analytics');
    Route::get('/reports',          [AdminReportController::class, 'index'])->name('reports');
    Route::get('/reports/download', [AdminReportController::class, 'download'])->name('reports.download');
    Route::get('/guards',            [AdminGuardController::class, 'index'])->name('guards');
    Route::post('/guards',           [AdminGuardController::class, 'store'])->name('guards.store');
    Route::delete('/guards/{guard}', [AdminGuardController::class, 'destroy'])->name('guards.destroy');
    Route::get('/incidents',                         [AdminIncidentController::class, 'index'])->name('incidents');
    Route::patch('/incidents/{incident}/resolve',    [AdminIncidentController::class, 'resolve'])->name('incidents.resolve');
});
