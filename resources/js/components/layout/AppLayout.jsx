import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Avatar, Badge } from '../ui/index';

/* ─── Inline SVG Icons ─────────────────────────────────────────── */
const icon = (path, viewBox = '0 0 24 24') => ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {typeof path === 'string' ? <path d={path} /> : path}
  </svg>
);

const GridIcon      = icon(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>);
const PlusCircleIcon= icon('M12 5v14M5 12h14');
const UsersIcon     = icon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75');
const AlertIcon     = icon('M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01');
const UserIcon      = icon('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z');
const ScanIcon      = icon(<><polyline points="4 7 4 4 7 4"/><polyline points="17 4 20 4 20 7"/><polyline points="20 17 20 20 17 20"/><polyline points="7 20 4 20 4 17"/><rect x="9" y="9" width="6" height="6"/></>);
const ChartIcon     = icon(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>);
const FileIcon      = icon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8');
const ShieldIcon    = icon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z');
const BellIcon      = icon('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0');
const MenuIcon      = icon(<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>);
const LogoutIcon    = icon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9');

/* ─── Role labels ──────────────────────────────────────────────── */
const ROLE_LABELS = {
  tenant: 'Resident Portal',
  guard:  'Security Portal',
  admin:  'Management',
};

/* ─── Nav configs per role ─────────────────────────────────────── */
const NAV = {
  tenant: [
    { href: '/tenant/dashboard',  label: 'Dashboard',     icon: GridIcon },
    { href: '/tenant/invite',     label: 'Invite Visitor', icon: PlusCircleIcon },
    { href: '/tenant/visitors',   label: 'My Visitors',    icon: UsersIcon },
    { href: '/tenant/incidents',  label: 'Incidents',      icon: AlertIcon },
    { href: '/tenant/profile',    label: 'Profile',        icon: UserIcon },
  ],
  guard: [
    { href: '/guard/dashboard',   label: 'Dashboard',      icon: GridIcon },
    { href: '/guard/scan',        label: 'Scan QR',        icon: ScanIcon },
    { href: '/guard/walkin',      label: 'Walk-in',        icon: PlusCircleIcon },
    { href: '/guard/visitors',    label: 'Visitor List',   icon: UsersIcon },
  ],
  admin: [
    { href: '/admin/dashboard',   label: 'Dashboard',      icon: GridIcon },
    { href: '/admin/analytics',   label: 'Analytics',      icon: ChartIcon },
    { href: '/admin/reports',     label: 'Daily Report',   icon: FileIcon },
    { href: '/admin/guards',      label: 'Guards',         icon: ShieldIcon },
    { href: '/admin/incidents',   label: 'Incidents',      icon: AlertIcon },
  ],
};

/* ─── Layout ────────────────────────────────────────────────────── */
export default function AppLayout({ children, user, role = 'tenant', notifications = [] }) {
  const { url } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = NAV[role] || NAV.tenant;

  return (
    <div className="flex h-screen overflow-hidden animate-fade-in" style={{ background: 'var(--gray-50)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 lg:hidden animate-fade-in" 
          style={{ background: 'rgba(26,26,46,.5)', backdropFilter: 'blur(4px)' }} 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar — Dark premium */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 flex flex-col
        transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:flex
        ${sidebarOpen ? 'translate-x-0 animate-slide-in-left' : '-translate-x-full'}
      `} style={{ width: 'var(--sidebar-w, 256px)', minWidth: 256, background: 'var(--brand-900)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-transform duration-200 hover:scale-110"
            style={{ background: 'var(--accent)', color: 'var(--brand-900)', fontFamily: 'var(--font-display)' }}>GP</div>
          <div>
            <p className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>GreenPark</p>
            <p className="text-[10px] mt-0.5 uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>{ROLE_LABELS[role] || role}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,.35)' }}>Navigation</p>
          <div className="flex flex-col gap-0.5">
            {nav.map((item, index) => {
              const active = url.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden"
                  style={{
                    background: active ? 'rgba(201,168,76,.12)' : 'transparent',
                    color: active ? '#c9a84c' : 'rgba(255,255,255,.6)',
                    transform: active ? 'translateX(4px)' : 'translateX(0)',
                  }}
                  onMouseEnter={e => { 
                    if (!active) { 
                      e.currentTarget.style.background = 'rgba(255,255,255,.06)'; 
                      e.currentTarget.style.color = 'rgba(255,255,255,.9)'; 
                      e.currentTarget.style.transform = 'translateX(2px)';
                    } 
                  }}
                  onMouseLeave={e => { 
                    if (!active) { 
                      e.currentTarget.style.background = 'transparent'; 
                      e.currentTarget.style.color = 'rgba(255,255,255,.6)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    } 
                  }}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span className="flex-1">{item.label}</span>
                  {active && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User block */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform duration-200 hover:scale-110"
              style={{ background: 'var(--accent)', color: 'var(--brand-900)' }}>
              {(user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,.4)' }}>{user?.unit ? `Unit ${user.unit}` : user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={() => router.post('/logout')}
            className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium transition-all duration-200 group"
            style={{ color: 'rgba(255,255,255,.5)' }}
            onMouseEnter={e => { 
              e.currentTarget.style.background = 'rgba(220,38,38,.15)'; 
              e.currentTarget.style.color = '#fca5a5';
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.background = 'transparent'; 
              e.currentTarget.style.color = 'rgba(255,255,255,.5)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <LogoutIcon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white px-6 flex items-center justify-between shrink-0 shadow-sm animate-slide-down" style={{ height: 'var(--topbar-h, 60px)', borderBottom: '1px solid var(--gray-200)' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-all duration-200 hover:scale-110">
            <MenuIcon className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-all duration-200 hover:scale-110">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
              </button>
            )}
            <Link href={`/${role}/profile`} className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-800">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400 capitalize">{role}</p>
              </div>
              <Avatar name={user?.name || 'User'} size="sm" status="online" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ─── Page wrapper helpers ─────────────────────────────────────── */
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between mb-8 gap-4">
    <div>
      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);
