import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Input, Button, Alert } from '@/components/ui';

export default function Login({ flash = {}, errors: serverErrors = {} }) {
  const { data, setData, post, processing, errors } = useForm({
    email:    '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Sign in — GreenPark Estate" />

      <div className="min-h-screen flex" style={{ background: 'var(--gray-50)' }}>
        {/* Left panel — premium branding */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-14 relative overflow-hidden"
          style={{ background: 'var(--brand-900)' }}>
          {/* Subtle decorative element */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03]"
            style={{ background: 'var(--accent)', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-[0.04]"
            style={{ background: 'var(--accent)', filter: 'blur(60px)', transform: 'translate(-30%, 30%)' }} />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: 'var(--accent)', color: 'var(--brand-900)', fontFamily: 'var(--font-display)' }}>GP</div>
            <span className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>GreenPark Estate</span>
          </div>

          <div className="relative z-10">
            <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />
            <h1 className="text-4xl font-bold text-white leading-tight mb-5" style={{ fontFamily: 'var(--font-display)' }}>
              Where security<br />meets elegance.
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              A comprehensive visitor management platform trusted by residents and management teams for seamless estate operations.
            </p>

            <div className="mt-12 flex gap-8">
              {[
                { label: 'Visitors managed', value: '1,200+' },
                { label: 'Avg. response', value: '< 2 min' },
                { label: 'Satisfaction', value: '98%' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                  <p className="text-white/40 text-xs mt-1 tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/25 text-xs relative z-10">&copy; {new Date().getFullYear()} GreenPark Estate Management. All rights reserved.</p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-10 lg:hidden">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--brand-900)', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>GP</div>
              <span className="font-semibold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>GreenPark Estate</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>Welcome back</h2>
            <p className="text-sm text-gray-500 mb-8">Sign in to access your portal</p>

            {(flash.error || serverErrors.email) && (
              <div className="mb-6">
                <Alert type="danger">{flash.error || serverErrors.email}</Alert>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                error={errors.password}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={e => setData('remember', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: 'var(--brand-800)' }}
                  />
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={processing}
                className="w-full justify-center mt-2"
                style={{ height: 44 }}
              >
                Sign in
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-gray-50 px-3 text-gray-400" style={{ background: 'var(--gray-50)' }}>or</span></div>
            </div>

            <p className="text-sm text-center text-gray-500">
              New resident?{' '}
              <Link href="/register" className="font-semibold transition-colors" style={{ color: 'var(--brand-700)' }}>Create an account</Link>
            </p>

            <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
              Need assistance? Contact the estate management office.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
