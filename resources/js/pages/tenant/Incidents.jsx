import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, CheckCircle, AlertTriangle } from 'lucide-react';

function SeverityBadge({ severity }) {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">high</Badge>;
    case 'medium':
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
          medium
        </Badge>
      );
    case 'low':
    default:
      return <Badge variant="secondary">low</Badge>;
  }
}

function IncidentStatusBadge({ status }) {
  switch (status) {
    case 'resolved':
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
          resolved
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
          pending
        </Badge>
      );
  }
}

function IncidentCard({ incident }) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{incident.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {incident.type} · {incident.date}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SeverityBadge severity={incident.severity} />
            <IncidentStatusBadge status={incident.status} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{incident.description}</p>
        {incident.status === 'resolved' && (
          <div className="mt-2.5 pt-2.5 border-t text-xs text-muted-foreground">
            Resolved by admin
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Incidents({ auth, incidents = [], flash = {} }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('all');

  const { data, setData, post, processing, errors, reset } = useForm({
    type: '',
    title: '',
    description: '',
    severity: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/tenant/incidents', {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  const filtered = incidents.filter((i) => (tab === 'all' ? true : i.status === tab));

  const tabs = [
    { value: 'all', label: 'All', count: incidents.length },
    {
      value: 'pending',
      label: 'Pending',
      count: incidents.filter((i) => i.status === 'pending').length,
    },
    {
      value: 'resolved',
      label: 'Resolved',
      count: incidents.filter((i) => i.status === 'resolved').length,
    },
  ];

  const selectClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <AppLayout user={auth.user} role="tenant">
      <Head title="Incidents" />

      <PageHeader
        title="Incidents"
        subtitle="Report and track estate security or maintenance issues"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 size-4" />
            Report incident
          </Button>
        }
      />

      {flash.success && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="size-4 shrink-0" />
          {flash.success}
        </div>
      )}

      {/* Custom Tab Bar */}
      <div className="flex items-center gap-1 mb-5 p-1 bg-muted rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === t.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            <span
              className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
                tab === t.value
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted-foreground/10 text-muted-foreground'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Incident List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No incidents</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            No incidents in this category.
          </p>
        </div>
      ) : (
        filtered.map((incident) => <IncidentCard key={incident.id} incident={incident} />)
      )}

      {/* Report Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report an incident</DialogTitle>
            <DialogDescription>
              Describe the issue you want to report to estate management
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select type...</option>
                  <option>Security</option>
                  <option>Maintenance</option>
                  <option>Noise</option>
                  <option>Parking</option>
                  <option>Other</option>
                </select>
                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select
                  id="severity"
                  value={data.severity}
                  onChange={(e) => setData('severity', e.target.value)}
                  className={selectClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the incident"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Details</Label>
              <textarea
                id="description"
                placeholder="Describe what happened, when, and any other relevant information..."
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" disabled={processing} className="flex-1">
                {processing ? 'Submitting...' : 'Submit report'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
