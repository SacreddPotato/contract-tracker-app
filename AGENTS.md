# Agent Instructions

These rules apply to all future AI-assisted work in this project. Follow them before making code changes, and treat them as project-level requirements unless the user explicitly overrides them.

## Project Architecture

- This project is a Laravel API backend with a React frontend.
- Laravel must provide API routes, backend logic, validation, authorization, persistence, and JSON responses.
- React owns the frontend experience: UI, client-side routing, components, forms, state, and user interaction.
- Do not add new Inertia pages, Blade-driven product screens, or server-rendered frontend features.
- Existing Inertia/server-rendered starter code is legacy starter structure and should be refactored away during future product work instead of extended.
- Keep backend and frontend concerns separate. Do not put frontend presentation logic in Laravel controllers, and do not put backend business rules in React components.
- Product data is backed by Neon Postgres through Laravel API orchestration, Laravel migrations, Eloquent models, services, and API resources. Do not reintroduce Firebase, Firestore, Supabase, SQLite, or another data store for product/domain data unless the user explicitly approves that architectural change.
- Never package Neon database passwords, `APP_API_TOKEN`, private keys, GitHub tokens, service-account JSON files, or other privileged secrets into the desktop app unless a user-approved release exception is explicitly documented in the NativePHP release rules below.

## Laravel MVC Boundaries

- Controllers must stay thin. They may accept requests, authorize actions, call services, and return API resources or JSON responses.
- Controllers must not contain business workflows, database-heavy query composition, validation rules, authorization rules, or response-shaping loops.
- Form Request classes own validation rules, request-specific authorization, and request input normalization.
- Services own business workflows, domain decisions, orchestration, and reusable backend operations.
- Models own Eloquent relationships, casts, scopes, accessors, mutators, and persistence-related behavior.
- Models must not become service containers. Keep cross-model workflows and business processes in services.
- API Resource classes own JSON response shape and presentation of backend data.
- Policies own authorization decisions only.
- Migrations own schema changes only. Do not seed data or run application logic from migrations.
- Seeders and factories own testable database state setup only.
- Middleware should handle request pipeline concerns only, such as authentication, headers, localization, or rate limiting.

## Backend File Structure

- Use the conventional Laravel structure and keep each class in its proper layer:
    - Controllers: `app/Http/Controllers`
    - Requests: `app/Http/Requests`
    - Resources: `app/Http/Resources`
    - Policies: `app/Policies`
    - Services: `app/Services`
    - Models: `app/Models`
    - Factories: `database/factories`
    - Seeders: `database/seeders`
    - Migrations: `database/migrations`
- Create missing layer directories when a feature needs them.
- Prefer feature-oriented service names that describe a domain operation rather than generic utility classes.
- Do not hide domain logic in route closures. API routes should point to controllers.
- Keep route files focused on route registration and middleware grouping.

## Neon, Database, Models, Factories, And Seeders

- Laravel API routes, middleware, services, and Eloquent queries are the authoritative product data-access boundary for Neon-backed product data.
- **Tenant Rules**: Because "owners" and user-specific teams are still a pending decision, all shared tenant access currently uses `owner_id = '0'`. New employees must be created with `owner_id = '0'`, and fetching or updates should permit anyone to manipulate data where `owner_id = '0'` as a shared global pool.
- React must access product data through Laravel API endpoints. Do not call Neon or other product databases directly from React.
- React uses the local app API token from runtime config for current product API access. Treat `APP_API_TOKEN` as a transport guard, not as user/team identity.
- Neon schema changes must be made through timestamped Laravel migration files in `database/migrations`. Use forward-only migrations that can be reviewed, applied, and replayed in order.
- Every new Neon-backed product table or row shape must include matching Laravel migrations, constraints, indexes when useful, Eloquent models, factories, and verification tests.
- Until real owners/teams are designed, services and queries for shared product data must preserve the `owner_id = '0'` global pool behavior.
- Local development must default product data to the Neon `testing` branch through `NEON_TESTING_DATABASE_URL`. A dev-only UI toggle may switch product API requests to `production` by sending the configured branch header, but Laravel must only honor that switch when `neon.dev_branch_toggle_enabled` is true.
- `npx neonctl@latest init` is optional AI-assistant setup and is not required for app runtime. If Neon CLI setup hangs, use Neon Console branch connection strings in `.env` instead.
- Do not package Neon database passwords, `APP_API_TOKEN`, or other privileged credentials into the desktop app unless a user-approved release exception is explicitly documented in the NativePHP release rules below.
- Every new model must include a relevant factory.
- Every new migration that introduces or changes domain data must be paired with factory and seeder updates when seed data is useful for development or verification.
- After creating or changing SQL models, migrations, factories, or seeders, verify the database by running migrations and seeders in a local or testing-safe environment.
- Prefer `php artisan migrate:fresh --seed` only when it is safe to reset the local database. Otherwise use a non-destructive migration command and run the relevant seeder.
- Seeders must create realistic, minimal development data without relying on production data.
- Factories must define valid default data and useful states for important model variants.
- Tests must create their own data through factories and must not depend on global seed order unless the test explicitly verifies seeded reference data.

## API Rules

- New product routes belong in `routes/api.php` unless there is a specific backend-only reason otherwise.
- API endpoints should return JSON responses, API resources, or resource collections.
- Use consistent HTTP verbs and status codes.
- Validate all incoming write requests with Form Request classes.
- Authorize protected actions through policies or request authorization.
- Keep response payloads explicit through resources instead of returning raw models from complex endpoints.
- Do not expose sensitive fields or internal implementation details in API responses.

## React Frontend Rules

- React code belongs under `resources/js`.
- Keep UI components focused on rendering and interaction.
- Put API calls, data mapping, and shared client behavior in clearly named hooks, services, or utilities.
- Put app API token/runtime config resolution in shared frontend hooks or utilities. Do not scatter runtime config parsing through UI components.
- Do not duplicate backend validation as business truth. Client validation may improve UX, but Laravel remains authoritative.
- Reuse existing UI primitives and project styling conventions before introducing new component patterns.
- Every new or changed user-facing UI string must be added to the translation dictionary for all supported languages. Do not hardcode English or Arabic strings in components except stable product names, technical tokens, or values intentionally shown verbatim.
- Keep generated route/action helpers only if they remain compatible with the API-first direction.
- Employee dashboard table controls are React-owned client-side behavior: name search filters only employee names, table sorting/filtering/export use the shared employee table helpers, deadline filters live per contract/iqama deadline column and combine with `AND`, and XLSX export uses the current language with Arabic RTL worksheet formatting when Arabic is selected.

## NativePHP Desktop, Releases, And Updates

- Windows is the first supported packaged desktop target.
- NativePHP/GitHub Releases are the source of truth for desktop updates. Do not add a Neon "latest version" row as the primary updater source unless the user explicitly changes the release model.
- Neon must not store or own app version state unless the release model is explicitly changed. Product tables are for user/product data, not updater metadata.
- Release tags use SemVer with a leading `v`, starting at `v1.0.0`. The packaged app version passed through `NATIVEPHP_APP_VERSION` must be plain SemVer such as `1.0.0` without the leading `v`.
- Every Windows release must publish the installer, blockmap, and `latest.yml` to GitHub Releases because those assets are what NativePHP/Electron update checks consume.
- Local update APIs may expose installed version metadata and trigger NativePHP update checks, but they must not manually download replacement executables.
- Whole-program updates are handled by NativePHP/Electron through GitHub Releases. The app may prompt users to restart/install after an update is downloaded, but it must not silently restart while the user is working.
- React startup/manual update checks must call the local Laravel update API through a dedicated frontend service or hook. Do not scatter updater calls through UI components.
- Check for updates once on React app startup and expose a manual settings action. Do not call `AutoUpdater::checkForUpdates()` repeatedly because duplicate calls can duplicate downloads.
- The updater must stay disabled for local development by default.
- Public GitHub Releases are the default updater source. Private releases require a token strategy that does not bundle long-lived secrets into the packaged app.
- Treat `ext-zip` as a required PHP extension for NativePHP build environments.
- Current Windows release exception: the release workflow intentionally packages `APP_API_TOKEN` and `NEON_PRODUCTION_DATABASE_URL` from GitHub repo Variables into the production app. This is a user-approved exception for the current release model; do not echo their values in logs, only log `SET` or `UNSET`, and do not include `NEON_TESTING_DATABASE_URL` in production release builds.

## GitHub Actions, Tagging, And Releases

- CI QA must pass before any automated release tag is created.
- QA workflows must be check-only. Do not run mutating formatters or auto-commit style fixes in CI.
- Release tags are created intentionally after QA succeeds, either manually or by an explicitly requested release workflow. Do not auto-create release tags on every successful `main` push.
- Tag workflows must not run for tag pushes or recursively create additional tags.
- Every `v*` tag should trigger a Windows NativePHP release build and upload the executable artifacts to a GitHub Release.
- Release workflows must verify that the GitHub Release contains the Windows installer, blockmap, and `latest.yml` before publishing the release.
- Release workflows must use GitHub Actions secrets, repo Variables, and environment variables. Do not commit release tokens or production secrets.

## Testing And Verification

- Prefer Laravel feature tests for API behavior.
- Prefer unit tests for service classes and isolated domain logic.
- Prefer Laravel feature tests for Neon-backed API data-access boundaries.
- Add or update tests when changing validation, authorization, resources, services, models, or API behavior.
- Run the narrowest meaningful checks during development, then run broader checks before handoff when relevant.
- Relevant backend checks include:
    - `composer test`
    - `php artisan test`
    - `composer lint:check`
- Relevant frontend checks include:
    - `npm run lint:check`
    - `npm run types:check`
    - `npm run build`
- Relevant Neon/schema checks include:
    - `npm run test:frontend-migrations`
    - `npm run test:frontend-schema`
- Relevant release checks include validating GitHub Actions YAML and confirming NativePHP build commands run in the target CI environment.
- For documentation-only changes, automated tests are not required unless the documentation change is coupled to code changes.

## Code Quality

- Follow existing Laravel, React, TypeScript, and formatting conventions.
- Before committing or handing off code changes, run the relevant formatting checks. For frontend/resource changes, always run `npm run format:check` or apply Prettier with `npm run format`/targeted `prettier --write` first, then rerun the check.
- Keep changes scoped to the user's request.
- Do not edit `vendor/`, `node_modules/`, generated build assets, or framework cache files unless explicitly requested.
- Prefer dependency injection over facades in services when it improves testability.
- Avoid large classes and mixed responsibilities. Split code when a class starts handling multiple layers or workflows.
- Use clear names that describe domain intent.
- Do not introduce new packages unless the need is clear and the user agrees.
- Never commit secrets, credentials, tokens, or environment-specific private values.
- Keep `.env` and `.env.production` ignored. Commit only safe environment templates such as `.env.example` and `.env.production.example`.

## Future Refactor Direction

- Gradually move the starter Inertia/web-page structure toward an API backend and independently owned React frontend.
- When touching existing Inertia controllers or pages for product work, prefer planning a migration to API routes plus React-owned screens instead of extending the Inertia pattern.
- Keep authentication and security behavior intact while refactoring starter code.
