import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Register({ flash = {} }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    unit: '',
    block: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <>
      <Head title="Create account — GreenPark Estate" />

      <div className="min-h-screen flex items-center justify-center p-5 bg-muted/30">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-5 bg-primary text-primary-foreground">
              GP
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Join the GreenPark Estate resident portal</p>
          </div>

          {flash.error && (
            <div className="mb-5 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {flash.error}
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={submit} className="space-y-4">
                {/* Full name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name as on ID"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Email + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="07XXXXXXXX"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Block + Unit */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="block">Block</Label>
                    <select
                      id="block"
                      value={data.block}
                      onChange={(e) => setData('block', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select block...</option>
                      {['A', 'B', 'C', 'D', 'E'].map((b) => (
                        <option key={b} value={b}>Block {b}</option>
                      ))}
                    </select>
                    {errors.block && (
                      <p className="text-sm text-destructive">{errors.block}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit number</Label>
                    <Input
                      id="unit"
                      placeholder="e.g. 4, 12A..."
                      value={data.unit}
                      onChange={(e) => setData('unit', e.target.value)}
                    />
                    {errors.unit && (
                      <p className="text-sm text-destructive">{errors.unit}</p>
                    )}
                  </div>
                </div>

                {/* Password section */}
                <div className="pt-4 border-t border-border space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="Repeat your password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    {errors.password_confirmation && (
                      <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                    )}
                  </div>
                </div>

                {/* Admin approval notice */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                  Your account will require admin approval before you can invite visitors.
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
