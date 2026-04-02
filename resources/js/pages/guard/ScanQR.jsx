import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, Badge, Button, Alert } from '@/components/ui';

/* 
  In production, integrate a QR scanner library such as:
    - html5-qrcode  (npm i html5-qrcode)
    - @zxing/library
  The onScanSuccess callback receives the decoded string (visitor token/uuid).
  That token is then posted to /guard/scan/verify to fetch visitor details.
*/

export default function ScanQR({ auth, flash = {}, scanned = null }) {
  const [scanning, setScanning]   = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckIn = () => {
    router.patch(`/guard/visitors/${scanned.id}/checkin`, {}, {
      onSuccess: () => setCheckedIn(true),
    });
  };

  return (
    <AppLayout user={auth.user} role="guard">
      <PageHeader
        title="Scan QR code"
        subtitle="Point the camera at the visitor's QR code to verify their invitation"
      />

      {!scanned && !checkedIn && (
        <Card className="max-w-md mx-auto">
          {/* Camera viewfinder mockup — replace with <Html5QrcodeScanner> in production */}
          <div
            className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
            onClick={() => {
              /* In real app: start html5-qrcode scanner here */
              router.get('/guard/scan?demo=1');
            }}
          >
            {/* Corner brackets */}
            {['top-3 left-3', 'top-3 right-3 rotate-90', 'bottom-3 right-3 rotate-180', 'bottom-3 left-3 -rotate-90'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8 border-white`}
                style={{ borderWidth: '3px 0 0 3px', borderStyle: 'solid', borderRadius: '2px 0 0 2px' }} />
            ))}

            {/* Scan line animation */}
            <div className="absolute inset-x-0 h-0.5 bg-brand-400 opacity-70 animate-scan" style={{
              animation: 'scanline 2s linear infinite',
              top: '50%',
            }} />

            <div className="text-center text-white">
              <div className="text-5xl mb-3 opacity-50">⬡</div>
              <p className="text-sm opacity-60">Tap to start camera</p>
              <p className="text-xs opacity-40 mt-1">(or click to simulate scan)</p>
            </div>
          </div>

          <p className="text-xs text-center text-gray-400">
            Position the visitor's QR code within the frame. The scan happens automatically.
          </p>
        </Card>
      )}

      {/* Verification result */}
      {scanned && !checkedIn && (
        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</div>
              <p className="text-sm font-semibold text-green-700">Valid invitation found</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 mb-4">
              {[
                ['Visitor name',  scanned.name],
                ['ID number',     scanned.id_number],
                ['Purpose',       scanned.purpose],
                ['Visiting unit', `Unit ${scanned.unit}`],
                ['Tenant',        scanned.tenant_name],
                ['Valid from',    `${scanned.time_in} – ${scanned.time_out}`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <Badge variant={scanned.status}>{scanned.status}</Badge>
              </div>
            </div>

            <Button variant="success" className="w-full justify-center" onClick={handleCheckIn}>
              ✓ Check in visitor
            </Button>
          </Card>

          <Button variant="ghost" className="w-full justify-center" onClick={() => router.get('/guard/scan')}>
            ← Scan another
          </Button>
        </div>
      )}

      {/* Success */}
      {checkedIn && (
        <div className="max-w-md mx-auto">
          <Card className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <p className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {scanned?.name} checked in
            </p>
            <p className="text-sm text-gray-500 mb-1">Visitor is now inside the estate</p>
            <p className="text-xs text-green-600 mb-6">SMS notification sent to tenant in Unit {scanned?.unit}</p>
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1 justify-center" onClick={() => router.get('/guard/scan')}>
                Scan another
              </Button>
              <Button variant="ghost" className="flex-1 justify-center" onClick={() => router.get('/guard/dashboard')}>
                Dashboard
              </Button>
            </div>
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
