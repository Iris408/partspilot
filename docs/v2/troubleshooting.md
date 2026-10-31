# PartsPilot Troubleshooting

## Overview

This guide covers common development, Docker, database, frontend, backend, authentication, and CI problems that may occur while working with PartsPilot.

For installation and environment configuration, see the [Setup Guide](./setup.md).

---

# Quick Diagnostics

Before investigating a specific issue, confirm the current environment.

## Docker Services

```bash
docker compose ps
```

## Docker Logs

```bash
docker compose logs
```

For a specific service:

```bash
docker compose logs api
```

```bash
docker compose logs frontend
```

```bash
docker compose logs db
```

## Backend Tests

```bash
cd backend
pytest
```

## Frontend Build

```bash
cd frontend
npm run build
```

## Docker Compose Configuration

```bash
docker compose config --quiet
```

## Git Status

```bash
git status
```

---

# Current Local Development Environment

The known working PartsPilot development environment is:

```text
PostgreSQL
Docker
localhost:5436

        │
        ▼

FastAPI
localhost:8001

        │
        ▼

React / Vite
localhost:5173
```

When troubleshooting, first confirm that the expected service is running on the expected port.

---

# PostgreSQL Connection Refused

## Example

A backend startup failure may contain an error similar to:

```text
psycopg2.OperationalError:
connection to server at "localhost" failed:
Connection refused
```

## Likely Cause

The correct PostgreSQL address depends on where FastAPI is running.

If FastAPI runs directly on the host, it can connect through the host-mapped PostgreSQL port.

If FastAPI runs inside Docker, `localhost` refers to the FastAPI container itself and does not refer to PostgreSQL.

---

## Local FastAPI

When FastAPI runs directly on the host and PostgreSQL runs in Docker:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5436/DATABASE
```

The connection path is:

```text
FastAPI
localhost:8001
      │
      ▼
PostgreSQL
localhost:5436
```

---

## Docker FastAPI

When FastAPI runs inside Docker Compose, use the PostgreSQL Compose service name and internal port:

```env
DATABASE_URL=postgresql://USER:PASSWORD@db:5432/DATABASE
```

The connection becomes:

```text
FastAPI container
       │
       ▼
    db:5432
       │
       ▼
PostgreSQL container
```

Check the current service name in `docker-compose.yml` before modifying the connection string.

---

# PostgreSQL Container Is Healthy but API Fails

A healthy PostgreSQL container does not guarantee that FastAPI is using the correct database configuration.

Check:

```bash
docker compose ps
```

If FastAPI is running locally, inspect its terminal output.

If FastAPI is running in Docker:

```bash
docker compose logs api
```

Verify:

- Database hostname
- Database port
- Database name
- Username
- Password
- `DATABASE_URL`
- Docker Compose service name
- Environment variable overrides

For the current host-based FastAPI workflow, PostgreSQL should normally be reachable through:

```text
localhost:5436
```

---

# Existing PostgreSQL Data

Docker volumes persist database data between normal container restarts.

If PostgreSQL reports:

```text
PostgreSQL Database directory appears to contain a database;
Skipping initialization
```

this normally means that an existing PostgreSQL volume is being reused.

This is expected when persistent database data already exists.

---

# Inspect the PostgreSQL Database

The current PartsPilot PostgreSQL container can be accessed with:

```bash
docker compose exec db psql -U inventory_user -d partspilot_db
```

List the current tables:

```text
\dt
```

Expected application tables include:

```text
alembic_version
items
suppliers
users
```

Exit PostgreSQL with:

```text
\q
```

---

# Reset the Local Database

If the local database genuinely needs to be reset:

```bash
docker compose down -v
```

Then restart the required services.

For the current development workflow:

```bash
docker compose up -d db
```

> **Warning:** `docker compose down -v` removes Compose-managed volumes and deletes locally persisted PostgreSQL data.

Do not use this as a routine troubleshooting step when the existing data needs to be retained.

---

# Database Schema Problems

If the application code expects a structure that differs from the current PostgreSQL schema, verify the database and migration state.

PartsPilot uses Alembic for schema changes.

Check that:

- The expected migration exists.
- The correct database is being used.
- The database schema matches the SQLAlchemy models.
- The expected tables exist.
- An older Docker volume is not retaining an incompatible schema.

Avoid deleting the database immediately.

Determine whether the issue should be fixed through the migration state first.

---

# Backend Does Not Start

For the current local development workflow:

```bash
cd backend
uvicorn main:app --reload --port 8001
```

If required:

```bash
python3 -m uvicorn main:app --reload --port 8001
```

Common causes include:

- Missing dependencies
- Incorrect imports
- Missing environment variables
- PostgreSQL connection failure
- Invalid `DATABASE_URL`
- Python syntax errors
- Port `8001` already in use

Check Python source compilation with:

```bash
python3 -m compileall .
```

Run backend tests with:

```bash
pytest
```

---

# Frontend Cannot Reach Backend

If the frontend loads but API-dependent functionality fails, check:

```text
frontend/.env
```

The current local value should be:

```env
VITE_API_URL=http://localhost:8001
```

Also verify:

- FastAPI is running on port `8001`.
- PostgreSQL is running.
- The frontend `.env` file is being loaded.
- The requested API endpoint is correct.
- CORS allows the frontend origin.
- The authentication token is present when required.

After changing Vite environment variables, restart the Vite development server.

---

# CORS Errors

If the browser reports a CORS error, confirm that the frontend origin is permitted by the FastAPI CORS configuration.

The current local frontend normally runs at:

```text
http://localhost:5173
```

The backend normally runs at:

```text
http://localhost:8001
```

A CORS problem may appear even when the backend itself is working correctly.

Check the browser developer tools for:

- Request URL
- Request method
- Request headers
- Response headers
- Response status

---

# Frontend Build Fails

Run:

```bash
cd frontend
npm run build
```

Read the first meaningful TypeScript or Vite error before changing unrelated files.

Common causes include:

- Missing imports
- Deleted or renamed components
- Incorrect import paths
- TypeScript type errors
- Missing dependencies
- Environment configuration problems
- Stale legacy files still included in compilation

For example, an unused legacy file may still reference a deleted component.

If the file is no longer part of the intended application, removing the obsolete file may be more appropriate than rebuilding an unused dependency around it.

---

# Vite Development Server Does Not Start

Start the frontend with:

```bash
cd frontend
npm run dev
```

The expected development URL is:

```text
http://localhost:5173
```

Common causes include:

- Missing `node_modules`
- Port `5173` already in use
- Invalid Vite configuration
- Missing environment variables
- Dependency installation problems

If dependencies are missing:

```bash
npm install
```

---

# Docker Build Is Very Slow

If Docker spends a long time transferring the build context, inspect the relevant `.dockerignore`.

Large directories such as:

```text
node_modules/
dist/
.git/
```

should generally not be included when they are unnecessary for the image build.

Also inspect the reported build-context size.

An unexpectedly large context can significantly increase build time.

---

# Docker Changes Are Not Appearing

Containers may still be using an older image.

Rebuild:

```bash
docker compose down
docker compose up --build
```

For forced recreation:

```bash
docker compose down
docker compose up --build --force-recreate
```

Inspect the current containers with:

```bash
docker compose ps
```

If only PostgreSQL is needed for the local development workflow, restarting the database alone is usually sufficient:

```bash
docker compose up -d db
```

---

# Port Already in Use

Current development ports are:

```text
Frontend:   localhost:5173
FastAPI:    localhost:8001
PostgreSQL: localhost:5436
```

If a port is already allocated, first identify whether an old PartsPilot process or container is still running.

Check Docker:

```bash
docker ps
```

Check Compose:

```bash
docker compose ps
```

Stop unused Compose services with:

```bash
docker compose down
```

Avoid changing PartsPilot's configured ports unnecessarily when the conflict is caused by an old process or container.

---

# Backend Tests Fail

Run:

```bash
cd backend
pytest -v
```

Focus on the first failing test or collection error.

Common causes include:

- Import errors
- Missing dependencies
- Environment configuration
- Database setup
- Changed endpoint behaviour
- Changed response schemas
- Test assumptions that no longer match the application

Test collection failures should be resolved before debugging individual assertions because the tests have not yet started executing.

---

# Pytest Collects No Tests

If pytest reports:

```text
collected 0 items
```

verify that test files follow pytest naming conventions.

For example:

```text
backend/
└── tests/
    └── test_items.py
```

Test functions should normally begin with:

```python
def test_example():
    ...
```

An empty test file may exist without containing tests, but CI can treat a run with zero collected tests as unsuccessful depending on the workflow configuration.

---

# Authentication Problems

If login succeeds but protected requests fail, verify:

- An access token was returned.
- The frontend stored the expected token.
- Requests include the `Authorization` header.
- The header uses the `Bearer` scheme.
- The token has not expired.
- The backend is using the expected authentication configuration.

Authenticated requests should resemble:

```text
Authorization: Bearer <access_token>
```

The public frontend route:

```text
/login
```

is separate from the backend authentication endpoint:

```text
/auth/login
```

This distinction is intentional.

---

# Authentication Token Missing

PartsPilot's frontend API service expects an authentication token for protected requests.

If the token is missing, API operations can fail before the request is sent.

Check browser storage and confirm that login has successfully stored the expected token.

If a request returns:

```text
401 Unauthorized
```

the frontend removes the stored token as part of the current authentication handling.

Logging in again should create a new authenticated session.

---

# Swagger Works but Frontend Does Not

If API operations work through Swagger but fail through React, the backend may not be the source of the problem.

Check:

```text
React
  │
  ├── VITE_API_URL
  ├── request path
  ├── authentication token
  ├── HTTP method
  ├── request body
  └── CORS
       │
       ▼
    FastAPI
```

Use browser developer tools to inspect:

- Request URL
- HTTP method
- Request headers
- Response status
- Response body

This helps separate frontend request problems from backend API problems.

---

# Inventory Data Does Not Refresh

If an inventory operation succeeds but the interface does not reflect the change, first confirm whether the backend operation completed successfully.

Check:

1. Browser network response.
2. FastAPI response status.
3. PostgreSQL record if necessary.
4. Frontend state refresh logic.

Do not assume a successful API request automatically means the local React state has been refreshed.

This distinction is especially useful when debugging add, edit, and delete workflows.

---

# Supplier Data Does Not Refresh

Supplier CRUD follows the same API-driven pattern as inventory.

If supplier changes do not appear in the UI:

- Confirm the `/suppliers` request succeeded.
- Check the HTTP response.
- Confirm the PostgreSQL record changed.
- Verify the frontend refreshes or updates supplier state.
- Check active search or filter settings.

A successfully created or updated supplier may be hidden by the current frontend filters.

---

# GitHub Actions Fails but Local Checks Pass

CI and the local environment may differ.

Check:

- Python version
- Node version
- Installed dependencies
- Environment variables
- File-path casing
- Operating-system differences
- Working directory
- Database or service configuration

Start with the exact command that failed in GitHub Actions and reproduce it locally where possible.

Do not change unrelated application code until the failing CI step is understood.

---

# Docker CI Fails

First determine where the failure occurs:

```text
Dockerfile parsing
        │
        ▼
Dependency installation
        │
        ▼
Application build
        │
        ▼
Image creation
```

Run locally:

```bash
docker compose build
```

Also validate Compose:

```bash
docker compose config --quiet
```

Inspect the first meaningful build error rather than only the final Docker failure message.

---

# Deployment-Related Issues

The React frontend is currently hosted on Vercel.

The FastAPI backend and PostgreSQL database are not currently publicly deployed.

If the Vercel frontend cannot access authenticated application functionality, confirm whether the configured `VITE_API_URL` points to a reachable public backend.

A value such as:

```env
VITE_API_URL=http://localhost:8001
```

only works when the frontend is running in an environment that can reach that local backend.

When a public backend is deployed, the Vercel environment variable should use that public HTTPS API URL.

---

# Useful Diagnostic Workflow

When an error occurs:

```text
Observe failure
      │
      ▼
Read exact error
      │
      ▼
Identify affected layer
      │
      ├── Frontend
      ├── Backend
      ├── Database
      ├── Docker
      └── CI
      │
      ▼
Run smallest relevant check
      │
      ▼
Reproduce locally
      │
      ▼
Identify root cause
      │
      ▼
Apply smallest relevant fix
      │
      ▼
Run validation again
```

Avoid rebuilding, resetting, or modifying the entire application unless the evidence indicates that it is necessary.

---

# Useful Commands

```bash
# Docker state
docker compose ps

# All Docker logs
docker compose logs

# API container logs
docker compose logs api

# Database logs
docker compose logs db

# Frontend container logs
docker compose logs frontend

# Start PostgreSQL only
docker compose up -d db

# Open PostgreSQL
docker compose exec db psql -U inventory_user -d partspilot_db

# Validate Compose
docker compose config --quiet

# Run FastAPI locally
cd backend && uvicorn main:app --reload --port 8001

# Backend tests
cd backend && pytest

# Python source check
cd backend && python3 -m compileall .

# Run frontend locally
cd frontend && npm run dev

# Frontend production build
cd frontend && npm run build

# Git whitespace check
git diff --check

# Stop Docker services
docker compose down

# Rebuild Docker services
docker compose up --build
```

---

## Related Documentation

- [Documentation Index](./README.md)
- [Setup Guide](./setup.md)
- [Architecture](./architecture.md)
- [API Reference](./api-reference.md)
- [Testing](./testing.md)
- [Project Details](./project-details.md)
- [Roadmap & Maintenance](./roadmap.md)