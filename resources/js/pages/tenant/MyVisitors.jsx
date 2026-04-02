import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, Badge, Avatar, Button, Input, Select, Table, Modal, EmptyState, QRCode } from '@/components/ui';

export default function MyVisitors({ auth, visitors = [], filters = {} }) {
  const [search, setSearch]   = useState(filters.search || '');
  const [status, setStatus]   = useState(filters.status || '');
  const [qrModal, setQrModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const applyFilters = (newSearch, newStatus) => {
    router.get('/tenant/visitors', { search: newSearch, status: newStatus }, { preserveState: true, replace: true });
  };

  const handleSearch = (val) => { setSearch(val); applyFilters(val, status); };
  const handleStatus = (val) => { setStatus(val); applyFilters(search, val); };

  const confirmDelete = () => {
    router.delete(`/tenant/visitors/${deleteId}`, { onSuccess: () => setDeleteId(null) });
  };

  const columns = [
    {
      header: 'Visitor',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">{row.phone}</p>
          </div>
        </div>
      ),
    },
    { header: 'ID Number', cell: (row) => <span className="text-sm font-mono text-gray-500">{row.id_number}</span> },
    { header: 'Purpose',   cell: (row) => <span className="text-sm text-gray-600">{row.purpose}</span> },
    {
      header: 'Date & Time',
      cell: (row) => (
        <div>
          <p className="text-sm text-gray-700">{row.date}</p>
          <p className="text-xs text-gray-400">{row.time_in} – {row.time_out}</p>
        </div>
      ),
    },
    { header: 'Status', cell: (row) => <Badge variant={row.status}>{row.status.replace('-', ' ')}</Badge> },
    {
      header: '',
      cell: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button size="xs" variant="ghost" onClick={() => setQrModal(row)}>QR</Button>
          <Button size="xs" variant="danger" onClick={() => setDeleteId(row.id)}>Remove</Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout user={auth.user} role="tenant">
      <PageHeader
        title="My visitors"
        subtitle="View and manage all your invited guests"
        actions={
          <Link href="/tenant/invite">
            <Button variant="primary" size="sm">+ New invite</Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Search by name or phone…"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          icon="🔍"
          className="flex-1"
        />
        <Select
          value={status}
          onChange={e => handleStatus(e.target.value)}
          className="sm:w-44"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="checked-in">Checked in</option>
          <option value="checked-out">Checked out</option>
        </Select>
      </div>

      <Card padding={false}>
        <Table
          columns={columns}
          data={visitors}
          emptyState={
            <EmptyState
              icon="🔍"
              title="No visitors found"
              description="Try adjusting your filters or invite a new visitor."
            />
          }
        />
      </Card>

      {/* QR Modal */}
      <Modal open={!!qrModal} onClose={() => setQrModal(null)} title="Visitor QR code">
        {qrModal && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <QRCode value={`${qrModal.id_number}-${qrModal.name}`} size={140} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{qrModal.name}</p>
              <p className="text-sm text-gray-500">{qrModal.purpose}</p>
              <p className="text-xs text-gray-400">{qrModal.date} · {qrModal.time_in} – {qrModal.time_out}</p>
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="success" className="flex-1 justify-center">Send SMS</Button>
              <Button variant="outline" className="flex-1 justify-center">Copy link</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove invitation" size="sm">
        <p className="text-sm text-gray-600 mb-5">Are you sure you want to remove this visitor invitation? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={confirmDelete} className="flex-1 justify-center">Yes, remove</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1 justify-center">Cancel</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
