# Sixt Students App

Shift management for student workers. Students request shifts and upload their monthly contracts; admins build the schedule, track attendance and run payroll.

A portfolio project. Try it with the one-click logins described in [Demo mode](#demo-mode).

## Features

**Students**

- Weekly calendar of shifts (morning 07–15, middle 10–18, afternoon 14–22): request and cancel shifts, see assignments and the next shift
- Personal stats and earnings, a monthly earnings goal, and a monthly leaderboard ("Race", ranked by hours worked)
- Upload, view and delete the monthly contract PDF (stored in S3)

**Admins**

- Dashboard with totals and recent students
- Schedule: approve requests, assign students, record arrival/leave times and no-shows
- Students: create (temporary password or emailed setup link), edit, deactivate/reactivate, send password reset links, delete students with no shift activity
- Contracts overview with email reminders for missing ones
- Payroll: monthly budget, mark students as paid
- Settings: default hourly rate and monthly goal for new students

Shifts are generated automatically, about three weeks ahead (on startup and every day at midnight).

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router, TanStack Query, Recharts
- **Backend:** Node.js, Express 5, TypeScript, PostgreSQL (SQL migrations with node-pg-migrate), JWT in httpOnly cookies with refresh tokens, argon2, rate limiting, node-cron
- **Services:** AWS S3 (contract PDFs), Resend (emails)
- **Tooling:** Vitest, Docker Compose (Postgres, backend, frontend behind nginx, Caddy for HTTPS on a server)

```
backend/              Express API: src/, migrations/, db/ (SQL seeds), scripts/, tests/, openapi.yaml
frontend/             React app: src/, nginx.conf, Dockerfile
docker-compose.yml    db + backend + frontend (+ Caddy on a server)
Caddyfile             Caddy config for the server setup
.env.example          settings for docker compose itself (demo flag, domain)
```

## Getting started

### With Docker

1. Create the backend config and fill it in (see [Configuration](#configuration)). Set `FRONTEND_URL=http://localhost:8080`.
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Start everything. The app is served on http://localhost:8080. The backend creates or updates the database tables itself every time it starts.
   ```bash
   docker compose up -d --build
   ```
3. Add test users and shifts. No migration creates a user, so you need a seed to log in.
   ```bash
   docker compose exec db psql -U postgres -d studentsapp -f /seed/seed_test_data.sql
   ```
   Log in as `admin.horvat` (admin) or `fran.sipek` (student), password `password123`. Optionally run `/seed/seed_stats_data.sql` the same way (after the first one) for about six months of history.

The compose file supplies the database settings itself. Settings for compose itself (demo flag, domain, `RESEND_API_KEY`) go in a `.env` file next to `docker-compose.yml`, see `.env.example`.

Everyday commands:

| What you want                    | Command                          |
| -------------------------------- | -------------------------------- |
| Start, or apply code changes     | `docker compose up -d --build`   |
| Watch what the backend is doing  | `docker compose logs -f backend` |
| Stop (keeps the database)        | `docker compose down`            |
| Stop and delete the database too | `docker compose down -v`         |

### Without Docker

Requires Node.js 22.12 or newer and a PostgreSQL database (the compose file uses version 18).

```bash
# backend (http://localhost:3000)
cd backend
cp .env.example .env     # edit the values, and make DATABASE_URL match the DB_* settings
npm install
npm run migrate up
psql -U postgres -d studentsapp -f db/seed_test_data.sql
npm run dev
```

```bash
# frontend (http://localhost:5173), in a second terminal
cd frontend
cp .env.example .env     # set VITE_API_BASE_URL=http://localhost:3000/api
npm install
npm run dev
```

## Configuration

**Backend** (`backend/.env`, see `backend/.env.example`)

| Variable                                                  | Purpose                                                                                  |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Database connection used by the app                                                      |
| `DATABASE_URL`                                            | Database connection used by `npm run migrate`                                            |
| `JWT_ACCESS_SECRET`                                       | Secret for signing access tokens                                                         |
| `ACCESS_TOKEN_EXPIRATION` / `REFRESH_TOKEN_EXPIRATION`    | Token lifetimes, in minutes / in days                                                    |
| `FRONTEND_URL`                                            | Allowed CORS origin, and the base of links in emails                                     |
| `AWS_REGION`, `S3_BUCKET_NAME`                            | S3 bucket for contracts. **Required: the server will not start without them**            |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`              | S3 credentials, read by the AWS SDK                                                      |
| `S3_FILE_SIZE_LIMIT`                                      | Maximum contract upload size in MB (default 10)                                          |
| `RESEND_API_KEY`                                          | Sending emails (password reset, account setup, contract reminders)                       |
| `TRUST_PROXY`                                             | Number of reverse proxies in front of the backend, so rate limiting sees real client IPs |
| `NODE_ENV`                                                | `production` makes auth cookies `Secure` (HTTPS only). The Docker image sets it          |
| `DEMO_MODE`                                               | `true` only on the demo, see below                                                       |

**Frontend** (`frontend/.env`): `VITE_API_BASE_URL` is the API URL (the Docker image uses `/api`, which nginx forwards to the backend). `VITE_DEMO_MODE=true` turns on the demo UI. Vite reads both when the app is built or started.

**Docker Compose** (`.env` next to `docker-compose.yml`, see `.env.example`): `VITE_DEMO_MODE`, `COMPOSE_PROFILES=prod` and `DOMAIN` (only on a public server), and `RESEND_API_KEY`.

## Demo mode

A public demo with fictional data that resets itself every night.

- **Logins:** `demo.admin` and `demo.student`, both with password `password123`. The login page has buttons for both.
- **Data:** one admin and 20 students (only the two logins above work), about 8 months of shifts, requests, contracts and payroll, plus pending requests for the next three weeks for the admin to approve. It is generated relative to today by `backend/db/seed_demo.sql`.
- **Backend `DEMO_MODE=true`:**
  - emails are not sent (only recipient and subject are logged)
  - changing a password and resetting it by token are blocked (403)
  - every time the backend starts, and every day at 03:00 (Europe/Zagreb), it wipes the database, seeds it again and uploads fresh contract PDFs to S3. If the reset fails at startup, the error is logged and the server starts anyway
- **Frontend `VITE_DEMO_MODE=true`:** shows the demo login buttons and a banner. This is fixed when the frontend is **built**.
- **Not blocked, on purpose:** an admin can change a user's role or deactivate the demo accounts. The next nightly reset undoes it.
- **Manual reset:** `npm run demo:reset` in `backend/` (or `docker compose exec backend npm run demo:reset`). It **deletes all data in the connected database**, and refuses to run unless `DEMO_MODE=true`.

### Deploying the demo

Run everything on one small Linux server (a VPS) with this compose file. Caddy sits in front and serves the app over HTTPS, which is required because the login cookies are `Secure`. Nginx and the backend stay behind it, so the frontend and the API share one address and no CORS setup is needed.

**You need**

- A server with a public IP, ports 80 and 443 open, and [Docker with the Compose plugin](https://docs.docker.com/engine/install/)
- A domain (or a free subdomain from a service such as DuckDNS) with an `A` record pointing at the server's IP, set up before the first start
- An S3 bucket used by nothing else. The database is created by compose and the reset wipes it, so it must not hold anything you care about

**Steps, on the server**

1. Get the code and go into the folder:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```
2. Backend config: `cp backend/.env.example backend/.env`, then set `DEMO_MODE=true`, `FRONTEND_URL=https://<your-domain>`, `TRUST_PROXY=1`, a long random `JWT_ACCESS_SECRET` (for example from `openssl rand -hex 32`), and the four S3 values. No Resend key is needed.
3. Server config: `cp .env.example .env`, then set `VITE_DEMO_MODE=true`, `COMPOSE_PROFILES=prod` and `DOMAIN=<your-domain>`.
4. Start everything. The first build takes a few minutes. On its own, the backend creates the tables, loads the demo data and uploads the contract PDFs, and Caddy gets the HTTPS certificate.
   ```bash
   docker compose up -d --build
   ```
5. Watch the backend until it prints "Server is running on port 3000", then open `https://<your-domain>`.
   ```bash
   docker compose logs -f backend
   ```

To update after a code change, run `git pull` and then `docker compose up -d --build`. The containers restart by themselves after a crash or a reboot.

Good to know:

- If the domain does not point at the server yet, Caddy cannot get a certificate and keeps retrying. Check `docker compose logs caddy`.
- Port 8080 is only open on the server itself, so Caddy is the only public entry.
- `TRUST_PROXY=1` is for Caddy. It sets the client IP header, and the bundled nginx passes it on without adding one of its own.
- Every backend start resets the demo, so a redeploy resets it too.

## Tests and checks

```bash
cd backend && npm run test:run      # Vitest, no database needed
cd backend && npm run typecheck
cd frontend && npm run lint
cd frontend && npm run build        # type-checks, then builds
```

## API

The API is documented in `backend/openapi.yaml` (OpenAPI 3.1). It does not yet cover the payroll, admin contracts and settings endpoints.
