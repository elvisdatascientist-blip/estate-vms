import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
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
import { Plus, Shield, Trash2 } from 'lucide-react';

const nativeSelectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function ManageGuards({ auth, guards = [], flash = {} }) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingGuard, setEditingGuard] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data, setData, post, patch, processing, errors, reset } = useForm({
    name: '',
    badge: '',
    phone: '',
    email: '',
    shift: 'Day (6am-6pm)',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      patch(`/admin/guards/${editingGuard.id}`, {
        onSuccess: () => {
          reset();
          setOpen(false);
          setEditMode(false);
          setEditingGuard(null);
        },
      });
    } else {
      post('/admin/guards', {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      });
    }
  };

  const openEditDialog = (guard) => {
    setEditingGuard(guard);
    setEditMode(true);
    setData({
      name: guard.name,
      badge: guard.badge,
      phone: guard.phone,
      email: guard.email || '',
      shift: guard.shift,
      password: '',
    });
    setOpen(true);
  };

  const openCreateDialog = () => {
    setEditMode(false);
    setEditingGuard(null);
    reset();
    setOpen(true);
  };

  const handleDelete = (guardId) => {
    router.delete(`/admin/guards/${guardId}`, {
      onSuccess: () => setDeleteConfirm(null),
    });
  };

  return (
    <AppLayout user={auth.user} role="admin">
      <Head title="Guards" />

      <PageHeader
        title="Guards"
        subtitle="Manage estate security personnel"
        actions={
          <Button onClick={openCreateDialog}>
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
              <Button size="sm" onClick={openCreateDialog}>
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
                          <Button size="sm" variant="ghost" onClick={() => openEditDialog(guard)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(guard)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
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

      {/* Register/Edit guard dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit guard' : 'Register new guard'}</DialogTitle>
            <DialogDescription>
              {editMode ? 'Update guard information.' : 'Add a new security guard to the estate.'}
            </DialogDescription>
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
                  onChange={e => setData('badge', e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
                  placeholder="e.g. G004"
                  maxLength="20"
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
                  onChange={e => setData('phone', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="07XXXXXXXX (10-13 digits)"
                  maxLength="13"
                  minLength="10"
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
            {!editMode && (
              <div className="space-y-2">
                <Label htmlFor="guard-password">Password *</Label>
                <Input
                  id="guard-password"
                  type="password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength="8"
                />
                <p className="text-xs text-muted-foreground">
                  Guard can change this password after first login
                </p>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? (editMode ? 'Updating...' : 'Registering...') : (editMode ? 'Update guard' : 'Register guard')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove guard</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {deleteConfirm?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteConfirm?.id)}>
              Remove guard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
