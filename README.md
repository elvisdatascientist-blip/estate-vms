# GreenPark Estate - Visitor Management System

A web-based visitor management platform for residential estates. Tenants invite visitors, guards verify them at the gate, and admins oversee everything.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 (PHP 8.3+) |
| Frontend | React 19 + Inertia.js 3 |
| UI Components | shadcn/ui + Tailwind CSS 4 |
| Build Tool | Vite 8 |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Icons | Lucide React |

## How It Works

The system has three user roles, each with their own portal:

### Tenants (Residents)

Tenants are estate residents. After registering and getting admin approval, they can:

1. **Invite visitors** -- Fill in visitor details (name, ID, phone, purpose, date/time). The system generates a unique QR code token.
2. **Send the QR code** -- Share the QR code with the visitor via SMS so they can present it at the gate.
3. **Track visitors** -- See real-time status of all invited visitors (pending, checked in, checked out).
4. **Report incidents** -- Flag security, maintenance, noise, or parking issues to the estate management.

### Guards (Security)

Guards operate at the estate gate:

1. **Scan QR codes** -- When a visitor arrives, scan their QR code to instantly pull up their invitation details and check them in.
2. **Register walk-ins** -- For unannounced visitors, register them manually. The tenant gets an SMS notification.
3. **Monitor the gate** -- Live dashboard shows who's currently inside, who's expected, and a full list of today's visitors.
4. **Check visitors out** -- Mark visitors as checked out when they leave.

### Admins (Management)

Admins have full oversight of estate operations:

1. **Dashboard** -- Overview of today's stats, hourly traffic chart, pending incidents, and recent activity.
2. **Analytics** -- Visitor trends over time, purpose breakdowns, invited vs. walk-in ratios.
3. **Daily reports** -- Searchable visitor logs with CSV export for compliance and record-keeping.
4. **Guard management** -- Register guards, assign badge numbers and shifts.
5. **Incident resolution** -- Review and resolve tenant-reported incidents.

### Visitor Flow

```
Tenant invites visitor
        |
        v
QR code generated + SMS sent
        |
        v
Visitor arrives at gate
        |
   ┌────┴────┐
   |         |
Has QR    No QR
   |         |
Guard      Guard registers
scans QR   as walk-in
   |         |
   └────┬────┘
        |
        v
Visitor checked in (tenant notified)
        |
        v
Visitor leaves -> Guard checks out
```

## Prerequisites

- PHP 8.3+
- Composer 2
- Node.js 18+
- npm 9+

## Setup

```bash
# 1. Clone and enter the project
git clone <repository-url>
cd estate-vms

# 2. Install dependencies
composer install
npm install

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# 4. Create database and run migrations
touch database/database.sqlite
php artisan migrate --seed
```

## Running Locally

You need two terminal windows:

```bash
# Terminal 1 -- Laravel backend
php artisan serve
```

```bash
# Terminal 2 -- Vite dev server (frontend hot-reload)
npm run dev
```

Open **http://localhost:8000** in your browser.

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@greenpark.com | password |
| Guard | guard@greenpark.com | password |
| Tenant | tenant@greenpark.com | password |

## Project Structure

```
estate-vms/
├── app/
│   ├── Http/Controllers/
│   │   ├── Auth/           # Login, Registration
│   │   ├── Tenant/         # Visitors, Incidents, Profile
│   │   ├── Guard/          # QR Scan, Walk-in, Check-in/out
│   │   └── Admin/          # Dashboard, Analytics, Reports, Guards
│   ├── Models/             # User, Visitor, Incident
│   └── Services/           # SMS integration (pluggable)
├── resources/
│   ├── js/
│   │   ├── pages/          # React pages (16 total)
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── tenant/     # Dashboard, InviteVisitor, MyVisitors, Incidents, Profile
│   │   │   ├── guard/      # Dashboard, ScanQR, WalkIn, VisitorList
│   │   │   └── admin/      # Dashboard, Analytics, DailyReport, ManageGuards, Incidents
│   │   └── components/
│   │       ├── layout/     # AppLayout (sidebar + header)
│   │       └── ui/         # shadcn/ui components
│   └── css/app.css         # Tailwind + color theme
├── routes/web.php          # All routes
├── database/migrations/    # DB schema
└── vite.config.js          # Build config
```

## Routes

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| GET/POST | /login | Sign in |
| GET/POST | /register | Create account |
| POST | /logout | Sign out |

### Tenant (`/tenant/*`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /dashboard | Tenant home |
| GET | /invite | Invite visitor form |
| POST | /visitors | Submit invitation |
| GET | /visitors | View all visitors |
| DELETE | /visitors/{id} | Cancel invitation |
| POST | /visitors/{id}/send-sms | SMS the QR to visitor |
| GET/POST | /incidents | View/report incidents |
| GET/PATCH | /profile | View/update profile |
| PUT | /profile/password | Change password |

### Guard (`/guard/*`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /dashboard | Gate dashboard |
| GET | /scan | QR scanner |
| GET/POST | /walkin | Walk-in registration |
| GET | /visitors | Today's visitor list |
| PATCH | /visitors/{id}/checkin | Check in |
| PATCH | /visitors/{id}/checkout | Check out |

### Admin (`/admin/*`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | /dashboard | Estate overview |
| GET | /analytics | Traffic analytics |
| GET | /reports | Daily report |
| GET | /reports/download | Export CSV |
| GET/POST | /guards | List/register guards |
| DELETE | /guards/{id} | Remove guard |
| GET | /incidents | All incidents |
| PATCH | /incidents/{id}/resolve | Resolve incident |

---

## Deploying to Render (Free Tier)

Render is the simplest free platform for hosting a full-stack Laravel app. You'll get a web server + PostgreSQL database at no cost.

### What you need

- A [Render account](https://render.com) (sign up free with GitHub)
- Your code pushed to a GitHub repository

### Step 1: Push your code to GitHub

```bash
# If you haven't already
git init
git add -A
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/estate-vms.git
git branch -M main
git push -u origin main
```

### Step 2: Create a PostgreSQL database on Render

1. Log in to [dashboard.render.com](https://dashboard.render.com)
2. Click **New** > **PostgreSQL**
3. Fill in:
   - **Name**: `greenpark-db`
   - **Region**: Choose closest to you
   - **Plan**: **Free**
4. Click **Create Database**
5. Once created, go to the database page and find the **Internal Database URL** -- copy it. It looks like:
   ```
   postgres://user:password@host/dbname
   ```

### Step 3: Create a `render.yaml` file

Create this file in your project root:

```yaml
# render.yaml
services:
  - type: web
    name: greenpark-vms
    runtime: image
    image:
      url: docker.io/library/php:8.3-cli
    plan: free
    buildCommand: |
      apt-get update && apt-get install -y unzip libpq-dev nodejs npm &&
      docker-php-ext-install pdo_pgsql &&
      curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer &&
      composer install --no-dev --optimize-autoloader &&
      npm install &&
      npm run build
    startCommand: php artisan serve --host=0.0.0.0 --port=$PORT
    envVars:
      - key: APP_NAME
        value: GreenPark Estate
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
      - key: APP_URL
        fromService:
          name: greenpark-vms
          type: web
          property: host
      - key: APP_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: greenpark-db
          property: connectionString
```

> This is optional -- you can also set everything up through the dashboard UI (see below).

### Step 4: Create the web service (Dashboard method)

If you prefer the dashboard UI over the yaml file:

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New** > **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `greenpark-vms`
   - **Runtime**: **Docker** (we'll add a Dockerfile)
   - **Plan**: **Free**

### Step 5: Add a Dockerfile

Create this file in your project root:

```dockerfile
FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    libpq-dev \
    curl \
    && docker-php-ext-install pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Install and build frontend
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Finish composer setup
RUN composer dump-autoload --optimize

# Expose port
EXPOSE 10000

# Start command
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000
```

### Step 6: Add a `.dockerignore` file

```
node_modules
vendor
.env
storage/logs/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*
.git
```

### Step 7: Set environment variables on Render

In your web service settings on Render, go to **Environment** and add:

| Key | Value |
|-----|-------|
| `APP_NAME` | GreenPark Estate |
| `APP_ENV` | production |
| `APP_DEBUG` | false |
| `APP_KEY` | *(run `php artisan key:generate --show` locally and paste the output)* |
| `APP_URL` | `https://greenpark-vms.onrender.com` (your Render URL) |
| `DB_CONNECTION` | pgsql |
| `DB_HOST` | *(from your Render PostgreSQL "Internal Database URL")* |
| `DB_PORT` | 5432 |
| `DB_DATABASE` | *(from your Render PostgreSQL)* |
| `DB_USERNAME` | *(from your Render PostgreSQL)* |
| `DB_PASSWORD` | *(from your Render PostgreSQL)* |
| `SESSION_DRIVER` | cookie |
| `CACHE_STORE` | array |
| `QUEUE_CONNECTION` | sync |

> **Tip**: Instead of separate DB_ vars, you can parse the Internal Database URL. But separate vars are simpler.

### Step 8: Deploy

1. Commit the `Dockerfile` and `.dockerignore` to your repo
2. Push to GitHub:
   ```bash
   git add Dockerfile .dockerignore
   git commit -m "add Dockerfile for Render deployment"
   git push
   ```
3. Render will automatically detect the push and start building
4. Wait for the build to complete (first build takes 5-10 minutes)
5. Once live, visit your URL: `https://greenpark-vms.onrender.com`

### Step 9: Seed demo data (one-time)

After the first deploy, open the **Shell** tab on your Render web service and run:

```bash
php artisan db:seed
```

This creates the demo admin, guard, and tenant accounts.

### Important notes about Render free tier

- **Spin-down**: Free services spin down after 15 minutes of inactivity. The first request after spin-down takes ~30 seconds to boot.
- **Storage**: Free tier has no persistent disk. Use PostgreSQL for all data (which is the default setup).
- **PostgreSQL free tier**: 1 GB storage, expires after 90 days. You'll need to recreate it or upgrade.
- **Custom domain**: You can add a custom domain for free in the service settings.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| White screen after deploy | Check that `APP_KEY` is set. Run `php artisan key:generate --show` locally. |
| Database errors | Verify all `DB_*` env vars match your Render PostgreSQL credentials. |
| CSS/JS not loading | Make sure `npm run build` ran successfully in the build step. Check build logs. |
| 500 errors | Set `APP_DEBUG=true` temporarily to see the error, then set it back to `false`. |

## License

Proprietary. All rights reserved.
