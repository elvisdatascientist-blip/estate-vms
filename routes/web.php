<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetController;
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

    Route::get('/forgot-password', [PasswordResetController::class, 'requestForm'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'resetForm'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.update');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/* ─── Health check for Railway ─────────────────────────────────── */
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'app' => config('app.name'),
        'version' => 'v2.1-fix-objects',
        'commit' => exec('git rev-parse --short HEAD 2>&1') ?: 'unknown',
    ]);
});

/* ─── Landing page / Dashboard redirect ───────────────────────── */
Route::get('/', function () {
    if (!auth()->check()) {
        return Inertia::render('Landing');
    }
    return match(auth()->user()->role) {
        'guard' => redirect('/guard/dashboard'),
        'admin' => redirect('/admin/dashboard'),
        default => redirect('/tenant/dashboard'),
    };
});

/* ═══════════════════════════════════════════════════════════════
   TENANT ROUTES
   ═══════════════════════════════════════════════════════════════ */
Route::middleware(['auth', 'role:tenant'])->prefix('tenant')->name('tenant.')->group(function () {

    Route::get('/dashboard', function () {
        $user     = auth()->user();
        $today    = now()->toDateString();
        $visitors = $user->visitors()->whereDate('date', $today)->latest()->get();
        return Inertia::render('tenant/Dashboard', [
            'visitors'     => $visitors->map(function($v) {
                return [
                    'id' => $v->id,
                    'name' => (string) $v->name,
                    'phone' => (string) $v->phone,
                    'purpose' => (string) $v->purpose,
                    'date' => $v->date ? (is_object($v->date) ? $v->date->toDateString() : $v->date) : null,
                    'time_in' => (string) $v->time_in,
                    'time_out' => (string) $v->time_out,
                    'status' => (string) $v->status,
                    'arrived_at' => $v->arrived_at ? (is_object($v->arrived_at) ? $v->arrived_at->toDateTimeString() : $v->arrived_at) : null,
                    'left_at' => $v->left_at ? (is_object($v->left_at) ? $v->left_at->toDateTimeString() : $v->left_at) : null,
                ];
            })->values()->toArray(),
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
    Route::patch('/guards/{guard}',  [AdminGuardController::class, 'update'])->name('guards.update');
    Route::delete('/guards/{guard}', [AdminGuardController::class, 'destroy'])->name('guards.destroy');
    Route::get('/incidents',                         [AdminIncidentController::class, 'index'])->name('incidents');
    Route::patch('/incidents/{incident}/resolve',    [AdminIncidentController::class, 'resolve'])->name('incidents.resolve');
});
