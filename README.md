# Codistack: official website

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · PostgreSQL via Drizzle ORM.

## What's here

| Route | Purpose |
|---|---|
| `/` | Hero, About, Services, Products (BILLINGHACKS), Future roadmap, Contact + project inquiry form, FAQ |
| `/early-access` | BILLINGHACKS beta waiting-list registration (separate from project inquiries) |
| `/privacy`, `/terms` | Draft legal pages. Items marked **[TO BE CONFIRMED]** need operator details |
| `/admin`, `/admin/login` | Authenticated lead management (search, filter, status, CSV export) |
| `/api/early-access`, `/api/project-inquiry` | Validated, rate-limited, idempotent submission endpoints |
| `/api/form-token` | Short-lived signed anti-spam token |
| `/api/admin/*` | login / logout / status update / CSV export (all server-authorised) |
| `/api/health` | Health check |

## Missing brand asset (action required)

The official Codistack logo was **not present in the project**, so none was invented. Add PNGs to `public/brand/`
(see `public/brand/README.md`): `codistack-logo.png`, optionally `codistack-logo-dark.png` and
`codistack-symbol.png` (favicon), then rebuild. `src/lib/brand.ts` detects them automatically; with only the original
logo, it is shown on a designed light glass pill; with a transparent light-wordmark variant it is shown directly.
Until then a neutral text label is displayed. The hero's 3D glass stack is an original software-architecture visual,
not a logo substitute.

## Local development

```bash
cp .env.example .env        # fill in values
npm install
npx drizzle-kit push        # creates tables from src/db/schema.ts
npm run dev
```

Production: `npm run build && npm start`.

## Environment variables

See `.env.example`. `DATABASE_URL` (server only), `APP_SECRET` (32+ random chars), `ADMIN_EMAIL`,
`ADMIN_PASSWORD_HASH`, and `NEXT_PUBLIC_SITE_URL` (set only once the real domain is confirmed).

### Create an administrator

There is no default account. Generate a hash locally and put it in your host's environment settings:

```bash
node scripts/hash-password.mjs "a-long-unique-password"
```

The admin area stays disabled unless `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `APP_SECRET` are all set.

## Data model (`src/db/schema.ts`)

- `early_access_registrations`: unique normalized email, unique idempotency key, consent timestamp + version, status
  (`waiting|contacted|invited|declined`), hashed IP, user-agent, timestamps. CHECK constraints on status and length.
- `project_inquiries`: unique `(email, content hash)` and idempotency key, status
  (`new|in_review|contacted|closed|spam`), optional budget/timeline, hashed IP, timestamps.
- `rate_limits`: PostgreSQL-backed fixed-window counters (hashed keys).

## Security design

- All writes go through server route handlers; the DB is never reachable from the browser. No public read endpoint.
- Zod validation on client **and** server; DB constraints as the last line of defence.
- Rate limits: early access 6 / 10 min, inquiries 5 / 15 min, admin login 5 / 15 min (per IP, persisted in Postgres).
- Spam: hidden honeypot, HMAC-signed form token with minimum fill time (3 s) and expiry (2 h).
- Idempotency key per form session makes retries safe; duplicates are detected in the database.
- Raw IPs are never stored (salted HMAC only). Responses never claim success before the insert is confirmed.
- Admin: scrypt password hash, constant-time comparison, signed HttpOnly + SameSite=Strict session cookie (8 h),
  authorisation enforced in every admin route handler and page. CSV export neutralises formula injection.
- Same-origin checks on mutations; security headers set in `next.config.ts`.
- Not implemented: strict CSP, CAPTCHA/Turnstile, email notifications. Consider adding them before heavy traffic.
- **Supabase / RLS:** this build uses the project's existing PostgreSQL with server-only access instead of Supabase,
  so Row-Level Security is not used. If you move to Supabase, enable RLS on all three tables with no public policies and
  connect only via a server-side connection string.

## Deployment

1. Provision a PostgreSQL database (a separate one from any BILLINGHACKS operational database).
2. Set the environment variables on your host (Vercel, a Node server, etc.). Never commit secrets.
3. Run `npx drizzle-kit push` against the production database.
4. `npm run build`; deploy. Serve over HTTPS only.
5. Domain: connect it at the host, then set `NEXT_PUBLIC_SITE_URL` and redeploy so sitemap, canonical URLs, and
   structured data use the real domain. The domain and trademark availability are **unverified**.
6. Behind a proxy, make sure `x-forwarded-for` / `x-forwarded-proto` come from your trusted proxy only.

Status: **not deployed**. No hosting account or domain exists yet.

## Verified in this build (actually run)

- `next typegen`, `tsc --noEmit`, `eslint .`, `next build`: pass.
- Live API tests against the real local PostgreSQL: validation errors (422), missing consent, forged/too-fast tokens,
  honeypot, successful insert (201) persisted with consent version and hashed IP, safe retry with same key,
  duplicate email (case-insensitive) → "duplicate", duplicate inquiry content, cross-origin POST blocked (403),
  rate limiting (429) on both forms and admin login.
- Auth: unauthenticated `/admin` redirects to login; unauthenticated export and status update return 401; bad login
  401; good login sets an HttpOnly cookie; authenticated dashboard shows stored records, status update works and rejects
  invalid values; CSV export works.
- All pages return 200; security headers present.

## Not verified / limitations

- No browser was available: visual QA, responsive layouts, animation smoothness, mobile menu behaviour, and automated
  accessibility / Lighthouse audits were **not run**. Review on real devices before launch.
- Database-outage error path (503 messaging) is implemented but not exercised.
- Production admin credentials and email delivery are not configured.
- Legal pages are drafts requiring operator details and legal review.
