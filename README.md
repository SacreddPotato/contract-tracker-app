# Contract Tracker

Contract Tracker is a Laravel API + React frontend application. Product data is stored in Neon Postgres through Laravel migrations, Eloquent models, services, API resources, and API routes.

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

Fill the Neon database and local API token values:

```env
APP_DATA_STORE=neon
APP_API_TOKEN=
NEON_DEFAULT_DATABASE_BRANCH=testing
NEON_TESTING_DATABASE_URL=postgresql://USER:PASSWORD@TESTING-HOST/DBNAME?sslmode=require
NEON_PRODUCTION_DATABASE_URL=postgresql://USER:PASSWORD@PRODUCTION-HOST/DBNAME?sslmode=require

DB_CONNECTION=pgsql
DB_URL="${NEON_TESTING_DATABASE_URL}"
DB_SSLMODE=require
```

You can use the split `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` values instead of `DB_URL`.

Local development defaults to the Neon `testing` branch. The React app shows a dev-only database branch switch when `APP_ENV=local`; selecting `production` sends a request header that Laravel only honors when the dev toggle is enabled. Production builds should use `NEON_DEFAULT_DATABASE_BRANCH=production` and `DB_URL="${NEON_PRODUCTION_DATABASE_URL}"`.

Run pending migrations against a local or test-safe Neon branch/database:

```powershell
npm run neon:migrate
```

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
npm run test:frontend-api-config
```

## Neon

Neon schema changes are Laravel migration-first. Create timestamped migrations in `database/migrations`, pair new product models with factories, and verify with Laravel feature tests plus the frontend migration/schema checks.

Use a direct/unpooled Neon Postgres connection for Laravel migrations and this desktop-first runtime unless runtime concurrency later requires a pooled connection.

Required secrets/config are:

- `NEON_TESTING_DATABASE_URL` with `sslmode=require` for local/dev default data.
- `NEON_PRODUCTION_DATABASE_URL` with `sslmode=require` for production data and the dev-only production toggle.
- `APP_API_TOKEN`, a long random token used by the local React app when calling protected Laravel product APIs.
- GitHub Actions Secrets `APP_API_TOKEN` and `NEON_PRODUCTION_DATABASE_URL` for the Windows NativePHP release workflow.

`npx neonctl@latest init` is optional AI-assistant setup and is not required for this Laravel/React app. If it hangs, copy the testing and production branch connection strings from the Neon Console instead.

Do not commit Neon database passwords, `APP_API_TOKEN`, GitHub tokens, private keys, or other secret-bearing values. Commit only safe placeholders in `.env.example` and `.env.production.example`.

## NativePHP Releases

NativePHP is configured for Windows desktop builds through GitHub Actions. Local NativePHP publishing requires PHP `ext-zip`; normal app development can continue without it.

For the current Windows release model, the release workflow intentionally injects the GitHub Actions Secrets `APP_API_TOKEN` and `NEON_PRODUCTION_DATABASE_URL` into the production `.env` before the frontend build and NativePHP publish steps. This is a user-approved packaging exception for this app. The workflow must not echo the values, must only log `SET` or `UNSET`, and must not include `NEON_TESTING_DATABASE_URL` in production release builds. Use Secrets instead of repo Variables because GitHub masks Secrets in workflow logs.

Manual Windows release tests can run `release-windows.yml` from a branch by supplying a plain SemVer `version` input; the workflow publishes assets to the corresponding `v<version>` draft release tag and leaves that manual-test release as a draft.

NativePHP's default bundled PHP binary does not include PostgreSQL extensions. The Windows release workflow builds a custom static PHP binary with `pgsql` and `pdo_pgsql`, verifies those extensions are loaded, and points NativePHP at that binary with `NATIVEPHP_PHP_BINARY_PATH` before publishing the app.
