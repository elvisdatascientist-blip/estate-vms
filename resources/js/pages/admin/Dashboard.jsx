import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, StatCard, Badge, Button, EmptyState } from '@/components/ui';

function HourlyChart({ data = [] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full">
              <div
                className="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                style={{
                  height: `${Math.round((d.count / max) * 112)}px`,
                  background: d.count === max ? 'var(--brand-500)' : 'var(--brand-200)',
                  minHeight: d.count > 0 ? 4 : 0,
                }}
              />
              {d.count === max && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-brand-700 whitespace-nowrap">
                  {d.count}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-gray-400">{d.hour}</div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Peak hour: <span className="text-brand-600 font-medium">{data.find(d => d.count === max)?.hour}</span> with {max} visitors
      </p>
    </div>
  );
}

function IncidentRow({ incident, onResolve }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${incident.severity === 'high' ? 'bg-red-500' : incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{incident.title}</p>
        <p className="text-xs text-gray-400">Unit {incident.unit} · {incident.date}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={incident.status}>{incident.status}</Badge>
        {incident.status === 'pending' && (
          <Button size="xs" variant="success" onClick={() => onResolve(incident.id)}>Resolve</Button>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard({ auth, stats = {}, hourly = [], incidents = [], recentVisitors = [] }) {
  return (
    <AppLayout user={auth.user} role="admin">
      <PageHeader
        title="Estate overview"
        subtitle={new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={
          <Link href="/admin/reports">
            <Button variant="outline" size="sm">⬇ Download today's report</Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Visitors today"   value={stats.today ?? 0}        icon="👥" color="blue"   trend="vs yesterday" />
        <StatCard label="Inside now"       value={stats.inside ?? 0}       icon="🏠" color="green"  />
        <StatCard label="Open incidents"   value={stats.open_incidents ?? 0} icon="⚠" color="red"   />
        <StatCard label="Active guards"    value={stats.guards ?? 0}       icon="🛡" color="slate"  />
      </div>

      {/* Chart + Incidents */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Visitor traffic today"
            subtitle="Number of visitors per hour"
            action={<Link href="/admin/analytics"><Button size="sm" variant="ghost">Full analytics →</Button></Link>}
          />
          <HourlyChart data={hourly} />
        </Card>

        <Card>
          <CardHeader
            title="Open incidents"
            subtitle={`${incidents.filter(i => i.status === 'pending').length} pending`}
            action={<Link href="/admin/incidents"><Button size="sm" variant="ghost">All →</Button></Link>}
          />
          {incidents.length === 0
            ? <EmptyState icon="✅" title="All clear" />
            : incidents.slice(0, 4).map(i => (
                <IncidentRow key={i.id} incident={i} onResolve={(id) => router.patch(`/admin/incidents/${id}/resolve`)} />
              ))
          }
        </Card>
      </div>

      {/* Recent visitors */}
      <Card>
        <CardHeader
          title="Recent visitor activity"
          action={<Link href="/admin/reports"><Button size="sm" variant="ghost">Full report →</Button></Link>}
        />
        <div className="space-y-0">
          {recentVisitors.slice(0, 6).map(v => (
            <div key={v.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${v.status === 'checked-in' ? 'bg-green-100 text-green-700' : v.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                {v.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{v.name}</p>
                <p className="text-xs text-gray-400">Unit {v.unit} · {v.purpose}</p>
              </div>
              <Badge variant={v.status}>{v.status.replace('-', ' ')}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}
