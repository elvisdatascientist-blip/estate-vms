import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Users, Mail, Footprints, Home, Download, Search } from 'lucide-react';

function StatusBadge({ status }) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">pending</Badge>;
    case 'checked-in':
      return <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">checked in</Badge>;
    case 'checked-out':
      return <Badge variant="secondary">checked out</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function TypeBadge({ type }) {
  if (type === 'walkin') {
    return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Walk-in</Badge>;
  }
  return <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">Invited</Badge>;
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-emerald-50 text-emerald-600',
    orange: 'bg-amber-50 text-amber-600',
    slate:  'bg-slate-100 text-slate-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight mt-1">{value}</p>
          </div>
          <div className={`flex size-10 items-center justify-center rounded-lg ${colorMap[color] || colorMap.slate}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const nativeSelectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function DailyReport({ auth, visitors = [], stats = {}, date, filters = {} }) {
  const [search, setSearch] = useState(filters.search || '');
  const [type, setType] = useState(filters.type || '');

  const applyFilters = (s, t) =>
    router.get('/admin/reports', { date, search: s, type: t }, { preserveState: true, replace: true });

  const handleDownload = () => {
    window.open(`/admin/reports/download?date=${date}`, '_blank');
  };

  const dateFormatted = date
    ? new Date(date).toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <AppLayout user={auth.user} role="admin">
      <Head title="Daily Report" />

      <PageHeader
        title="Daily visitor report"
        subtitle={dateFormatted}
        actions={
          <div className="flex gap-2">
            <Input
              type="date"
              value={date}
              onChange={e => router.get('/admin/reports', { date: e.target.value })}
              className="w-40"
            />
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="size-4 mr-2" />
              Download PDF
            </Button>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total visitors" value={stats.total ?? 0} icon={Users} color="blue" />
        <StatCard label="Pre-invited" value={stats.invited ?? 0} icon={Mail} color="green" />
        <StatCard label="Walk-ins" value={stats.walkins ?? 0} icon={Footprints} color="orange" />
        <StatCard label="Still inside" value={stats.inside ?? 0} icon={Home} color="slate" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID or unit..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              applyFilters(e.target.value, type);
            }}
            className="pl-9"
          />
        </div>
        <select
          value={type}
          onChange={e => {
            setType(e.target.value);
            applyFilters(search, e.target.value);
          }}
          className={`${nativeSelectClass} sm:w-40`}
        >
          <option value="">All types</option>
          <option value="invited">Invited</option>
          <option value="walkin">Walk-in</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {visitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="size-8 mb-2" />
              <p className="text-sm font-medium">No visitors for this date</p>
              <p className="text-xs mt-1">Try selecting a different date.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time in / out</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{row.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{row.id_number}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.phone}</TableCell>
                    <TableCell className="text-sm font-medium">Unit {row.unit}</TableCell>
                    <TableCell className="text-sm">{row.purpose}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {row.time_in} – {row.time_out || '—'}
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={row.type} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
