import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, StatCard, Badge, Avatar, Button, Alert, Table, EmptyState } from '@/components/ui';

export default function TenantDashboard({ auth, visitors = [], stats = {}, notification = null }) {
  const todayVisitors = visitors.filter(v => v.date === new Date().toISOString().slice(0, 10));

  const columns = [
    {
      header: 'Visitor',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" status={row.status === 'checked-in' ? 'online' : 'offline'} />
          <div>
            <p className="text-sm font-semibold text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">{row.phone}</p>
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
      header: 'Time out', 
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
      header: 'Status',
      cell: (row) => (
        <Badge 
          variant={row.status} 
          className={`${row.status === 'checked-in' ? 'badge-glow' : ''}`}
        >
          {row.status.replace('-', ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <AppLayout user={auth.user} role="tenant">
      <PageHeader
        title={`Good morning, ${auth.user.name.split(' ')[0]} 👋`}
        subtitle={`Unit ${auth.user.unit} · GreenPark Estate`}
        actions={
          <Link href="/tenant/invite">
            <Button variant="accent" size="lg" icon={<span>+</span>}>Invite visitor</Button>
          </Link>
        }
      />

      {notification && (
        <div className="mb-5 animate-slide-down">
          <Alert type="success" onClose={() => {}}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              🔔 {notification}
            </div>
          </Alert>
        </div>
      )}

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mobile-stat-grid">
        <StatCard 
          label="Today's visitors" 
          value={stats.today ?? 0}       
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
          color="blue"   
          trend="↑ 12% from yesterday"
        />
        <StatCard 
          label="Inside estate"    
          value={stats.inside ?? 0}      
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          } 
          color="green"  
          trend="Active now"
        />
        <StatCard 
          label="Expected"         
          value={stats.pending ?? 0}     
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
          color="orange" 
          trend="Arriving soon"
        />
        <StatCard 
          label="Total invites"    
          value={stats.total_month ?? 0} 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          } 
          color="slate"  
          trend="This month"
        />
      </div>

      {/* Enhanced Today's visitor list */}
      <Card padding={false} className="animate-slide-up mobile-card" hover={false}>
        <div className="px-6 pt-6 pb-4 mobile-xs-card">
          <CardHeader
            title="Today's visitors"
            subtitle={new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}
            action={
              <Link href="/tenant/visitors">
                <Button size="sm" variant="outline" className="hover:bg-accent-bg hover:border-accent mobile-button-full">
                  View all →
                </Button>
              </Link>
            }
          />
        </div>
        <div className="mobile-table">
          <Table
            columns={columns}
            data={todayVisitors}
            hover={true}
            emptyState={
              <EmptyState
                icon="📭"
                title="No visitors today"
                description="Invite a visitor and they'll appear here once they have a status update."
                action={
                  <Link href="/tenant/invite">
                    <Button variant="accent" size="sm" className="mobile-button-full">Invite someone</Button>
                  </Link>
                }
              />
            }
          />
        </div>
      </Card>
    </AppLayout>
  );
}
