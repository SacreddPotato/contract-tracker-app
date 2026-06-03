# Agent Instructions

These rules apply to all future AI-assisted work in this project. Follow them before making code changes, and treat them as project-level requirements unless the user explicitly overrides them.

## Project Architecture

- This project is a Laravel API backend with a React frontend.
- Laravel must provide API routes, backend logic, validation, authorization, persistence, and JSON responses.
- React owns the frontend experience: UI, client-side routing, components, forms, state, and user interaction.
- Do not add new Inertia pages, Blade-driven product screens, or server-rendered frontend features.
- Existing Inertia/server-rendered starter code is legacy starter structure and should be refactored away during future product work instead of extended.
- Keep backend and frontend concerns separate. Do not put frontend presentation logic in Laravel controllers, and do not put backend business rules in React components.

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

## Database, Models, Factories, And Seeders

- Every new model must include a relevant factory.
- Every new migration that introduces or changes domain data must be paired with factory and seeder updates when seed data is useful for development or verification.
- After creating or changing models, migrations, factories, or seeders, verify the database by running migrations and seeders in a local or testing-safe environment.
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
- Do not duplicate backend validation as business truth. Client validation may improve UX, but Laravel remains authoritative.
- Reuse existing UI primitives and project styling conventions before introducing new component patterns.
- Keep generated route/action helpers only if they remain compatible with the API-first direction.

## Testing And Verification

- Prefer Laravel feature tests for API behavior.
- Prefer unit tests for service classes and isolated domain logic.
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

## Future Refactor Direction

- Gradually move the starter Inertia/web-page structure toward an API backend and independently owned React frontend.
- When touching existing Inertia controllers or pages for product work, prefer planning a migration to API routes plus React-owned screens instead of extending the Inertia pattern.
- Keep authentication and security behavior intact while refactoring starter code.
