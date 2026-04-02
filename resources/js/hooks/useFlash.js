import { usePage } from '@inertiajs/react';

/**
 * useFlash
 * --------
 * Reads Inertia flash messages passed from Laravel's session.
 *
 * Usage in Laravel controller:
 *   return redirect()->back()->with('success', 'Visitor invited!');
 *   return redirect()->back()->with('error', 'Something went wrong.');
 *
 * Usage in component:
 *   const { success, error, notification } = useFlash();
 */
export function useFlash() {
  const { props } = usePage();
  return props.flash || {};
}
