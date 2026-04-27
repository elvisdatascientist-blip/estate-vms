import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Lock,
  LogOut,
  CheckCircle,
} from 'lucide-react';


export default function TenantProfile({ auth, stats = {}, flash = {} }) {
  const user = auth.user;
  const [passwordModal, setPasswordModal] = useState(false);

  const getInitials = (name) =>
    (name || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  /* Profile form */
  const profileForm = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const saveProfile = (e) => {
    e.preventDefault();
    profileForm.patch('/tenant/profile', { preserveScroll: true });
  };

  /* Password form */
  const passForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const savePassword = (e) => {
    e.preventDefault();
    passForm.put('/tenant/profile/password', {
      onSuccess: () => {
        passForm.reset();
        setPasswordModal(false);
      },
    });
  };

  return (
    <AppLayout user={user} role="tenant">
      <Head title="Profile" />

      <PageHeader title="Profile" subtitle="Manage your account and preferences" />

      {flash.success && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="size-4 shrink-0" />
          {flash.success}
        </div>
      )}

      {/* Hero Card */}
      <Card className="mb-5">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="size-16">
              <AvatarFallback className="text-xl font-bold bg-emerald-50 text-emerald-700">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  Unit {user.unit}
                </span>
                <span className="text-xs text-muted-foreground">SmartVisitor Estate · Tenant</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
            <CardDescription>Update your contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={profileForm.data.name}
                  onChange={(e) => profileForm.setData('name', e.target.value)}
                />
                {profileForm.errors.name && (
                  <p className="text-sm text-destructive">{profileForm.errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileForm.data.email}
                  onChange={(e) => profileForm.setData('email', e.target.value)}
                />
                {profileForm.errors.email && (
                  <p className="text-sm text-destructive">{profileForm.errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone number</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={profileForm.data.phone}
                  onChange={(e) => profileForm.setData('phone', e.target.value)}
                />
                {profileForm.errors.phone && (
                  <p className="text-sm text-destructive">{profileForm.errors.phone}</p>
                )}
              </div>

              {/* Read-only unit / lease info */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg bg-muted px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Unit</p>
                  <p className="text-sm font-medium">{user.unit}</p>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-0.5">Lease since</p>
                  <p className="text-sm font-medium">{user.lease_start || '---'}</p>
                </div>
              </div>

              <Button type="submit" disabled={profileForm.processing} className="w-full">
                {profileForm.processing ? 'Saving...' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-5">
          {/* Security card */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and account access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-xs text-muted-foreground">Last changed: never</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPasswordModal(true)}>
                  <Lock className="mr-2 size-3.5" />
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account card */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => router.post('/logout')}
              >
                <LogOut className="mr-2 size-4" />
                Sign out of SmartVisitor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordModal} onOpenChange={setPasswordModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={savePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current password</Label>
              <Input
                id="current_password"
                type="password"
                value={passForm.data.current_password}
                onChange={(e) => passForm.setData('current_password', e.target.value)}
              />
              {passForm.errors.current_password && (
                <p className="text-sm text-destructive">{passForm.errors.current_password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">New password</Label>
              <Input
                id="new_password"
                type="password"
                value={passForm.data.password}
                onChange={(e) => passForm.setData('password', e.target.value)}
              />
              {passForm.errors.password && (
                <p className="text-sm text-destructive">{passForm.errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm new password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={passForm.data.password_confirmation}
                onChange={(e) => passForm.setData('password_confirmation', e.target.value)}
              />
              {passForm.errors.password_confirmation && (
                <p className="text-sm text-destructive">
                  {passForm.errors.password_confirmation}
                </p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" disabled={passForm.processing} className="flex-1">
                {passForm.processing ? 'Updating...' : 'Update password'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPasswordModal(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
