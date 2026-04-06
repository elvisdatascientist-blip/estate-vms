import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';

const selectClassName =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function WalkIn({ auth, flash = {}, units = [] }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    id_number: '',
    phone: '',
    unit: '',
    purpose: '',
    time_in: new Date().toTimeString().slice(0, 5),
    time_out: '18:00',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/guard/walkin');
  };

  return (
    <AppLayout user={auth.user} role="guard">
      <Head title="Register Walk-in Visitor" />

      <PageHeader
        title="Register walk-in visitor"
        subtitle="Unannounced visitor arriving at the gate without a prior invitation"
      />

      {flash.success && (
        <div className="mb-5 max-w-lg rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle className="size-4 shrink-0" />
          {flash.success}
        </div>
      )}

      <div className="max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visitor details</CardTitle>
            <CardDescription>
              Fill in visitor information to check them in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="walkin-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Name + ID row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name *</Label>
                  <Input
                    id="name"
                    placeholder="Visitor's full name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_number">ID / Passport number *</Label>
                  <Input
                    id="id_number"
                    placeholder="National ID"
                    value={data.id_number}
                    onChange={(e) => setData('id_number', e.target.value)}
                  />
                  {errors.id_number && (
                    <p className="text-sm text-destructive">{errors.id_number}</p>
                  )}
                </div>
              </div>

              {/* Phone + Unit row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit to visit *</Label>
                  {units.length > 0 ? (
                    <select
                      id="unit"
                      className={selectClassName}
                      value={data.unit}
                      onChange={(e) => setData('unit', e.target.value)}
                    >
                      <option value="">Select unit...</option>
                      {units.map((u) => (
                        <option key={u} value={u}>
                          Unit {u}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id="unit"
                      placeholder="e.g. B4, A2..."
                      value={data.unit}
                      onChange={(e) => setData('unit', e.target.value)}
                    />
                  )}
                  {errors.unit && (
                    <p className="text-sm text-destructive">{errors.unit}</p>
                  )}
                </div>
              </div>

              {/* Purpose select */}
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of visit *</Label>
                <select
                  id="purpose"
                  className={selectClassName}
                  value={data.purpose}
                  onChange={(e) => setData('purpose', e.target.value)}
                >
                  <option value="">Select purpose...</option>
                  <option>Family visit</option>
                  <option>Friend visit</option>
                  <option>Delivery</option>
                  <option>Contractor</option>
                  <option>Other</option>
                </select>
                {errors.purpose && (
                  <p className="text-sm text-destructive">{errors.purpose}</p>
                )}
              </div>

              {/* Time in + Time out row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time_in">Time in</Label>
                  <Input
                    id="time_in"
                    type="time"
                    value={data.time_in}
                    onChange={(e) => setData('time_in', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_out">Expected time out</Label>
                  <Input
                    id="time_out"
                    type="time"
                    value={data.time_out}
                    onChange={(e) => setData('time_out', e.target.value)}
                  />
                </div>
              </div>

              {/* SMS notice */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>
                  An SMS notification will be sent to the tenant in the specified unit upon check-in.
                </span>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              type="submit"
              form="walkin-form"
              className="flex-1"
              disabled={processing}
            >
              {processing ? 'Checking in...' : 'Check in & notify tenant'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => reset()}>
              <RotateCcw className="size-4 mr-1" />
              Clear
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
