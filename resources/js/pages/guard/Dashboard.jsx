import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, StatCard, Badge, Avatar, Button, Table, EmptyState, Alert } from '@/components/ui';

export default function GuardDashboard({ auth, stats = {}, inside = [], expected = [], notification = null }) {
  const insideColumns = [
    {
      header: 'Visitor',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" status="online" />
          <div>
            <p className="text-sm font-semibold text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">Unit {row.unit}</p>
          </div>
        </div>
      ),
    },
    { header: 'Purpose',  cell: (row) => <span className="text-sm text-gray-600 font-medium">{row.purpose}</span> },
    { 
      header: 'Time in',  
      cell: (row) => (
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">{row.time_in}</span>
        </div>
      )
    },
    { 
      header: 'Expected out', 
      cell: (row) => (
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">{row.time_out}</span>
        </div>
      )
    },
    {
      header: 'Action',
      cell: (row) => (
        <Link href={`/guard/checkout/${row.id}`} method="patch" as="button">
          <Button size="xs" variant="outline" className="hover:bg-red-50 hover:border-red-300 hover:text-red-600">
            Check out
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <AppLayout user={auth.user} role="guard">
      <PageHeader
        title="Gate dashboard"
        subtitle={`${auth.user.name} · Badge ${auth.user.badge} · ${auth.user.shift}`}
      />

      {notification && (
        <div className="mb-5 animate-slide-down">
          <Alert type="success">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {notification}
            </div>
          </Alert>
        </div>
      )}

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard 
          label="Inside estate"   
          value={stats.inside ?? 0}    
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          } 
          color="green"  
          trend="Active visitors"
        />
        <StatCard 
          label="Expected today"  
          value={stats.expected ?? 0}  
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
          color="orange" 
          trend="Pending arrival"
        />
        <StatCard 
          label="Total today"     
          value={stats.total ?? 0}     
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
          color="blue"   
          trend="All processed"
        />
      </div>

      {/* Enhanced Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link href="/guard/scan">
          <Card className="cursor-pointer hover:border-brand-300 hover:shadow-lg transition-all duration-300 group card-hover">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <span className="text-3xl">⬡</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-800 mb-1" style={{ fontFamily: 'var(--font-display)' }}>Scan QR code</p>
                <p className="text-sm text-gray-500">Verify and check in a pre-invited visitor quickly</p>
                <div className="mt-2 flex items-center text-xs text-brand-600 font-medium">
                  <span>Fast processing</span>
                  <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/guard/walkin">
          <Card className="cursor-pointer hover:border-green-300 hover:shadow-lg transition-all duration-300 group card-hover">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <span className="text-3xl">➕</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-800 mb-1" style={{ fontFamily: 'var(--font-display)' }}>Register walk-in</p>
                <p className="text-sm text-gray-500">Register an unannounced visitor at the gate</p>
                <div className="mt-2 flex items-center text-xs text-green-600 font-medium">
                  <span>Manual entry</span>
                  <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Enhanced Currently inside */}
      <Card padding={false} className="animate-slide-up">
        <div className="px-6 pt-6 pb-0">
          <CardHeader
            title="Currently inside estate"
            subtitle={`${inside.length} visitor${inside.length !== 1 ? 's' : ''} on premises`}
            action={
              <Link href="/guard/visitors">
                <Button size="sm" variant="outline" className="hover:bg-accent-bg hover:border-accent">
                  Full list →
                </Button>
              </Link>
            }
          />
        </div>
        <Table
          columns={insideColumns}
          data={inside}
          hover={true}
          emptyState={
            <EmptyState 
              icon="🏡" 
              title="Estate is clear" 
              description="No visitors currently inside the premises." 
            />
          }
        />
      </Card>
    </AppLayout>
  );
}
