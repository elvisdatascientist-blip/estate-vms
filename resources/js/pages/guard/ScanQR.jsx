import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ScanLine,
  CheckCircle,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';

export default function ScanQR({ auth, flash = {}, scanned = null }) {
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckIn = () => {
    router.patch(
      `/guard/visitors/${scanned.id}/checkin`,
      {},
      { onSuccess: () => setCheckedIn(true) },
    );
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
            pending
          </Badge>
        );
      case 'checked-in':
        return (
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
            checked in
          </Badge>
        );
      case 'checked-out':
        return <Badge variant="secondary">checked out</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout user={auth.user} role="guard">
      <Head title="Scan QR Code" />

      <PageHeader
        title="Scan QR code"
        subtitle="Point the camera at the visitor's QR code to verify their invitation"
      />

      {/* Scanner UI */}
      {!scanned && !checkedIn && (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div
              className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
              onClick={() => router.get('/guard/scan?demo=1')}
            >
              {/* Corner brackets */}
              {[
                'top-3 left-3',
                'top-3 right-3 rotate-90',
                'bottom-3 right-3 rotate-180',
                'bottom-3 left-3 -rotate-90',
              ].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} w-8 h-8 border-white`}
                  style={{
                    borderWidth: '3px 0 0 3px',
                    borderStyle: 'solid',
                    borderRadius: '2px 0 0 2px',
                  }}
                />
              ))}

              {/* Scan line animation */}
              <div
                className="absolute inset-x-6 h-0.5 bg-emerald-400 opacity-70"
                style={{ animation: 'scanline 2s linear infinite', top: '50%' }}
              />

              <div className="text-center text-white">
                <ScanLine className="size-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm opacity-60">Tap to start camera</p>
                <p className="text-xs opacity-40 mt-1">(or click to simulate scan)</p>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Position the visitor's QR code within the frame. The scan happens automatically.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Scanned result */}
      {scanned && !checkedIn && (
        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle className="size-4" />
                </div>
                <p className="text-sm font-semibold text-emerald-700">Valid invitation found</p>
              </div>

              <div className="rounded-xl border bg-muted/40 p-4 space-y-2.5 mb-4">
                {[
                  ['Visitor name', scanned.name],
                  ['ID number', scanned.id_number],
                  ['Purpose', scanned.purpose],
                  ['Visiting unit', `Unit ${scanned.unit}`],
                  ['Tenant', scanned.tenant_name],
                  ['Valid from', `${scanned.time_in} \u2013 ${scanned.time_out}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  {statusBadge(scanned.status)}
                </div>
              </div>

              <Button className="w-full" onClick={handleCheckIn}>
                <CheckCircle className="size-4 mr-2" />
                Check in visitor
              </Button>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.get('/guard/scan')}
          >
            <ArrowLeft className="size-4 mr-2" />
            Scan another
          </Button>
        </div>
      )}

      {/* Success state */}
      {checkedIn && (
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4">
                <CheckCircle className="size-8" />
              </div>
              <p className="text-lg font-semibold mb-1">
                {scanned?.name} checked in
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Visitor is now inside the estate
              </p>
              <p className="text-xs text-emerald-600 mb-6">
                SMS notification sent to tenant in Unit {scanned?.unit}
              </p>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => router.get('/guard/scan')}>
                  <ScanLine className="size-4 mr-2" />
                  Scan another
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => router.get('/guard/dashboard')}
                >
                  <LayoutDashboard className="size-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style>{`
        @keyframes scanline {
          0%   { top: 20%; }
          50%  { top: 80%; }
          100% { top: 20%; }
        }
      `}</style>
    </AppLayout>
  );
}
