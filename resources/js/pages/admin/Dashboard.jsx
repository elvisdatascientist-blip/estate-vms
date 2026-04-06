import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Home,
  AlertTriangle,
  Shield,
  Download,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

function StatusBadge({ status }) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">pending</Badge>;
    case 'checked-in':
      return <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">checked in</Badge>;
    case 'checked-out':
      return <Badge variant="secondary">checked out</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">resolved</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    blue:    'bg-blue-50 text-blue-600',
    green:   'bg-emerald-50 text-emerald-600',
    red:     'bg-red-50 text-red-600',
    slate:   'bg-slate-100 text-slate-600',
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

function HourlyChart({ data = [] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80 ${
                  d.count === max ? 'bg-emerald-500' : 'bg-emerald-200'
                }`}
                style={{
                  height: `${Math.round((d.count / max) * 112)}px`,
                  minHeight: d.count > 0 ? 4 : 0,
                }}
              />
              {d.count === max && d.count > 0 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                  {d.count}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground">{d.hour}</div>
        ))}
      </div>
      {data.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Peak hour: <span className="text-emerald-600 font-medium">{data.find(d => d.count === max)?.hour}</span> with {max} visitors
        </p>
      )}
    </div>
  );
}

function IncidentRow({ incident, onResolve }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div
        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
          incident.severity === 'high'
            ? 'bg-red-500'
            : incident.severity === 'medium'
            ? 'bg-amber-500'
            : 'bg-blue-400'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{incident.title}</p>
        <p className="text-xs text-muted-foreground">Unit {incident.unit} · {incident.date}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={incident.status} />
        {incident.status === 'pending' && (
          <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-300 hover:bg-emerald-50" onClick={() => onResolve(incident.id)}>
            Resolve
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard({ auth, stats = {}, hourly = [], incidents = [], recentVisitors = [] }) {
  const todayFormatted = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AppLayout user={auth.user} role="admin">
      <Head title="Dashboard" />

      <PageHeader
        title="Estate overview"
        subtitle={todayFormatted}
        actions={
          <Link href="/admin/reports">
            <Button variant="outline" size="sm">
              <Download className="size-4 mr-2" />
              Download report
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Visitors today" value={stats.today ?? 0} icon={Users} color="blue" />
        <StatCard label="Inside now" value={stats.inside ?? 0} icon={Home} color="green" />
        <StatCard label="Open incidents" value={stats.open_incidents ?? 0} icon={AlertTriangle} color="red" />
        <StatCard label="Active guards" value={stats.guards ?? 0} icon={Shield} color="slate" />
      </div>

      {/* Chart + Incidents */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Visitor traffic today</CardTitle>
              <CardDescription>Number of visitors per hour</CardDescription>
            </div>
            <Link href="/admin/analytics">
              <Button size="sm" variant="ghost">
                Full analytics <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <HourlyChart data={hourly} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Open incidents</CardTitle>
              <CardDescription>{incidents.filter(i => i.status === 'pending').length} pending</CardDescription>
            </div>
            <Link href="/admin/incidents">
              <Button size="sm" variant="ghost">
                All <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CheckCircle2 className="size-8 mb-2 text-emerald-500" />
                <p className="text-sm font-medium">All clear</p>
              </div>
            ) : (
              incidents.slice(0, 4).map(i => (
                <IncidentRow
                  key={i.id}
                  incident={i}
                  onResolve={(id) => router.patch(`/admin/incidents/${id}/resolve`)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">Recent visitor activity</CardTitle>
          </div>
          <Link href="/admin/reports">
            <Button size="sm" variant="ghost">
              Full report <ArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentVisitors.slice(0, 6).map(v => {
              const initials = v.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={v.id} className="flex items-center gap-3 py-2.5 border-b last:border-0">
                  <Avatar className="size-8">
                    <AvatarFallback className={`text-xs font-semibold ${
                      v.status === 'checked-in'
                        ? 'bg-emerald-100 text-emerald-700'
                        : v.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{v.name}</p>
                    <p className="text-xs text-muted-foreground">Unit {v.unit} · {v.purpose}</p>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
              );
            })}
            {recentVisitors.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No recent visitor activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
