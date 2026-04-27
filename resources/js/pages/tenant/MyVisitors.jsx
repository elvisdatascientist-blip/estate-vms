import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Plus, Search, QrCode, Trash2, Send, Copy, Users } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/dateUtils';
import QRCodeReact from 'react-qr-code';

function StatusBadge({ status }) {
  switch (status) {
    case 'checked-in':
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
          checked in
        </Badge>
      );
    case 'checked-out':
      return <Badge variant="secondary">checked out</Badge>;
    case 'pending':
    default:
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
          pending
        </Badge>
      );
  }
}

export default function MyVisitors({ auth, visitors = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [qrModal, setQrModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const applyFilters = (newSearch, newStatus) => {
    router.get(
      '/tenant/visitors',
      { search: newSearch, status: newStatus },
      { preserveState: true, replace: true }
    );
  };

  const handleSearch = (val) => {
    setSearch(val);
    applyFilters(val, status);
  };

  const handleStatus = (val) => {
    setStatus(val);
    applyFilters(search, val);
  };

  const confirmDelete = () => {
    router.delete(`/tenant/visitors/${deleteId}`, {
      onSuccess: () => setDeleteId(null),
    });
  };

  const getInitials = (name) =>
    (name || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const selectClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <AppLayout user={auth.user} role="tenant">
      <Head title="My Visitors" />

      <PageHeader
        title="My visitors"
        subtitle="View and manage all your invited guests"
        actions={
          <Link href="/tenant/invite">
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              New invite
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className={`${selectClass} sm:w-44`}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="checked-in">Checked in</option>
          <option value="checked-out">Checked out</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {visitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="size-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No visitors found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try adjusting your filters or invite a new visitor.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs bg-emerald-50 text-emerald-700">
                            {getInitials(v.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{v.name}</p>
                          <p className="text-xs text-muted-foreground">{v.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {v.id_number}
                    </TableCell>
                    <TableCell className="text-sm">{v.purpose}</TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(v.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(v.time_in)} - {formatTime(v.time_out)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setQrModal(v)}
                        >
                          <QrCode className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(v.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* QR Modal */}
      <Dialog open={!!qrModal} onOpenChange={(open) => !open && setQrModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Visitor QR Code</DialogTitle>
            <DialogDescription>Show or share this code with your visitor</DialogDescription>
          </DialogHeader>
          {qrModal && (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeReact value={qrModal.token || ''} size={140} />
              </div>
              <div className="text-center">
                <p className="font-semibold">{qrModal.name}</p>
                <p className="text-sm text-muted-foreground">{qrModal.purpose}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(qrModal.date)} · {formatTime(qrModal.time_in)} - {formatTime(qrModal.time_out)}
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <Button className="flex-1">
                  <Send className="mr-2 size-4" />
                  Send SMS
                </Button>
                <Button variant="outline" className="flex-1">
                  <Copy className="mr-2 size-4" />
                  Copy link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove invitation</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this visitor invitation? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="destructive" onClick={confirmDelete}>
              Yes, remove
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
