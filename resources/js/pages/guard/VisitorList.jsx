import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Search,
  LogIn,
  LogOut,
  ClipboardList,
} from 'lucide-react';

function initials(name) {
  return (name || 'V')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function statusBadge(status) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
          pending
        </Badge>
      );
    case 'checked-in':
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
          checked in
        </Badge>
      );
    case 'checked-out':
      return <Badge variant="secondary">checked out</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

const TABS = [
  { value: 'all', label: 'All today' },
  { value: 'checked-in', label: 'Inside' },
  { value: 'pending', label: 'Expected' },
  { value: 'checked-out', label: 'Checked out' },
];

export default function VisitorList({ auth, visitors = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || '');
  const [tab, setTab] = useState(filters.tab || 'all');

  const counts = useMemo(() => {
    const c = { all: visitors.length, 'checked-in': 0, pending: 0, 'checked-out': 0 };
    visitors.forEach((v) => {
      if (c[v.status] !== undefined) c[v.status]++;
    });
    return c;
  }, [visitors]);

  const displayed = useMemo(() => {
    return visitors.filter((v) => {
      const matchesTab =
        tab === 'all' || v.status === tab;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        v.name?.toLowerCase().includes(q) ||
        v.unit?.toLowerCase().includes(q) ||
        v.phone?.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [visitors, tab, search]);

  return (
    <AppLayout user={auth.user} role="guard">
      <Head title="Visitor List" />

      <PageHeader
        title="Visitor list"
        subtitle={new Date().toLocaleDateString('en-KE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      />

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, unit or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-4 border-b">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.label}
            <span
              className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
                tab === t.value
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {counts[t.value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="size-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No visitors</p>
              <p className="text-xs text-muted-foreground/70">
                No visitors match the current filter.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs">
                            {initials(row.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{row.name}</p>
                          <p className="text-xs text-muted-foreground">{row.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      Unit {row.unit}
                    </TableCell>
                    <TableCell className="text-sm">{row.purpose}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{row.time_in}</p>
                        <p className="text-xs text-muted-foreground">
                          out: {row.time_out}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground capitalize">
                        {row.type || 'invited'}
                      </span>
                    </TableCell>
                    <TableCell>{statusBadge(row.status)}</TableCell>
                    <TableCell className="text-right">
                      {row.status === 'checked-in' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          onClick={() =>
                            router.patch(`/guard/visitors/${row.id}/checkout`)
                          }
                        >
                          <LogOut className="size-3.5 mr-1" />
                          Check out
                        </Button>
                      )}
                      {row.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            router.patch(`/guard/visitors/${row.id}/checkin`)
                          }
                        >
                          <LogIn className="size-3.5 mr-1" />
                          Check in
                        </Button>
                      )}
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
