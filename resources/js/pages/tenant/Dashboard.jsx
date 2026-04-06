import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Users,
  Home,
  Clock,
  FileText,
  Plus,
  CheckCircle,
} from 'lucide-react';

function StatusBadge({ status }) {
  switch (status) {
    case 'checked-in':
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
          checked in
        </Badge>
      );
    case 'checked-out':
      return <Badge variant="secondary">checked out</Badge>;
    case 'pending':
    default:
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
          pending
        </Badge>
      );
  }
}

const statCards = [
  { key: 'today', label: "Today's visitors", icon: Users, color: 'text-blue-600 bg-blue-50' },
  { key: 'inside', label: 'Inside estate', icon: Home, color: 'text-emerald-600 bg-emerald-50' },
  { key: 'pending', label: 'Expected', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  { key: 'total_month', label: 'Total invites this month', icon: FileText, color: 'text-slate-600 bg-slate-50' },
];

export default function TenantDashboard({ auth, visitors = [], stats = {}, notification = null }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayVisitors = visitors.filter((v) => v.date === today);

  const getInitials = (name) =>
    (name || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <AppLayout user={auth.user} role="tenant">
      <Head title="Dashboard" />

      <PageHeader
        title={`Good morning, ${auth.user.name.split(' ')[0]}`}
        subtitle={`Unit ${auth.user.unit} · GreenPark Estate`}
        actions={
          <Link href="/tenant/invite">
            <Button size="lg">
              <Plus className="mr-2 size-4" />
              Invite visitor
            </Button>
          </Link>
        }
      />

      {notification && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="size-4 shrink-0" />
          {notification}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight">{stats[key] ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Visitors Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Today's visitors</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-KE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
          <Link href="/tenant/visitors">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {todayVisitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="size-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No visitors today</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Invite a visitor and they will appear here.
              </p>
              <Link href="/tenant/invite" className="mt-4">
                <Button variant="outline" size="sm">
                  Invite someone
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time in</TableHead>
                  <TableHead>Time out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayVisitors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs bg-emerald-50 text-emerald-700">
                            {getInitials(v.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{v.name}</p>
                          <p className="text-xs text-muted-foreground">{v.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{v.purpose}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="size-3" />
                        {v.time_in}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="size-3" />
                        {v.time_out}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} />
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
