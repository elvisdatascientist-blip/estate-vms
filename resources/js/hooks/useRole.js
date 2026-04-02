import { usePage } from '@inertiajs/react';

/**
 * useRole
 * -------
 * Returns the currently authenticated user and their role.
 * Relies on Inertia's shared `auth` prop.
 *
 * Setup in HandleInertiaRequests middleware:
 *
 *   public function share(Request $request): array {
 *     return array_merge(parent::share($request), [
 *       'auth' => [
 *         'user' => $request->user() ? [
 *           'id'    => $request->user()->id,
 *           'name'  => $request->user()->name,
 *           'email' => $request->user()->email,
 *           'role'  => $request->user()->role,   // 'tenant' | 'guard' | 'admin'
 *           'unit'  => $request->user()->unit,   // for tenants
 *           'badge' => $request->user()->badge,  // for guards
 *           'shift' => $request->user()->shift,  // for guards
 *         ] : null,
 *       ],
 *       'flash' => [
 *         'success'      => $request->session()->get('success'),
 *         'error'        => $request->session()->get('error'),
 *         'notification' => $request->session()->get('notification'),
 *       ],
 *     ]);
 *   }
 */
export function useRole() {
  const { props } = usePage();
  const user = props.auth?.user;
  return {
    user,
    role:     user?.role,
    isTenant: user?.role === 'tenant',
    isGuard:  user?.role === 'guard',
    isAdmin:  user?.role === 'admin',
  };
}
