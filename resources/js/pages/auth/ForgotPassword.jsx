import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword({ flash = {}, status = null }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <>
      <Head title="Forgot Password — SmartVisitor" />

      <div className="min-h-screen flex items-center justify-center p-5 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground">
              SV
            </div>
            <span className="font-semibold text-foreground">SmartVisitor Estate</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Forgot password?</CardTitle>
              <CardDescription>
                No worries. Enter your email and we'll send you a reset link.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {status && (
                <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle className="size-4 shrink-0" />
                  {status}
                </div>
              )}

              {flash.error && (
                <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {flash.error}
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

                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>

              <div className="mt-6">
                <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="size-4" />
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
