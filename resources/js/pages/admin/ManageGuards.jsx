import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, Badge, Avatar, Button, Modal, Input, Select, Alert, Table, EmptyState } from '@/components/ui';

export default function ManageGuards({ auth, guards = [], flash = {} }) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name:   '',
    badge:  '',
    phone:  '',
    email:  '',
    shift:  'Day (6am–6pm)',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/guards', { onSuccess: () => { reset(); setOpen(false); } });
  };

  const columns = [
    {
      header: 'Guard',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Badge',
      cell: (row) => <code className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{row.badge}</code>,
    },
    { header: 'Phone', cell: (row) => <span className="text-sm text-gray-600">{row.phone}</span> },
    { header: 'Shift', cell: (row) => <span className="text-sm text-gray-600">{row.shift}</span> },
    {
      header: 'Status',
      cell: (row) => <Badge variant={row.status === 'on-duty' ? 'on-duty' : 'off-duty'}>{row.status}</Badge>,
    },
    {
      header: '',
      cell: (row) => (
        <div className="flex gap-2 justify-end">
          <Button size="xs" variant="ghost">Edit</Button>
          <Button size="xs" variant="danger">Remove</Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout user={auth.user} role="admin">
      <PageHeader
        title="Guards"
        subtitle="Manage estate security personnel"
        actions={<Button variant="primary" onClick={() => setOpen(true)}>+ Register guard</Button>}
      />

      {flash.success && <div className="mb-5"><Alert type="success">{flash.success}</Alert></div>}

      <Card padding={false}>
        <Table
          columns={columns}
          data={guards}
          emptyState={
            <EmptyState
              icon="🛡"
              title="No guards registered"
              description="Register your first guard to get started."
              action={<Button variant="primary" size="sm" onClick={() => setOpen(true)}>Register guard</Button>}
            />
          }
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Register new guard">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full name *"     value={data.name}  onChange={e => setData('name', e.target.value)}  error={errors.name}  placeholder="Guard's full name" />
            <Input label="Badge number *"  value={data.badge} onChange={e => setData('badge', e.target.value)} error={errors.badge} placeholder="e.g. G004" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Phone *"  type="tel"   value={data.phone} onChange={e => setData('phone', e.target.value)} error={errors.phone} placeholder="07XXXXXXXX" />
            <Input label="Email"    type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} placeholder="guard@estate.com" />
          </div>
          <Select label="Shift *" value={data.shift} onChange={e => setData('shift', e.target.value)}>
            <option>Day (6am–6pm)</option>
            <option>Night (6pm–6am)</option>
          </Select>
          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="primary" loading={processing} className="flex-1 justify-center">Register guard</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
