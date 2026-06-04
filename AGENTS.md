# Agent Instructions

These rules apply to all future AI-assisted work in this project. Follow them before making code changes, and treat them as project-level requirements unless the user explicitly overrides them.

## Context Maintenance

- After Codex context compaction, reread this file before making or planning changes, then continue from the current git/worktree/PR state rather than relying on memory from the pre-compaction chat.
- When a conversation establishes durable project decisions, release rules, architecture constraints, or operational facts that future agents must know, update this file in the same branch before handoff.
- Keep this file concise and durable. Do not add turn-by-turn transcripts, temporary debugging notes, secrets, local machine-only paths unless required for this repo, or facts that can be discovered from source files.
- If this file conflicts with the current user request, ask only when the conflict is high risk; otherwise follow the user's explicit override and update this file when the override becomes a durable project rule.

## Current Project Context

- Active MVP work is tracked on branch `codex/mvp-employee-dashboard` and PR #1 against `main`. Do not push directly to `main`.
- The MVP employee dashboard is React-owned and uses Firebase anonymous auth plus Firestore client access at `users/{uid}/employees/{employeeId}`. Employee dates are stored as `YYYY-MM-DD` strings; optional iqama dates are stored as `null`.
- The local Laravel SPA host injects runtime frontend config, including Firebase web config and whether the app is running under NativePHP. Do not rely on build-time-only Firebase values for packaged desktop releases.
- Native app chrome is custom and React-rendered only when the runtime config reports NativePHP. NativePHP opens the main window frameless and hides/removes the default menu.
- Whole-program updates use NativePHP/Electron updater through GitHub Releases. The app checks once on startup, tracks updater status through local Laravel update APIs, and prompts the user to restart/install after an update is downloaded.
- `v1.0.0` must be created after the PR merges to `main`, not on the feature branch. The release tag should point at the merged `main` commit so the Windows executable is built from production source.

## Project Architecture

- This project is a Laravel API backend with a React frontend.
- Laravel must provide API routes, backend logic, validation, authorization, persistence, and JSON responses.
- React owns the frontend experience: UI, client-side routing, components, forms, state, and user interaction.
- Do not add new Inertia pages, Blade-driven product screens, or server-rendered frontend features.
- Existing Inertia/server-rendered starter code is legacy starter structure and should be refactored away during future product work instead of extended.
- Keep backend and frontend concerns separate. Do not put frontend presentation logic in Laravel controllers, and do not put backend business rules in React components.
- Product data is backed by Firebase Auth plus Firestore client access. Do not reintroduce SQLite or another SQL database for product/domain data unless the user explicitly approves that architectural change.
- Never package Firebase Admin credentials, service-account JSON, private keys, GitHub tokens, or other privileged secrets into the desktop app.

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

## Firestore, Database, Models, Factories, And Seeders

- Firestore Security Rules are the authoritative data-access boundary for client-owned product data.
- React may call Firestore only through dedicated frontend data services, hooks, or utilities. Do not scatter Firestore calls directly through UI components.
- Every new Firestore collection or document shape must include matching security rules, emulator fixtures or setup data, and Firestore rules tests.
- Firestore rules must enforce user ownership and must reject cross-user reads, writes, ownership-field changes, and unauthenticated access unless a route is intentionally public.
- Do not invent Laravel migrations for Firestore-backed product data. Firestore structure changes belong in rules, indexes, typed frontend services, and emulator tests.
- If SQL is explicitly reintroduced for a local-only or backend-only concern, every new model must include a relevant factory.
- If SQL is explicitly reintroduced, every new migration that introduces or changes domain data must be paired with factory and seeder updates when seed data is useful for development or verification.
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
- Put Firebase initialization in a single shared bootstrap module and reuse it through frontend data services.
- Do not duplicate backend validation as business truth. Client validation may improve UX, but Laravel remains authoritative.
- Reuse existing UI primitives and project styling conventions before introducing new component patterns.
- Keep generated route/action helpers only if they remain compatible with the API-first direction.

## NativePHP Desktop, Releases, And Updates

- Windows is the first supported packaged desktop target.
- NativePHP/GitHub Releases are the source of truth for desktop updates. Do not add a Firestore "latest version" document as the primary updater source unless the user explicitly changes the release model.
- Firestore must not store or own app version state unless the release model is explicitly changed. Empty Firestore collections after release builds are normal because Firestore is for user/product data, not updater metadata.
- Release tags use SemVer with a leading `v`, starting at `v1.0.0`. The packaged app version passed through `NATIVEPHP_APP_VERSION` must be plain SemVer such as `1.0.0` without the leading `v`.
- Every Windows release must publish the installer, blockmap, and `latest.yml` to GitHub Releases because those assets are what NativePHP/Electron update checks consume.
- Local update APIs may expose installed version metadata and trigger NativePHP update checks, but they must not manually download replacement executables.
- Whole-program updates are handled by NativePHP/Electron through GitHub Releases. The app may prompt users to restart/install after an update is downloaded, but it must not silently restart while the user is working.
- React startup/manual update checks must call the local Laravel update API through a dedicated frontend service or hook. Do not scatter updater calls through UI components.
- Check for updates once on React app startup and expose a manual settings action. Do not call `AutoUpdater::checkForUpdates()` repeatedly because duplicate calls can duplicate downloads.
- The updater must stay disabled for local development by default.
- Public GitHub Releases are the default updater source. Private releases require a token strategy that does not bundle long-lived secrets into the packaged app.
- Treat `ext-zip` as a required PHP extension for NativePHP build environments.

## GitHub Actions, Tagging, And Releases

- CI QA must pass before any automated release tag is created.
- QA workflows must be check-only. Do not run mutating formatters or auto-commit style fixes in CI.
- Release tags are created intentionally after QA succeeds, either manually or by an explicitly requested release workflow. Do not auto-create release tags on every successful `main` push.
- Tag workflows must not run for tag pushes or recursively create additional tags.
- Every `v*` tag should trigger a Windows NativePHP release build and upload the executable artifacts to a GitHub Release.
- Release workflows must verify that the GitHub Release contains the Windows installer, blockmap, and `latest.yml` before publishing the release.
- Release workflows must use GitHub Actions secrets and environment variables. Do not commit release tokens or production secrets.

## Testing And Verification

- Prefer Laravel feature tests for API behavior.
- Prefer unit tests for service classes and isolated domain logic.
- Prefer Firestore emulator tests for Firestore Security Rules and client data-access boundaries.
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
- Relevant Firestore checks include:
  - `npm run test:firestore-rules`
- Relevant release checks include validating GitHub Actions YAML and confirming NativePHP build commands run in the target CI environment.
- For documentation-only changes, automated tests are not required unless the documentation change is coupled to code changes.

## Code Quality

- Follow existing Laravel, React, TypeScript, and formatting conventions.
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
