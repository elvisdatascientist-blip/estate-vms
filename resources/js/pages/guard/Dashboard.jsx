import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
  Clock,
  UserCheck,
  ScanLine,
  UserPlus,
  ChevronRight,
  LogOut,
  CheckCircle,
  Home,
} from 'lucide-react';

function initials(name) {
  return (name || 'V')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function GuardDashboard({
  auth,
  stats = {},
  inside = [],
  expected = [],
  notification = null,
}) {
  return (
    <AppLayout user={auth.user} role="guard">
      <Head title="Gate Dashboard" />

      <PageHeader
        title="Gate dashboard"
        subtitle={`${auth.user.name} \u00b7 Badge ${auth.user.badge ?? '—'} \u00b7 ${auth.user.shift ?? 'Day shift'}`}
      />

      {/* Notification alert */}
      {notification && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle className="size-4 shrink-0" />
          {notification}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inside estate</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.inside ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Active visitors</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Home className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expected today</p>
                <p className="text-3xl font-bold text-amber-600">{stats.expected ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Pending arrival</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total today</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">All processed</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link href="/guard/scan">
          <Card className="cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all duration-200 group">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform duration-200">
                  <ScanLine className="size-7" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold">Scan QR code</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Verify and check in a pre-invited visitor quickly
                  </p>
                  <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
                    <span>Fast processing</span>
                    <ChevronRight className="size-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/guard/walkin">
          <Card className="cursor-pointer hover:border-teal-300 hover:shadow-md transition-all duration-200 group">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform duration-200">
                  <UserPlus className="size-7" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold">Register walk-in</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Register an unannounced visitor at the gate
                  </p>
                  <div className="mt-2 flex items-center text-xs text-teal-600 font-medium">
                    <span>Manual entry</span>
                    <ChevronRight className="size-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Currently inside table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Currently inside estate</CardTitle>
            <CardDescription>
              {inside.length} visitor{inside.length !== 1 ? 's' : ''} on premises
            </CardDescription>
          </div>
          <Link href="/guard/visitors">
            <Button variant="outline" size="sm">
              Full list
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {inside.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCheck className="size-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Estate is clear</p>
              <p className="text-xs text-muted-foreground/70">
                No visitors currently inside the premises.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Time in</TableHead>
                  <TableHead>Expected out</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inside.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs">
                            {initials(row.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{row.name}</p>
                          <p className="text-xs text-muted-foreground">Unit {row.unit}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{row.purpose}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="size-3" />
                        {row.time_in}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="size-3" />
                        {row.time_out}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
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
