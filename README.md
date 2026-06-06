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
npm run test:frontend-migrations
npm run test:frontend-schema
npm run test:frontend-supabase
```

## Supabase

Supabase schema changes are migration-first. Do not edit `supabase/schema.sql` manually. Create a migration, apply it, then regenerate the schema snapshot from the database.

Link the Supabase CLI to the remote project from `SUPABASE_URL`:

```powershell
npm run supabase:link
```

If the CLI is not logged in, run `npx supabase login` or set `SUPABASE_ACCESS_TOKEN` locally. If your Supabase URL is not available, set `SUPABASE_PROJECT_REF` locally. If the CLI asks for the database password, set `SUPABASE_DB_PASSWORD` locally for that command. Do not commit any secret-bearing value.

Create a migration:

```powershell
npm run supabase:migration:new -- add_employee_contact_fields
```

Apply pending migrations to the linked remote project:

```powershell
npm run supabase:migrate
```

Regenerate the reviewed schema snapshot from the linked remote database:

```powershell
npm run supabase:schema:dump
```

Run `npm run test:frontend-migrations` and `npm run test:frontend-schema` after changing migrations or schema output.

The Supabase URL and publishable key are safe public app config. Do not commit or package `sb_secret_...`, legacy `service_role` keys, database passwords, or service-account credentials.

## NativePHP Releases

NativePHP is configured for Windows desktop builds through GitHub Actions. Local NativePHP publishing requires PHP `ext-zip`; normal app development can continue without it.
