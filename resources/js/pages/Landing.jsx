import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Shield,
  QrCode,
  Bell,
  Clock,
  CheckCircle,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: QrCode,
      title: 'QR Code Access',
      description: 'Generate secure QR codes for visitor check-in at the gate',
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Get instant SMS alerts when visitors arrive or overstay',
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Verified visitor details with ID capture and time tracking',
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Set expected arrival and departure times for all guests',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Invite Your Visitor',
      description: 'Fill in visitor details including name, ID, phone, and visit purpose',
      icon: Users,
    },
    {
      number: '02',
      title: 'Generate QR Code',
      description: 'System generates a unique QR code and sends it to your visitor via SMS',
      icon: QrCode,
    },
    {
      number: '03',
      title: 'Visitor Arrives',
      description: 'Guard scans the QR code at the gate for instant verification',
      icon: Shield,
    },
    {
      number: '04',
      title: 'Get Notified',
      description: 'Receive SMS confirmation when your visitor checks in and out',
      icon: Smartphone,
    },
  ];

  return (
    <>
      <Head title="SmartVisitor Estate Management" />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground">
                  SV
                </div>
                <span className="font-semibold text-lg">SmartVisitor</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button>Get started</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <CheckCircle className="size-4" />
                Trusted by modern estates
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Where security meets
                <span className="block text-primary">elegance</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                A comprehensive visitor management platform that streamlines estate security with QR codes, real-time notifications, and seamless check-in processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="text-base">
                    Create account
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-base">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful features for modern estates</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage visitors efficiently and securely
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <Card key={idx} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="size-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How it works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Four simple steps to secure visitor management
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 relative">
                      <step.icon className="size-8 text-primary-foreground" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-5xl font-bold mb-2">1,200+</p>
                <p className="text-primary-foreground/80">Visitors managed</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">&lt; 2 min</p>
                <p className="text-primary-foreground/80">Average check-in time</p>
              </div>
              <div>
                <p className="text-5xl font-bold mb-2">98%</p>
                <p className="text-primary-foreground/80">User satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join modern estates using SmartVisitor for seamless visitor management
            </p>
            <Link href="/register">
              <Button size="lg" className="text-base">
                Create your account
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
                  SV
                </div>
                <span className="font-semibold">SmartVisitor Estate</span>
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} SmartVisitor. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
