import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, Input, Select, Button, Alert } from '@/components/ui';

export default function WalkIn({ auth, flash = {}, units = [] }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name:      '',
    id_number: '',
    phone:     '',
    unit:      '',
    purpose:   '',
    time_in:   new Date().toTimeString().slice(0, 5),
    time_out:  '18:00',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/guard/walkin');
  };

  return (
    <AppLayout user={auth.user} role="guard">
      <PageHeader
        title="Register walk-in visitor"
        subtitle="Unannounced visitor arriving at the gate without a prior invitation"
      />

      {flash.success && (
        <div className="mb-5 max-w-lg">
          <Alert type="success">{flash.success}</Alert>
        </div>
      )}

      <div className="max-w-lg">
        <Card>
          <CardHeader title="Visitor details" subtitle="Fill in visitor information to check them in" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full name *"
                placeholder="Visitor's full name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
              />
              <Input
                label="ID / Passport number *"
                placeholder="National ID"
                value={data.id_number}
                onChange={e => setData('id_number', e.target.value)}
                error={errors.id_number}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Phone number *"
                type="tel"
                placeholder="07XXXXXXXX"
                value={data.phone}
                onChange={e => setData('phone', e.target.value)}
                error={errors.phone}
              />
              <Input
                label="Unit to visit *"
                placeholder="e.g. B4, A2…"
                value={data.unit}
                onChange={e => setData('unit', e.target.value)}
                error={errors.unit}
              />
            </div>
            <Select
              label="Purpose of visit *"
              value={data.purpose}
              onChange={e => setData('purpose', e.target.value)}
              error={errors.purpose}
            >
              <option value="">Select purpose…</option>
              <option>Family visit</option>
              <option>Friend visit</option>
              <option>Delivery</option>
              <option>Contractor</option>
              <option>Other</option>
            </Select>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Time in"
                type="time"
                value={data.time_in}
                onChange={e => setData('time_in', e.target.value)}
              />
              <Input
                label="Expected time out"
                type="time"
                value={data.time_out}
                onChange={e => setData('time_out', e.target.value)}
              />
            </div>

            <div className="pt-1 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              ⚡ An SMS notification will be sent to the tenant in the specified unit upon check-in.
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="submit" variant="primary" loading={processing} className="flex-1 justify-center">
                Check in & notify tenant
              </Button>
              <Button type="button" variant="ghost" onClick={() => reset()}>Clear</Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
