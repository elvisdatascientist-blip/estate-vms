import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Login({ flash = {}, errors: serverErrors = {} }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Sign in — SmartVisitor Estate" />

      <div className="min-h-screen flex bg-muted/30">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-14 relative overflow-hidden bg-primary text-primary-foreground">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-[80px] translate-x-[30%] -translate-y-[30%]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-[60px] -translate-x-[30%] translate-y-[30%]" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-primary-foreground text-primary">
              SV
            </div>
            <span className="font-semibold text-sm">SmartVisitor Estate</span>
          </div>

          {/* Tagline & stats */}
          <div className="relative z-10">
            <div className="w-12 h-0.5 mb-8 bg-primary-foreground/60" />
            <h1 className="text-4xl font-bold leading-tight mb-5">
              Where security<br />meets elegance.
            </h1>
            <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-sm">
              A comprehensive visitor management platform trusted by residents and management teams for seamless estate operations.
            </p>

            <div className="mt-12 flex gap-8">
              {[
                { label: 'Visitors managed', value: '1,200+' },
                { label: 'Avg. response', value: '< 2 min' },
                { label: 'Satisfaction', value: '98%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-primary-foreground/40 text-xs mt-1 tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-primary-foreground/25 text-xs relative z-10">
            &copy; {new Date().getFullYear()} SmartVisitor Estate Management. All rights reserved.
          </p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-10 lg:hidden">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground">
                SV
              </div>
              <span className="font-semibold text-foreground">SmartVisitor Estate</span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to access your portal</CardDescription>
              </CardHeader>

              <CardContent>
                {(flash.error || serverErrors.email) && (
                  <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {flash.error || serverErrors.email}
                  </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">or</span>
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  New resident?{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Create an account
                  </Link>
                </p>

                <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
                  Need assistance? Contact the estate management office.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
