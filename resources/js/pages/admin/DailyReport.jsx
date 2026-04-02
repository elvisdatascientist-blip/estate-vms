import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, Badge, Button, Input, Select, Table, StatCard, EmptyState } from '@/components/ui';

export default function DailyReport({ auth, visitors = [], stats = {}, date, filters = {} }) {
  const [search, setSearch] = useState(filters.search || '');
  const [type,   setType]   = useState(filters.type   || '');

  const applyFilters = (s, t) => router.get('/admin/reports', { date, search: s, type: t }, { preserveState: true, replace: true });

  const handleDownload = () => {
    window.open(`/admin/reports/download?date=${date}`, '_blank');
  };

  const columns = [
    {
      header: 'Visitor',
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-400 font-mono">{row.id_number}</p>
        </div>
      ),
    },
    { header: 'Phone',   cell: (row) => <span className="text-sm text-gray-600">{row.phone}</span> },
    { header: 'Unit',    cell: (row) => <span className="text-sm font-medium text-gray-700">Unit {row.unit}</span> },
    { header: 'Purpose', cell: (row) => row.purpose },
    {
      header: 'Time in / out',
      cell: (row) => <span className="text-sm text-gray-600 whitespace-nowrap">{row.time_in} – {row.time_out}</span>,
    },
    {
      header: 'Type',
      cell: (row) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.type === 'walkin' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
          {row.type === 'walkin' ? 'Walk-in' : 'Invited'}
        </span>
      ),
    },
    { header: 'Status', cell: (row) => <Badge variant={row.status}>{row.status.replace('-', ' ')}</Badge> },
  ];

  return (
    <AppLayout user={auth.user} role="admin">
      <PageHeader
        title="Daily visitor report"
        subtitle={new Date(date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={
          <div className="flex gap-2">
            <Input
              type="date"
              value={date}
              onChange={e => router.get('/admin/reports', { date: e.target.value })}
              className="w-40"
            />
            <Button variant="success" onClick={handleDownload}>⬇ Download PDF</Button>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total visitors"  value={stats.total ?? 0}   icon="👥" color="blue"   />
        <StatCard label="Pre-invited"     value={stats.invited ?? 0} icon="✉" color="green"  />
        <StatCard label="Walk-ins"        value={stats.walkins ?? 0} icon="🚶" color="orange" />
        <StatCard label="Still inside"    value={stats.inside ?? 0}  icon="🏠" color="slate"  />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Search by name, ID or unit…"
          value={search}
          onChange={e => { setSearch(e.target.value); applyFilters(e.target.value, type); }}
          icon="🔍"
          className="flex-1"
        />
        <Select
          value={type}
          onChange={e => { setType(e.target.value); applyFilters(search, e.target.value); }}
          className="sm:w-40"
        >
          <option value="">All types</option>
          <option value="invited">Invited</option>
          <option value="walkin">Walk-in</option>
        </Select>
      </div>

      <Card padding={false}>
        <Table
          columns={columns}
          data={visitors}
          emptyState={
            <EmptyState
              icon="📋"
              title="No visitors for this date"
              description="Try selecting a different date."
            />
          }
        />
      </Card>
    </AppLayout>
  );
}
