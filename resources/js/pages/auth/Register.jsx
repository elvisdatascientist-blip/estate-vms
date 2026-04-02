import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Input, Button, Select, Alert } from '@/components/ui';

export default function Register({ flash = {} }) {
  const { data, setData, post, processing, errors } = useForm({
    name:                  '',
    email:                 '',
    phone:                 '',
    unit:                  '',
    block:                 '',
    password:              '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <>
      <Head title="Create account — GreenPark Estate" />

      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: 'var(--gray-50)' }}>
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-5"
              style={{ background: 'var(--brand-900)', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>GP</div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>Create your account</h1>
            <p className="text-sm text-gray-500 mt-1.5">Join the GreenPark Estate resident portal</p>
          </div>

          {flash.error && <div className="mb-5"><Alert type="danger">{flash.error}</Alert></div>}

          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-8">
            <form onSubmit={submit} className="space-y-5">
              <Input
                label="Full name"
                placeholder="Your full name as on ID"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                  error={errors.phone}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  label="Block"
                  value={data.block}
                  onChange={e => setData('block', e.target.value)}
                  error={errors.block}
                >
                  <option value="">Select block...</option>
                  {['A', 'B', 'C', 'D', 'E'].map(b => <option key={b} value={b}>Block {b}</option>)}
                </Select>
                <Input
                  label="Unit number"
                  placeholder="e.g. 4, 12A..."
                  value={data.unit}
                  onChange={e => setData('unit', e.target.value)}
                  error={errors.unit}
                />
              </div>

              <div className="pt-4 space-y-4" style={{ borderTop: '1px solid var(--gray-200)' }}>
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  error={errors.password}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="Repeat your password"
                  value={data.password_confirmation}
                  onChange={e => setData('password_confirmation', e.target.value)}
                  error={errors.password_confirmation}
                />
              </div>

              <div className="rounded-xl p-3.5 text-xs font-medium" style={{ background: 'var(--accent-bg, #fdf8ec)', color: '#92700c', border: '1px solid #f5e6b8' }}>
                Your account will require admin approval before you can invite visitors.
              </div>

              <Button type="submit" variant="primary" loading={processing} className="w-full justify-center" style={{ height: 44 }}>
                Create account
              </Button>
            </form>
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition-colors" style={{ color: 'var(--brand-700)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
