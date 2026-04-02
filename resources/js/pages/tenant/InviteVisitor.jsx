import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardHeader, Input, Select, Button, Alert, QRCode } from '@/components/ui';

export default function InviteVisitor({ auth, flash = {} }) {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name:      '',
    id_number: '',
    phone:     '',
    purpose:   '',
    time_in:   '09:00',
    time_out:  '17:00',
    date:      new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/tenant/visitors', {
      onSuccess: () => setQrGenerated(true),
    });
  };

  const handleSendSms = () => {
    // POST /tenant/visitors/{id}/send-sms  — wire up after form submission
    setSmsSent(true);
  };

  return (
    <AppLayout user={auth.user} role="tenant">
      <PageHeader
        title="Invite a visitor"
        subtitle="Fill in the details below. A QR code will be generated and can be sent to your guest."
      />

      {flash.success && <div className="mb-5 animate-slide-down"><Alert type="success">{flash.success}</Alert></div>}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <Card className="animate-slide-up">
            <CardHeader 
              title="Visitor details" 
              subtitle="All fields are required for security purposes" 
            />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  placeholder="e.g. James Mwangi"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  error={errors.name}
                  floating
                />
                <Input
                  label="ID / Passport number"
                  placeholder="National ID or passport"
                  value={data.id_number}
                  onChange={e => setData('id_number', e.target.value)}
                  error={errors.id_number}
                  floating
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="07XXXXXXXX"
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                  error={errors.phone}
                  floating
                />
                <Select
                  label="Purpose of visit"
                  value={data.purpose}
                  onChange={e => setData('purpose', e.target.value)}
                  error={errors.purpose}
                  className="rounded-xl"
                >
                  <option value="">Select purpose…</option>
                  <option>Family visit</option>
                  <option>Friend visit</option>
                  <option>Delivery</option>
                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>Contractor</option>
                  <option>Other</option>
                </Select>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={data.date}
                  onChange={e => setData('date', e.target.value)}
                  error={errors.date}
                  floating
                />
                <Input
                  label="Expected time in"
                  type="time"
                  value={data.time_in}
                  onChange={e => setData('time_in', e.target.value)}
                  error={errors.time_in}
                  floating
                />
                <Input
                  label="Expected time out"
                  type="time"
                  value={data.time_out}
                  onChange={e => setData('time_out', e.target.value)}
                  error={errors.time_out}
                  floating
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Button 
                  type="submit" 
                  variant="accent" 
                  loading={processing} 
                  className="flex-1 justify-center"
                  size="lg"
                >
                  {processing ? 'Generating...' : 'Generate QR & invite'}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => reset()}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  Clear form
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* QR Panel */}
        <div className="lg:col-span-2">
          <Card className="sticky top-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader 
              title="Generated QR code" 
              subtitle="Share this securely with your visitor" 
            />
            {qrGenerated ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-6 bg-gradient-to-br from-accent-bg to-white rounded-xl border border-accent/20">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <QRCode value={`${data.id_number}-${data.name}`} size={120} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800" style={{ fontFamily: 'var(--font-display)' }}>{data.name}</p>
                    <p className="text-xs text-gray-600">{data.purpose}</p>
                    <p className="text-xs text-gray-400 mt-1">{data.time_in} – {data.time_out}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {smsSent
                    ? <Alert type="success" className="animate-slide-down">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          SMS sent to {data.phone}
                        </div>
                      </Alert>
                    : <Button variant="success" onClick={handleSendSms} className="w-full justify-center" size="lg">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send QR via SMS
                      </Button>
                  }
                  <Button variant="outline" className="w-full justify-center hover:bg-accent-bg hover:border-accent">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy shareable link
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-gray-400 hover:text-gray-600" 
                    onClick={() => window.print()}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print QR code
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-4 transition-all duration-300 hover:border-accent hover:bg-accent-bg/20">
                  <span className="text-3xl opacity-30 transition-opacity duration-200 hover:opacity-50">⬡</span>
                </div>
                <p className="text-sm font-medium text-gray-600">Fill the form to generate a QR code</p>
                <p className="text-xs text-gray-400 mt-1.5 max-w-xs">The secure QR code will appear here once submitted</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
