import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Mail, Footprints, BarChart3 } from 'lucide-react';

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

function BarChart({ data = [], peakClass = 'bg-emerald-500', baseClass = 'bg-emerald-200' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground border text-xs px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-10 pointer-events-none">
              {d.value}
            </div>
            <div
              className={`w-full rounded-t transition-all duration-200 group-hover:opacity-90 ${
                d.value === max ? peakClass : baseClass
              }`}
              style={{
                height: `${Math.max(Math.round((d.value / max) * 148), d.value > 0 ? 4 : 0)}px`,
                opacity: d.value === max ? 1 : 0.55,
              }}
            />
            <span className="text-[10px] text-muted-foreground truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PurposeBar({ label, value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm text-muted-foreground w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1">
        <Progress value={pct} className="h-2" />
      </div>
      <span className="text-sm font-medium w-8 text-right">{value}</span>
      <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
    </div>
  );
}

const nativeSelectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function Analytics({ auth, period = 'today', hourly = [], daily = [], byPurpose = [], stats = {} }) {
  const handlePeriod = (p) => router.get('/admin/analytics', { period: p }, { preserveState: true });

  const purposeTotal = byPurpose.reduce((s, p) => s + p.count, 0);

  return (
    <AppLayout user={auth.user} role="admin">
      <Head title="Analytics" />

      <PageHeader
        title="Analytics"
        subtitle="Estate visitor traffic and insights"
        actions={
          <select
            value={period}
            onChange={e => handlePeriod(e.target.value)}
            className={`${nativeSelectClass} w-36`}
          >
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total visitors" value={stats.total ?? 0} icon={Users} color="blue" />
        <StatCard label="Pre-invited" value={stats.invited ?? 0} icon={Mail} color="green" />
        <StatCard label="Walk-ins" value={stats.walkins ?? 0} icon={Footprints} color="orange" />
        <StatCard label="Avg / day" value={stats.avg_day ?? 0} icon={BarChart3} color="slate" />
      </div>

      {/* Hourly chart */}
      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-base">Visitors per hour</CardTitle>
          <CardDescription>Breakdown by hour of the day</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart data={hourly.map(d => ({ label: d.hour, value: d.count }))} />
        </CardContent>
      </Card>

      {/* Daily (if week/month) */}
      {daily.length > 0 && (
        <Card className="mb-5">
          <CardHeader>
            <CardTitle className="text-base">Daily visitor count</CardTitle>
            <CardDescription>Trend for {period === 'week' ? 'this week' : 'this month'}</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={daily.map(d => ({ label: d.day, value: d.count }))}
              peakClass="bg-teal-600"
              baseClass="bg-teal-300"
            />
          </CardContent>
        </Card>
      )}

      {/* Visit type + purpose */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visit type breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <PurposeBar label="Pre-invited" value={stats.invited ?? 0} total={stats.total ?? 1} />
            <PurposeBar label="Walk-in" value={stats.walkins ?? 0} total={stats.total ?? 1} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top visit purposes</CardTitle>
          </CardHeader>
          <CardContent>
            {byPurpose.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            ) : (
              byPurpose.map(p => (
                <PurposeBar key={p.purpose} label={p.purpose} value={p.count} total={purposeTotal} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
