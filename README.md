# GreenPark Estate Visitor Management System

A modern, role-based visitor management system built for residential estates. The system streamlines visitor registration, gate security operations, and estate administration through an intuitive web interface.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 (PHP 8.3+) |
| Frontend | React 19 + Inertia.js 3 |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite 8 |
| Database | SQLite (dev) / MySQL (prod) |
| Authentication | Laravel Auth + Role Middleware |
| SMS | Pluggable SMS Service (Africa's Talking ready) |

## Features

### Tenant Portal
- **Visitor Invitations** — Pre-register visitors with name, ID, phone, purpose, date and time. Auto-generates a unique QR code token for each invitation.
- **SMS Notifications** — Send invite details and QR tokens to visitors via SMS.
- **Visitor Tracking** — Real-time status updates (pending, checked-in, checked-out) for all invited visitors.
- **Incident Reporting** — Report security, maintenance, noise, or parking issues with severity levels. Track resolution status.
- **Profile Management** — Update personal details and password.

### Guard Portal
- **QR Code Scanner** — Scan visitor QR codes at the gate to verify invitations and check them in instantly.
- **Walk-in Registration** — Register unannounced visitors on the spot. Automatically notifies the tenant via SMS.
- **Live Dashboard** — View real-time stats: visitors currently inside, expected arrivals, total processed today.
- **Check-in / Check-out** — One-tap status updates with automatic timestamp recording.
- **Visitor Search** — Filter today's visitors by name, unit, or status.

### Admin Portal
- **Estate Overview Dashboard** — At-a-glance stats, hourly traffic chart, pending incidents, and recent visitor activity.
- **Analytics** — Visitor traffic trends (hourly/daily), visit purpose breakdown, invited vs. walk-in ratios. Filter by today, this week, or this month.
- **Daily Reports** — Searchable visitor log with CSV export for record-keeping and compliance.
- **Guard Management** — Register guards with badge numbers, assign shifts (Day/Night), manage credentials.
- **Incident Management** — Review all tenant-reported incidents, track severity, and mark as resolved.

## System Architecture

```
┌──────────────┐     Inertia.js      ┌──────────────────┐
│   Laravel     │ <────────────────>  │   React SPA      │
│   Backend     │   (Server-side      │   (Pages +        │
│               │    rendering)       │    Components)    │
├──────────────┤                     ├──────────────────┤
│ Controllers   │                     │ Tenant Pages (5)  │
│ Models (3)    │                     │ Guard Pages  (4)  │
│ Middleware    │                     │ Admin Pages  (5)  │
│ Services     │                     │ Auth Pages   (2)  │
└──────┬───────┘                     └──────────────────┘
       │
       v
┌──────────────┐     ┌──────────────┐
│   SQLite /    │     │  SMS Service  │
│   MySQL DB    │     │  (Pluggable)  │
└──────────────┘     └──────────────┘
```

## Database Schema

### Users
Supports three roles with role-specific fields:
- **Tenant** — unit, block, lease start date, approval status
- **Guard** — badge number, shift assignment
- **Admin** — estate management access

### Visitors
- Linked to tenant (who invited) and guard (who checked in)
- Tracks: name, ID number, phone, purpose, scheduled date/time
- Status flow: `pending` → `checked-in` → `checked-out`
- Unique token for QR code verification (auto-generated for invited visitors)

### Incidents
- Reported by tenants, resolved by admins
- Types: security, maintenance, noise, parking
- Severity: low, medium, high
- Status: pending → resolved (with resolver tracking)

## Getting Started

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd estate-vms

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Create database and seed demo data
touch database/database.sqlite
php artisan migrate --seed
```

### Running the Application

```bash
# Terminal 1 — Start the backend server
php artisan serve

# Terminal 2 — Start the Vite dev server (for hot-reloading)
npm run dev
```

Open **http://127.0.0.1:8000** in your browser.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@greenpark.com | password |
| Guard | guard@greenpark.com | password |
| Tenant | tenant@greenpark.com | password |

## Project Structure

```
estate-vms/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/           # Login, Registration
│   │   │   ├── Tenant/         # Visitors, Incidents, Profile
│   │   │   ├── Guard/          # Dashboard, QR Scan, Walk-in, Check-in/out
│   │   │   └── Admin/          # Dashboard, Analytics, Reports, Guards, Incidents
│   │   └── Middleware/
│   │       ├── RoleMiddleware.php        # Role-based route protection
│   │       └── HandleInertiaRequests.php # Shared auth & flash data
│   ├── Models/
│   │   ├── User.php            # Multi-role user model
│   │   ├── Visitor.php         # Visitor records with QR tokens
│   │   └── Incident.php        # Incident reports
│   └── Services/
│       └── SmsService.php      # SMS integration (pluggable provider)
├── resources/
│   ├── js/
│   │   ├── app.jsx             # Inertia app entry point
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── tenant/         # Dashboard, InviteVisitor, MyVisitors, Incidents, Profile
│   │   │   ├── guard/          # Dashboard, ScanQR, WalkIn, VisitorList
│   │   │   └── admin/          # Dashboard, Analytics, DailyReport, ManageGuards, Incidents
│   │   └── components/
│   │       ├── layout/AppLayout.jsx  # Sidebar + topbar shell (role-aware)
│   │       └── ui/index.jsx          # Reusable UI component library
│   └── css/
│       └── app.css
├── database/
│   ├── migrations/             # Users, Visitors, Incidents tables
│   └── seeders/                # Demo data seeder
├── routes/
│   └── web.php                 # All application routes
├── tailwind.config.js          # Design system tokens
└── vite.config.js              # Build configuration
```

## Design System

The UI follows a consistent design language:

- **Typography** — Syne (headings), DM Sans (body text)
- **Brand palette** — Navy blue primary (#1a3a5c to #2563a8)
- **Status colors** — Green (success), Red (danger), Orange (warning/pending)
- **Components** — Cards, Stat Cards, Badges, Modals, Tables, Tabs, Buttons, Inputs, Alerts, QR Codes, Avatars
- **Layout** — Fixed sidebar navigation with role-based menu items, responsive with mobile hamburger menu

## API Routes Summary

### Tenant Routes (`/tenant/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tenant/dashboard | Tenant dashboard |
| GET | /tenant/invite | Invite visitor form |
| POST | /tenant/visitors | Create visitor invitation |
| GET | /tenant/visitors | List all visitors |
| DELETE | /tenant/visitors/{id} | Cancel invitation |
| POST | /tenant/visitors/{id}/send-sms | Send SMS to visitor |
| GET/POST | /tenant/incidents | View/report incidents |
| GET/PATCH | /tenant/profile | View/update profile |
| PUT | /tenant/profile/password | Change password |

### Guard Routes (`/guard/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /guard/dashboard | Guard dashboard |
| GET | /guard/scan | QR scanner page |
| GET/POST | /guard/walkin | Walk-in registration |
| GET | /guard/visitors | Today's visitor list |
| PATCH | /guard/visitors/{id}/checkin | Check in visitor |
| PATCH | /guard/visitors/{id}/checkout | Check out visitor |

### Admin Routes (`/admin/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/dashboard | Estate overview |
| GET | /admin/analytics | Traffic analytics |
| GET | /admin/reports | Daily visitor report |
| GET | /admin/reports/download | Export CSV |
| GET/POST | /admin/guards | List/create guards |
| DELETE | /admin/guards/{id} | Remove guard |
| GET | /admin/incidents | All incidents |
| PATCH | /admin/incidents/{id}/resolve | Resolve incident |

## Production Deployment

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

For production, update `.env`:
- Set `APP_ENV=production` and `APP_DEBUG=false`
- Configure MySQL/PostgreSQL database credentials
- Set up an SMS provider in `SmsService.php`
- Configure a proper mail driver for notifications

## License

Proprietary. All rights reserved.
