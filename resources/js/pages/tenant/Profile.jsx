import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, Input, Button, Alert, Modal, Avatar, StatCard } from '@/components/ui';

export default function TenantProfile({ auth, stats = {}, flash = {} }) {
  const user = auth.user;
  const [passwordModal, setPasswordModal] = useState(false);

  /* ─── Profile form ─────────────────────────────────────── */
  const profileForm = useForm({
    name:  user.name  || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const saveProfile = (e) => {
    e.preventDefault();
    profileForm.patch('/tenant/profile', { preserveScroll: true });
  };

  /* ─── Password form ────────────────────────────────────── */
  const passForm = useForm({
    current_password:       '',
    password:               '',
    password_confirmation:  '',
  });

  const savePassword = (e) => {
    e.preventDefault();
    passForm.put('/tenant/profile/password', {
      onSuccess: () => { passForm.reset(); setPasswordModal(false); },
    });
  };

  return (
    <AppLayout user={user} role="tenant">
      <PageHeader title="Profile" subtitle="Manage your account and preferences" />

      {flash.success && <div className="mb-5"><Alert type="success" onClose={() => {}}>{flash.success}</Alert></div>}

      {/* Hero card */}
      <Card className="mb-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
            style={{ background: 'var(--brand-100)', color: 'var(--brand-700)', fontFamily: 'var(--font-display)' }}>
            {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">Unit {user.unit}</span>
              <span className="text-xs text-gray-400">GreenPark Estate · Tenant</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Activity stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Visitors invited"    value={stats.total_visitors   ?? 0} icon="👥" color="blue"   />
        <StatCard label="This month"          value={stats.visitors_month   ?? 0} icon="📅" color="green"  />
        <StatCard label="Incidents reported"  value={stats.total_incidents  ?? 0} icon="⚠"  color="orange" />
        <StatCard label="Open incidents"      value={stats.open_incidents   ?? 0} icon="🔴" color="red"    />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Edit profile */}
        <Card>
          <CardHeader title="Personal details" subtitle="Update your contact information" />
          <form onSubmit={saveProfile} className="space-y-4">
            <Input
              label="Full name"
              value={profileForm.data.name}
              onChange={e => profileForm.setData('name', e.target.value)}
              error={profileForm.errors.name}
            />
            <Input
              label="Email address"
              type="email"
              value={profileForm.data.email}
              onChange={e => profileForm.setData('email', e.target.value)}
              error={profileForm.errors.email}
            />
            <Input
              label="Phone number"
              type="tel"
              placeholder="07XXXXXXXX"
              value={profileForm.data.phone}
              onChange={e => profileForm.setData('phone', e.target.value)}
              error={profileForm.errors.phone}
            />
            <div className="grid grid-cols-2 gap-3 pt-1 text-sm text-gray-500">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 mb-0.5">Unit</p>
                <p className="font-medium text-gray-700">{user.unit}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 mb-0.5">Lease since</p>
                <p className="font-medium text-gray-700">{user.lease_start || '—'}</p>
              </div>
            </div>
            <Button type="submit" variant="primary" loading={profileForm.processing} className="w-full justify-center">
              Save changes
            </Button>
          </form>
        </Card>

        {/* Security */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Security" subtitle="Manage your password and account access" />
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-700">Password</p>
                  <p className="text-xs text-gray-400">Last changed: never</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setPasswordModal(true)}>Change</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">SMS notifications</p>
                  <p className="text-xs text-gray-400">Receive alerts when visitors arrive</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                </label>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Account" />
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => router.post('/logout')}
            >
              Sign out of GreenPark
            </Button>
          </Card>
        </div>
      </div>

      {/* Change password modal */}
      <Modal open={passwordModal} onClose={() => setPasswordModal(false)} title="Change password" size="sm">
        <form onSubmit={savePassword} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            value={passForm.data.current_password}
            onChange={e => passForm.setData('current_password', e.target.value)}
            error={passForm.errors.current_password}
          />
          <Input
            label="New password"
            type="password"
            value={passForm.data.password}
            onChange={e => passForm.setData('password', e.target.value)}
            error={passForm.errors.password}
          />
          <Input
            label="Confirm new password"
            type="password"
            value={passForm.data.password_confirmation}
            onChange={e => passForm.setData('password_confirmation', e.target.value)}
            error={passForm.errors.password_confirmation}
          />
          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="primary" loading={passForm.processing} className="flex-1 justify-center">Update password</Button>
            <Button type="button" variant="ghost" onClick={() => setPasswordModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
