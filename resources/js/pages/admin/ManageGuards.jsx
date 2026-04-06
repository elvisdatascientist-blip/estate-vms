import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Plus, Shield } from 'lucide-react';

const nativeSelectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function ManageGuards({ auth, guards = [], flash = {} }) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    badge: '',
    phone: '',
    email: '',
    shift: 'Day (6am-6pm)',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/guards', {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <AppLayout user={auth.user} role="admin">
      <Head title="Guards" />

      <PageHeader
        title="Guards"
        subtitle="Manage estate security personnel"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4 mr-2" />
            Register guard
          </Button>
        }
      />

      {flash.success && (
        <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {flash.success}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {guards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Shield className="size-8 mb-2" />
              <p className="text-sm font-medium">No guards registered</p>
              <p className="text-xs mt-1 mb-3">Register your first guard to get started.</p>
              <Button size="sm" onClick={() => setOpen(true)}>
                <Plus className="size-4 mr-1" />
                Register guard
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guard</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guards.map(guard => {
                  const initials = guard.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <TableRow key={guard.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{guard.name}</p>
                            <p className="text-xs text-muted-foreground">{guard.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-0.5 rounded">{guard.badge}</code>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{guard.phone}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{guard.shift}</TableCell>
                      <TableCell>
                        {guard.status === 'on-duty' ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">on-duty</Badge>
                        ) : (
                          <Badge variant="secondary">off-duty</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost">Edit</Button>
                          <Button size="sm" variant="destructive">Remove</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Register guard dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register new guard</DialogTitle>
            <DialogDescription>Add a new security guard to the estate.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guard-name">Full name *</Label>
                <Input
                  id="guard-name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Guard's full name"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guard-badge">Badge number *</Label>
                <Input
                  id="guard-badge"
                  value={data.badge}
                  onChange={e => setData('badge', e.target.value)}
                  placeholder="e.g. G004"
                />
                {errors.badge && <p className="text-xs text-destructive">{errors.badge}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guard-phone">Phone *</Label>
                <Input
                  id="guard-phone"
                  type="tel"
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                  placeholder="07XXXXXXXX"
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guard-email">Email</Label>
                <Input
                  id="guard-email"
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="guard@estate.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guard-shift">Shift *</Label>
              <select
                id="guard-shift"
                value={data.shift}
                onChange={e => setData('shift', e.target.value)}
                className={nativeSelectClass}
              >
                <option>Day (6am-6pm)</option>
                <option>Night (6pm-6am)</option>
              </select>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Registering...' : 'Register guard'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
