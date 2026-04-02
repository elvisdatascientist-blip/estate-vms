import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, Badge, Avatar, Button, Input, Select, Table, Tabs, EmptyState } from '@/components/ui';

export default function VisitorList({ auth, visitors = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || '');
  const [tab, setTab]       = useState(filters.tab || 'all');

  const applyFilters = (newSearch, newTab) => {
    router.get('/guard/visitors', { search: newSearch, tab: newTab }, { preserveState: true, replace: true });
  };

  const tabs = [
    { value: 'all',         label: 'All today',     count: visitors.length },
    { value: 'checked-in',  label: 'Inside',        count: visitors.filter(v => v.status === 'checked-in').length },
    { value: 'pending',     label: 'Expected',      count: visitors.filter(v => v.status === 'pending').length },
    { value: 'checked-out', label: 'Checked out',   count: visitors.filter(v => v.status === 'checked-out').length },
  ];

  const displayed = visitors.filter(v => {
    const matchesTab    = tab === 'all' || v.status === tab;
    const matchesSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.unit?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const columns = [
    {
      header: 'Visitor',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">{row.phone}</p>
          </div>
        </div>
      ),
    },
    { header: 'Unit',    cell: (row) => <span className="text-sm font-medium text-gray-700">Unit {row.unit}</span> },
    { header: 'Purpose', cell: (row) => row.purpose },
    {
      header: 'Time',
      cell: (row) => (
        <div>
          <p className="text-sm text-gray-700">{row.time_in}</p>
          <p className="text-xs text-gray-400">out: {row.time_out}</p>
        </div>
      ),
    },
    { header: 'Type',   cell: (row) => <span className="text-xs text-gray-500 capitalize">{row.type || 'invited'}</span> },
    { header: 'Status', cell: (row) => <Badge variant={row.status}>{row.status.replace('-', ' ')}</Badge> },
    {
      header: '',
      cell: (row) => row.status === 'checked-in'
        ? <Button size="xs" variant="outline" onClick={() => router.patch(`/guard/visitors/${row.id}/checkout`)}>Check out</Button>
        : row.status === 'pending'
        ? <Button size="xs" variant="primary" onClick={() => router.patch(`/guard/visitors/${row.id}/checkin`)}>Check in</Button>
        : null,
    },
  ];

  return (
    <AppLayout user={auth.user} role="guard">
      <PageHeader
        title="Visitor list"
        subtitle={`${new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      />

      <div className="mb-4">
        <Input
          placeholder="Search by name or unit…"
          value={search}
          onChange={e => { setSearch(e.target.value); applyFilters(e.target.value, tab); }}
          icon="🔍"
          className="max-w-sm"
        />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={val => { setTab(val); applyFilters(search, val); }} />

      <Card padding={false}>
        <Table
          columns={columns}
          data={displayed}
          emptyState={<EmptyState icon="📋" title="No visitors" description="No visitors match the current filter." />}
        />
      </Card>
    </AppLayout>
  );
}
