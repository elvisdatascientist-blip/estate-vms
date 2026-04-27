# Deployment Guide for Railway

## Changes Pushed Successfully ✅

All client recommendations have been pushed to GitHub. Railway will need to apply these changes.

---

## Required Steps After Push

### 1. Monitor Railway Deployment

Visit your Railway dashboard: https://railway.app/dashboard

- Check if deployment is triggered automatically
- Monitor the build logs for any errors
- Typical deployment takes 3-5 minutes

### 2. Run Database Migration (CRITICAL!)

The new guard status field requires a database migration:

**Option A - Railway CLI:**
```bash
railway run php artisan migrate
```

**Option B - Railway Dashboard:**
1. Go to your project settings
2. Add to "Deploy" section under custom start command or run manually
3. Or SSH into the container and run the command

**Migration Details:**
- File: `2026_04_27_000000_add_status_to_users_table.php`
- Adds: `status` enum field to users table (on-duty/off-duty)
- Safe to run (won't affect existing data)

### 3. Clear Application Cache

After deployment, clear caches:
```bash
railway run php artisan config:clear
railway run php artisan route:clear
railway run php artisan view:clear
railway run php artisan cache:clear
```

---

## What Changed - Summary

### Frontend Changes:
- ✅ Branding: GreenPark → SmartVisitor
- ✅ QR Codes: Fake SVG → Real scannable QR codes
- ✅ Date Format: ISO → "Mon, Apr 27, 2026"
- ✅ Time Format: 24hr → 12hr with AM/PM
- ✅ Guard Management: Added edit/delete functionality
- ✅ Guard Creation: Added password field
- ✅ Form Validation: Enhanced for phone & ID numbers
- ✅ Removed duplicate UI elements

### Backend Changes:
- ✅ Guard CRUD operations completed
- ✅ Enhanced validation rules
- ✅ Visitor controller returns token for QR
- ✅ Guard status tracking in database
- ✅ Fixed active guards count

### Dependencies Added:
- `react-qr-code@2.0.18` - For real QR code generation

---

## Testing Checklist

After deployment, verify these features:

### Visual Changes:
- [ ] Logo shows "SV" instead of "GP"
- [ ] All "GreenPark" text replaced with "SmartVisitor"
- [ ] Dates show as "Mon, Apr 27, 2026"
- [ ] Times show as "2:30 PM" format

### Functional Changes:
- [ ] Create a visitor invitation → QR code should be scannable
- [ ] Try scanning QR code with phone → should decode properly
- [ ] Admin → Guards → Create guard → Password field appears
- [ ] Admin → Guards → Click Edit → Modal opens with guard data
- [ ] Admin → Guards → Click Delete → Confirmation appears
- [ ] Phone number fields only accept digits (10-13)
- [ ] Guard badge field only accepts alphanumeric
- [ ] Tenant profile page shows no duplicate stats

---

## Troubleshooting

### Issue: Changes not appearing
**Solution:** Users need to hard refresh
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Issue: QR codes not generating
**Solution:** Check build logs
- Ensure `npm install` ran successfully
- Verify `react-qr-code` was installed
- Check for JavaScript errors in browser console

### Issue: Guard edit/delete not working
**Solution:** Check routes
- Verify `php artisan route:list` shows PATCH and DELETE routes for guards
- Clear route cache: `php artisan route:clear`

### Issue: Guard status shows null
**Solution:** Migration not run
- Run: `railway run php artisan migrate`
- Check migration status: `railway run php artisan migrate:status`

### Issue: Build fails (memory error)
**Solution:** Increase Railway memory allocation
- Go to Railway project settings
- Increase memory limit to at least 1GB
- Retry deployment

---

## Railway Build Commands

Ensure these are set in Railway settings:

**Build Command:**
```bash
composer install --no-dev --optimize-autoloader && npm install && npm run build
```

**Start Command:**
```bash
php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=${PORT}
```

**Release Command (if available):**
```bash
php artisan migrate --force
```

---

## Environment Variables to Check

Ensure these are set in Railway:

```
APP_ENV=production
APP_DEBUG=false
APP_KEY=<your-app-key>
DB_CONNECTION=<your-db-connection>
```

---

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Check browser console for JavaScript errors
3. Verify all environment variables are set
4. Ensure database migration completed successfully

---

## What's Still Pending

These features were not implemented yet:

1. **Forgot Password Flow** - Requires email service setup
2. **Africa's Talking SMS API** - Requires API credentials
3. **Landing Page with "How It Works"** - Separate feature

These can be added in the next deployment cycle.
