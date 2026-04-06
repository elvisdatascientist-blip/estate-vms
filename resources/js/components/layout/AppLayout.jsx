import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  AlertTriangle,
  UserCircle,
  ScanLine,
  BarChart3,
  FileText,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const ROLE_LABELS = {
  tenant: 'Resident Portal',
  guard:  'Security Portal',
  admin:  'Management',
};

const NAV = {
  tenant: [
    { href: '/tenant/dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
    { href: '/tenant/invite',     label: 'Invite Visitor', icon: UserPlus },
    { href: '/tenant/visitors',   label: 'My Visitors',    icon: Users },
    { href: '/tenant/incidents',  label: 'Incidents',      icon: AlertTriangle },
    { href: '/tenant/profile',    label: 'Profile',        icon: UserCircle },
  ],
  guard: [
    { href: '/guard/dashboard',   label: 'Dashboard',      icon: LayoutDashboard },
    { href: '/guard/scan',        label: 'Scan QR',        icon: ScanLine },
    { href: '/guard/walkin',      label: 'Walk-in',        icon: UserPlus },
    { href: '/guard/visitors',    label: 'Visitor List',   icon: Users },
  ],
  admin: [
    { href: '/admin/dashboard',   label: 'Dashboard',      icon: LayoutDashboard },
    { href: '/admin/analytics',   label: 'Analytics',      icon: BarChart3 },
    { href: '/admin/reports',     label: 'Daily Report',   icon: FileText },
    { href: '/admin/guards',      label: 'Guards',         icon: Shield },
    { href: '/admin/incidents',   label: 'Incidents',      icon: AlertTriangle },
  ],
};

function AppSidebar({ user, role }) {
  const { url } = usePage();
  const nav = NAV[role] || NAV.tenant;
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            GP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">GreenPark</span>
            <span className="text-[10px] uppercase tracking-widest text-sidebar-primary">
              {ROLE_LABELS[role] || role}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = url.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="cursor-pointer">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left text-xs leading-tight">
                    <span className="truncate font-medium">{user?.name || 'User'}</span>
                    <span className="truncate text-muted-foreground">
                      {user?.unit ? `Unit ${user.unit}` : user?.email || ''}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                {role !== 'guard' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={`/${role}/profile`}>
                        <UserCircle className="mr-2 size-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => router.post('/logout')}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AppLayout({ children, user, role = 'tenant' }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} role={role} />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <span className="text-xs font-medium text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors position="top-right" />
    </TooltipProvider>
  );
}

export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>}
  </div>
);
