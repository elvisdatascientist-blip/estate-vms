import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, StatCard, Select } from '@/components/ui';

function BarChart({ data = [], color = 'var(--brand-700)', peakColor = 'var(--accent)' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default relative">
          {/* Tooltip */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
            {d.value}
          </div>
          <div
            className="w-full rounded-t transition-all duration-200 group-hover:opacity-90"
            style={{
              height: `${Math.max(Math.round((d.value / max) * 148), d.value > 0 ? 4 : 0)}px`,
              background: d.value === max ? peakColor : color,
              opacity: d.value === max ? 1 : 0.55,
            }}
          />
          <span className="text-[10px] text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function PurposeBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-sm text-gray-600 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'var(--brand-600)' }} />
      </div>
      <span className="text-sm font-medium text-gray-700 w-8 text-right">{value}</span>
      <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function Analytics({ auth, period = 'today', hourly = [], daily = [], byPurpose = [], stats = {} }) {
  const handlePeriod = (p) => router.get('/admin/analytics', { period: p });

  const purposeTotal = byPurpose.reduce((s, p) => s + p.count, 0);

  return (
    <AppLayout user={auth.user} role="admin">
      <PageHeader
        title="Analytics"
        subtitle="Estate visitor traffic and insights"
        actions={
          <Select value={period} onChange={e => handlePeriod(e.target.value)} className="w-36">
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </Select>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total visitors"   value={stats.total ?? 0}     icon="👥" color="blue"   />
        <StatCard label="Pre-invited"      value={stats.invited ?? 0}   icon="✉" color="green"  />
        <StatCard label="Walk-ins"         value={stats.walkins ?? 0}   icon="🚶" color="orange" />
        <StatCard label="Avg / day"        value={stats.avg_day ?? 0}   icon="📊" color="slate"  />
      </div>

      {/* Hourly chart */}
      <Card className="mb-5">
        <CardHeader title="Visitors per hour" subtitle="Breakdown by hour of the day" />
        <BarChart data={hourly.map(d => ({ label: d.hour, value: d.count }))} />
      </Card>

      {/* Daily (if week/month) */}
      {daily.length > 0 && (
        <Card className="mb-5">
          <CardHeader title="Daily visitor count" subtitle={`Trend for ${period === 'week' ? 'this week' : 'this month'}`} />
          <BarChart data={daily.map(d => ({ label: d.day, value: d.count }))} color="var(--brand-400)" peakColor="var(--brand-700)" />
        </Card>
      )}

      {/* Visit type + purpose */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Visit type breakdown" />
          <div className="space-y-2">
            {[
              { label: 'Pre-invited', value: stats.invited ?? 0 },
              { label: 'Walk-in',     value: stats.walkins ?? 0 },
            ].map(item => (
              <PurposeBar key={item.label} {...item} total={stats.total ?? 1} />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Top visit purposes" />
          {byPurpose.map(p => (
            <PurposeBar key={p.purpose} label={p.purpose} value={p.count} total={purposeTotal} />
          ))}
        </Card>
      </div>
    </AppLayout>
  );
}
