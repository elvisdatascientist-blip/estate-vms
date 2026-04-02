import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, Badge, Button, Modal, Input, Select, Textarea, Alert, EmptyState, Tabs } from '@/components/ui';

const SEVERITY_COLOR = { high: 'high', medium: 'medium', low: 'low' };
const STATUS_COLOR   = { pending: 'pending', resolved: 'resolved' };

function IncidentCard({ incident }) {
  return (
    <Card className="mb-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{incident.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{incident.type} · {incident.date}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={SEVERITY_COLOR[incident.severity]}>{incident.severity}</Badge>
          <Badge variant={STATUS_COLOR[incident.status]}>{incident.status}</Badge>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{incident.description}</p>
      {incident.status === 'resolved' && (
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 text-xs text-gray-400">
          Resolved by admin
        </div>
      )}
    </Card>
  );
}

export default function Incidents({ auth, incidents = [], flash = {} }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState('all');

  const { data, setData, post, processing, errors, reset } = useForm({
    type:        '',
    title:       '',
    description: '',
    severity:    'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/tenant/incidents', { onSuccess: () => { reset(); setOpen(false); } });
  };

  const filtered = incidents.filter(i =>
    tab === 'all' ? true : i.status === tab
  );

  const tabs = [
    { value: 'all',      label: 'All',      count: incidents.length },
    { value: 'pending',  label: 'Pending',  count: incidents.filter(i => i.status === 'pending').length },
    { value: 'resolved', label: 'Resolved', count: incidents.filter(i => i.status === 'resolved').length },
  ];

  return (
    <AppLayout user={auth.user} role="tenant">
      <PageHeader
        title="Incidents"
        subtitle="Report and track estate security or maintenance issues"
        actions={<Button variant="primary" onClick={() => setOpen(true)}>+ Report incident</Button>}
      />

      {flash.success && <div className="mb-5"><Alert type="success">{flash.success}</Alert></div>}

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {filtered.length === 0
        ? <EmptyState icon="✅" title="No incidents" description="No incidents in this category." />
        : filtered.map(incident => <IncidentCard key={incident.id} incident={incident} />)
      }

      {/* Report Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Report an incident">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Type" value={data.type} onChange={e => setData('type', e.target.value)} error={errors.type}>
              <option value="">Select type…</option>
              <option>Security</option>
              <option>Maintenance</option>
              <option>Noise</option>
              <option>Parking</option>
              <option>Other</option>
            </Select>
            <Select label="Severity" value={data.severity} onChange={e => setData('severity', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <Input
            label="Title"
            placeholder="Brief description of the incident"
            value={data.title}
            onChange={e => setData('title', e.target.value)}
            error={errors.title}
          />
          <Textarea
            label="Details"
            placeholder="Describe what happened, when, and any other relevant information…"
            value={data.description}
            onChange={e => setData('description', e.target.value)}
            error={errors.description}
          />
          <div className="flex gap-3 pt-1">
            <Button type="submit" variant="primary" loading={processing} className="flex-1 justify-center">Submit report</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
