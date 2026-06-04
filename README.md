# Contract Tracker

Contract Tracker is a Laravel API + React frontend application. Product data uses Supabase Auth plus Supabase Postgres, with Row Level Security as the access-control boundary.

## Local Development

Install dependencies:

```powershell
composer install --ignore-platform-req=ext-zip
npm install
```

Prepare `.env`:

```powershell
copy .env.example .env
php artisan key:generate
```

Fill these Supabase values from Supabase Dashboard > Project Settings > API:

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

Enable Auth > Anonymous Sign-Ins in Supabase before running the app.

Check the local setup:

```powershell
npm run check:dev
```

Run the app:

```powershell
composer dev
```

## Verification

Use these commands before handoff:

```powershell
composer test
npm run format:check
npm run lint:check
npm run types:check
npm run build
npm run test:frontend-api
npm run test:frontend-schema
npm run test:frontend-supabase
```

## Supabase

Supabase setup SQL lives in:

- `supabase/schema.sql`

Apply it through the Supabase SQL Editor, or with a temporary local/admin Postgres connection that is never packaged into the desktop app.

The Supabase URL and publishable key are safe public app config. Do not commit or package `sb_secret_...`, legacy `service_role` keys, database passwords, or service-account credentials.

## NativePHP Releases

NativePHP is configured for Windows desktop builds through GitHub Actions. Local NativePHP publishing requires PHP `ext-zip`; normal app development can continue without it.
