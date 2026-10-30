# Admin Console Design

## Goal

Turn the existing APEXFITMENT admin page into a useful single-administrator operations console, with access enforced by the server and management workflows matching the data this ecommerce app already stores.

## Current state

- `/admin` has overview, vehicle, wheel, tyre, and order tabs.
- The login accepts `admin / admin123` in client JavaScript and stores a flag in `sessionStorage`.
- Every `/api/admin/*` route currently performs database operations without checking authentication.
- Catalog pages support create, delete, and partial variant price/stock updates; they do not provide search or editing of most catalog fields.
- Orders can be listed and have status/tracking changed; lists lack search and filters, and requests do not consistently surface failures.
- The database already stores customers, reviews, gallery builds, order items, and inventory, but the admin page has no workflows for several of these.
- The app uses Next.js 16, React 19, Prisma, and SQLite. The current project has no Git repository metadata at the inspected directory.

## Direction

Keep the current admin visual identity and stack. Use a server-side, single-admin credential configured through environment variables, with a short-lived signed session in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in production). Never ship a credential or session secret to the browser. Protect admin page access and every admin API handler on the server. Provide login, session inspection, and logout endpoints, and include a clear local setup/configuration guide. Missing or invalid production configuration must fail closed.

Because stateless signed sessions cannot be individually revoked, logout clears the browser cookie and credential/session-secret rotation invalidates outstanding sessions. Session lifetime and secret rotation are documented. Mutating requests validate their origin and use same-site cookies to limit CSRF exposure.

## Admin workflows

1. **Overview:** show order, revenue, pending-order, and low-stock signals from database values; include useful empty, loading, and retry/error states.
2. **Orders:** search and filter by status, inspect customer, shipping/contact, line items, payment and fulfillment details, and update only supported status/tracking fields. Validate allowed status transitions/values and provide save feedback.
3. **Inventory/catalog:** retain vehicle, wheel, and tyre management; add practical text search and edit forms for existing catalog records and variants, preserve stock/price editing, and make destructive actions clear and recoverable where the schema permits. Use validated inputs and useful API errors.
4. **Customers:** searchable, paginated read-only customer directory with account details and order history. Do not expose password-like secrets or add customer impersonation.
5. **Reviews:** inspect reviews and associated product/customer, with a moderation action that removes inappropriate content. Preserve referential integrity and clearly confirm destructive actions.
6. **Gallery:** inspect and manage gallery builds, including removal of a build that should no longer be public, with explicit confirmation.

The first release is a single-admin console; multi-admin invitations, granular roles, staff audit history, payment refunds, and customer account suspension are out of scope because the existing system has no supporting workflows or integration.

## API and data boundaries

- Centralize server-side session verification and call it from every admin API route before database access. Public storefront APIs remain public.
- Validate request body shape, identifiers, supported enum-like values, and numeric ranges before Prisma writes; map expected validation, not-found, and conflict failures to appropriate HTTP responses.
- Add admin-only endpoints for login/session/logout and customer/review/gallery operations. Paginate potentially unbounded lists and return only fields needed by the UI.
- Add search/filter parameters with bounded page sizes. Keep product and order data in the existing Prisma models unless a specific moderation state requires a schema field; prefer a minimal migration over deleting content when reversible moderation is practical.
- Ensure mutations refresh the relevant list and overview, and display request failures instead of silently succeeding.

## UX and accessibility

- Keep the dark APEXFITMENT styling and responsive sidebar/tab navigation.
- Add clear page headings, selected-tab semantics, keyboard-visible focus, accessible dialog names and close behavior, descriptive action labels, and status feedback.
- Give every data view loading, empty, error/retry, and success states. Confirm destructive actions with the affected record named.
- Use responsive tables or cards that remain operable on narrow screens; retain appropriate labels and table headers.

## Configuration and deployment

Document the required admin username, scrypt password hash, and high-entropy session signing secret in `.env.example` or the project’s equivalent safe example. Do not add real credentials. Document a command or small script to generate the password hash using Node’s built-in crypto, cookie/HTTPS expectations, session lifetime, and secret rotation. The local SQLite database is retained for development; production deployment must use the configured database and persistent storage supported by the hosting environment.

## Acceptance criteria

- No default demo credential remains in source or login UI.
- Anonymous requests cannot access `/admin` data or invoke any admin API method; authenticated requests can, and logout/expiry revoke browser access.
- Existing public storefront API behavior remains unchanged.
- Admins can find and manage supported orders, vehicle/wheel/tyre catalog and stock, inspect customers and order histories, moderate reviews, and manage gallery builds.
- Search, filters, and pagination work through server-backed bounded requests for large lists.
- Invalid writes and network/database failures are visible and do not appear successful.
- Admin screens remain keyboard accessible and usable on mobile widths.
- Required environment setup and operational limits are documented.

## Implementation sequence

1. Establish environment-backed auth helpers, login/session/logout handlers, page gating, and guards on every current admin API route.
2. Harden shared admin API validation/error conventions and complete existing order/catalog editing, filtering, and feedback.
3. Add customer, review moderation, and gallery management endpoints and UI.
4. Improve dashboard signals, shared responsive/accessibility states, and configuration/deployment documentation.

## Risks and open constraints

- The repository is a local SQLite demo and has no deployment target, TLS configuration, or production database settings. This design can make the application boundary production-oriented, but deployment readiness depends on setting secrets and using durable production infrastructure.
- Stateless sessions cannot be revoked individually; rotating the signing secret invalidates all sessions.
- Deleting catalog records can affect historical references. Implementations should block unsafe deletes or use non-destructive moderation where supported, rather than cascade-delete order history.
- Next.js 16 conventions are unusual in this repository; implementation must consult the installed Next.js documentation before changing routing or request APIs.
