import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

function SeverityBadge({ severity }) {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">high</Badge>;
    case 'medium':
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">medium</Badge>;
    case 'low':
      return <Badge variant="secondary">low</Badge>;
    default:
      return <Badge variant="secondary">{severity}</Badge>;
  }
}

function StatusBadge({ status }) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">pending</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">resolved</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function IncidentCard({ incident, onResolve }) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-1">{incident.title}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
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
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{incident.description}</p>

        {incident.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
              onClick={() => onResolve(incident.id)}
            >
              <CheckCircle2 className="size-4 mr-1" />
              Mark as resolved
            </Button>
          </div>
        )}

        {incident.status === 'resolved' && (
          <div className="pt-2.5 border-t flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">
              Resolved on {incident.resolved_at || incident.date}
            </span>
          </div>
        )}
      </CardContent>
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
    { value: 'all', label: 'All', count: incidents.length },
    { value: 'pending', label: 'Pending', count: incidents.filter(i => i.status === 'pending').length },
    { value: 'resolved', label: 'Resolved', count: incidents.filter(i => i.status === 'resolved').length },
  ];

  return (
    <AppLayout user={auth.user} role="admin">
      <Head title="Incidents" />

      <PageHeader
        title="Incident reports"
        subtitle="Review and resolve tenant-reported incidents"
      />

      {flash.success && (
        <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {flash.success}
        </div>
      )}

      {/* Severity legend */}
      <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
        <span>Severity:</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Low</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-5 border-b">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.value
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              tab === t.value
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-muted text-muted-foreground'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Incident list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <CheckCircle2 className="size-8 mb-2 text-emerald-500" />
          <p className="text-sm font-medium">All clear</p>
          <p className="text-xs mt-1">No incidents in this category.</p>
        </div>
      ) : (
        filtered.map(i => (
          <IncidentCard key={i.id} incident={i} onResolve={resolve} />
        ))
      )}
    </AppLayout>
  );
}
