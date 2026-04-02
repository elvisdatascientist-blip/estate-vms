import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, Badge, Button, Tabs, EmptyState, Alert } from '@/components/ui';

function IncidentCard({ incident, onResolve }) {
  return (
    <Card className="mb-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-800">{incident.title}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{incident.type}</span>
            <span>·</span>
            <span>Unit {incident.unit}</span>
            <span>·</span>
            <span>Reported by {incident.tenant_name}</span>
            <span>·</span>
            <span>{incident.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={incident.severity}>{incident.severity}</Badge>
          <Badge variant={incident.status}>{incident.status}</Badge>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-3">{incident.description}</p>

      {incident.status === 'pending' && (
        <div className="flex gap-2">
          <Button size="sm" variant="success" onClick={() => onResolve(incident.id)}>
            ✓ Mark as resolved
          </Button>
          <Button size="sm" variant="ghost">View details</Button>
        </div>
      )}

      {incident.status === 'resolved' && (
        <div className="pt-2.5 border-t border-gray-100 flex items-center gap-2">
          <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
          <span className="text-xs text-gray-400">Resolved on {incident.resolved_at || incident.date}</span>
        </div>
      )}
    </Card>
  );
}

export default function AdminIncidents({ auth, incidents = [], flash = {} }) {
  const [tab, setTab] = useState('all');

  const filtered = incidents.filter(i => tab === 'all' || i.status === tab);

  const resolve = (id) => {
    router.patch(`/admin/incidents/${id}/resolve`);
  };

  const tabs = [
    { value: 'all',      label: 'All',      count: incidents.length },
    { value: 'pending',  label: 'Pending',  count: incidents.filter(i => i.status === 'pending').length },
    { value: 'resolved', label: 'Resolved', count: incidents.filter(i => i.status === 'resolved').length },
  ];

  return (
    <AppLayout user={auth.user} role="admin">
      <PageHeader
        title="Incident reports"
        subtitle="Review and resolve tenant-reported incidents"
      />

      {flash.success && <div className="mb-5"><Alert type="success">{flash.success}</Alert></div>}

      {/* Severity legend */}
      <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
        <span>Severity:</span>
        {['high', 'medium', 'low'].map(s => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${s === 'high' ? 'bg-red-500' : s === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
            <span className="capitalize">{s}</span>
          </div>
        ))}
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {filtered.length === 0
        ? <EmptyState icon="✅" title="All clear" description="No incidents in this category." />
        : filtered.map(i => <IncidentCard key={i.id} incident={i} onResolve={resolve} />)
      }
    </AppLayout>
  );
}
