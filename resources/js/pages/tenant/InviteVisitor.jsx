import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout, { PageHeader } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, Send, Copy, Printer, QrCode } from 'lucide-react';
import QRCodeReact from 'react-qr-code';

export default function InviteVisitor({ auth, flash = {} }) {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [visitorData, setVisitorData] = useState(null);
  const { props } = usePage();

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    id_number: '',
    phone: '',
    purpose: '',
    time_in: '09:00',
    time_out: '17:00',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (flash?.visitor) {
      setVisitorData(flash.visitor);
      setQrGenerated(true);
    }
  }, [flash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/tenant/visitors', {
      onSuccess: (page) => {
        setQrGenerated(true);
        if (page.props.flash?.visitor) {
          setVisitorData(page.props.flash.visitor);
        }
      },
    });
  };

  const handleSendSms = () => {
    setSmsSent(true);
  };

  const selectClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <AppLayout user={auth.user} role="tenant">
      <Head title="Invite a Visitor" />

      <PageHeader
        title="Invite a visitor"
        subtitle="Fill in the details below. A QR code will be generated and can be sent to your guest."
      />

      {flash.success && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="size-4 shrink-0" />
          {flash.success}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Visitor details</CardTitle>
              <CardDescription>All fields are required for security purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. James Mwangi"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id_number">ID / Passport number</Label>
                    <Input
                      id="id_number"
                      placeholder="National ID or passport"
                      value={data.id_number}
                      onChange={(e) => setData('id_number', e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
                      maxLength="30"
                    />
                    {errors.id_number && (
                      <p className="text-sm text-destructive">{errors.id_number}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="07XXXXXXXX (10-13 digits)"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength="13"
                      minLength="10"
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of visit</Label>
                    <select
                      id="purpose"
                      value={data.purpose}
                      onChange={(e) => setData('purpose', e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select purpose...</option>
                      <option>Family visit</option>
                      <option>Friend visit</option>
                      <option>Delivery</option>
                      <option>Plumber</option>
                      <option>Electrician</option>
                      <option>Contractor</option>
                      <option>Other</option>
                    </select>
                    {errors.purpose && (
                      <p className="text-sm text-destructive">{errors.purpose}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={data.date}
                      onChange={(e) => setData('date', e.target.value)}
                    />
                    {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time_in">Expected time in</Label>
                    <Input
                      id="time_in"
                      type="time"
                      value={data.time_in}
                      onChange={(e) => setData('time_in', e.target.value)}
                    />
                    {errors.time_in && (
                      <p className="text-sm text-destructive">{errors.time_in}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time_out">Expected time out</Label>
                    <Input
                      id="time_out"
                      type="time"
                      value={data.time_out}
                      onChange={(e) => setData('time_out', e.target.value)}
                    />
                    {errors.time_out && (
                      <p className="text-sm text-destructive">{errors.time_out}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? 'Generating...' : 'Generate QR & invite'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => reset()}>
                    Clear form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* QR Panel */}
        <div className="lg:col-span-2">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Generated QR code</CardTitle>
              <CardDescription>Share this securely with your visitor</CardDescription>
            </CardHeader>
            <CardContent>
              {qrGenerated && visitorData ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-4 py-6 bg-muted/50 rounded-lg border">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <QRCodeReact value={visitorData.token || ''} size={140} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{visitorData.name}</p>
                      <p className="text-xs text-muted-foreground">{visitorData.purpose}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {visitorData.time_in} - {visitorData.time_out}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-2 bg-muted px-2 py-1 rounded">
                        {visitorData.token?.substring(0, 16)}...
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {smsSent ? (
                      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <CheckCircle className="size-4 shrink-0" />
                        SMS sent to {data.phone}
                      </div>
                    ) : (
                      <Button onClick={handleSendSms} className="w-full">
                        <Send className="mr-2 size-4" />
                        Send QR via SMS
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <Copy className="mr-2 size-4" />
                      Copy shareable link
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => window.print()}
                    >
                      <Printer className="mr-2 size-4" />
                      Print QR code
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex size-20 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 mb-4">
                    <QrCode className="size-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fill the form to generate a QR code
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">
                    The secure QR code will appear here once submitted
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
