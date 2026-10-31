# PartsPilot Testing

## Overview

PartsPilot uses automated tests, build validation, Docker validation, and GitHub Actions CI to help detect regressions across the backend, frontend, and containerised application.

PartsPilot v2.0.0 is feature complete and is now in maintenance.

Testing will continue to improve during maintenance, with priority given to protecting existing application behaviour and preventing regressions.

---

## Current Testing Status

PartsPilot currently includes:

- Backend tests with `pytest`
- FastAPI endpoint testing
- Frontend TypeScript production build validation
- Docker build validation
- GitHub Actions CI
- Local Python validation
- Docker Compose configuration validation
- Manual responsive and application-flow testing

Automated coverage can continue to expand during maintenance without reopening the project's feature-development cycle.

---

# Backend Testing

Backend tests are located in:

```text
backend/tests/
```

The backend test suite uses:

```text
pytest
```

Tests should focus on behaviour that could cause application regressions, including:

- Authentication
- API endpoints
- Inventory operations
- Supplier operations
- Request validation
- Search and filtering
- Sorting and pagination
- Analytics
- Error handling
- Database-dependent behaviour

---

## Run Backend Tests

From the project root:

```bash
cd backend
pytest
```

A successful run should complete without failed tests.

For more detailed output:

```bash
pytest -v
```

---

## Run Tests Inside Docker

When the API container is running:

```bash
docker compose exec api pytest
```

This executes the backend test suite inside the containerised environment.

---

# API Testing

FastAPI provides interactive Swagger/OpenAPI documentation that can be used for manual API verification.

### Local Development

```text
http://localhost:8001/docs
```

Swagger is useful for manually checking:

- Authentication
- Request schemas
- Inventory endpoints
- Supplier endpoints
- Query parameters
- Analytics endpoints
- Validation responses
- HTTP status codes

Swagger testing complements the automated test suite but does not replace automated tests.

---

# Frontend Validation

The frontend currently uses production build validation as its primary automated check.

From `frontend/`:

```bash
npm run build
```

This verifies that the React and TypeScript application can successfully produce a production build.

The build process helps identify problems including:

- TypeScript errors
- Missing modules
- Invalid imports
- Build-time configuration problems

---

## Manual Frontend Testing

PartsPilot's main application flows should also be manually checked when relevant changes are made.

Important flows include:

- Public landing page
- Login
- Demo access
- Protected routing
- Dashboard
- Inventory CRUD
- Inventory search
- Inventory filtering
- Inventory sorting
- Inventory pagination
- Supplier CRUD
- Supplier search and filtering
- Reports
- CSV export
- Settings
- Logout

Responsive behaviour should be checked across both desktop and mobile layouts.

Manual testing is particularly useful for interaction and layout behaviour that is not currently covered by automated frontend tests.

---

# Python Validation

Python source files can be checked for compilation errors using:

```bash
cd backend
python3 -m compileall .
```

Depending on the local Python installation:

```bash
python -m compileall .
```

The same check can be run inside Docker:

```bash
docker compose exec api python -m compileall .
```

---

# Docker Validation

## Compose Configuration

Docker Compose configuration can be validated with:

```bash
docker compose config --quiet
```

No output indicates that the Compose configuration is valid.

---

## Build Validation

Application images can be rebuilt with:

```bash
docker compose build
```

Or started with a fresh build:

```bash
docker compose up --build
```

This can detect problems including:

- Invalid Dockerfiles
- Missing files
- Dependency installation failures
- Frontend build problems
- Backend image build problems
- Invalid container configuration

---

## Runtime Verification

After starting the required PartsPilot services:

```bash
docker compose ps
```

Confirm that the expected containers are running.

When FastAPI is running locally on the current development port, the API can be checked with:

```bash
curl http://localhost:8001/
```

Swagger is available at:

```text
http://localhost:8001/docs
```

---

# GitHub Actions

PartsPilot uses separate CI workflows for the main application areas.

```text
Push / Pull Request
        │
        ▼
 GitHub Actions
        │
        ├── Backend CI
        │
        ├── Frontend CI
        │
        └── Docker CI
```

## Backend CI

The backend workflow validates the Python application and runs the automated backend test suite.

Its purpose is to detect backend regressions before changes are merged.

---

## Frontend CI

The frontend workflow installs the required Node dependencies and performs a production build.

This verifies that the React and TypeScript application compiles successfully.

---

## Docker CI

The Docker workflow validates the application's container configuration and build process.

This provides an additional infrastructure-level check alongside the backend and frontend workflows.

---

# Recommended Pre-Commit Checks

Not every change requires every available check.

Run the checks relevant to the code being modified.

## Backend Changes

```bash
cd backend
pytest
python3 -m compileall .
```

## Frontend Changes

```bash
cd frontend
npm run build
```

## Docker Changes

```bash
docker compose config --quiet
docker compose build
```

## Repository-Wide Check

From the project root:

```bash
git diff --check
```

No output from `git diff --check` means no whitespace errors were detected.

---

# Testing Strategy

PartsPilot's testing strategy prioritises important application behaviour rather than adding tests solely to increase a coverage percentage.

The highest-priority areas are:

1. Authentication
2. Inventory CRUD
3. Supplier CRUD
4. Request validation
5. Search and filtering
6. Sorting and pagination
7. Inventory analytics
8. Error handling

Tests should also be added when bugs are fixed if an automated regression test can reasonably protect against the same issue returning.

---

# Maintenance Testing

PartsPilot is now in maintenance, so testing improvements should primarily strengthen the existing application.

Appropriate maintenance work includes:

- Expanding FastAPI endpoint coverage
- Authentication regression tests
- Inventory CRUD tests
- Supplier CRUD tests
- Analytics endpoint tests
- Validation and error-case tests
- Database integration tests
- CI improvements
- Docker runtime validation
- Tests covering previously discovered bugs

Frontend component or interaction testing may also be introduced later where it provides clear value.

These improvements are not requirements for PartsPilot v2.0.0 to remain feature complete.

### Security and dependency checks

Planned maintenance improvements:

- Add GitHub CodeQL analysis for Python and JavaScript/TypeScript.
- Add dependency review checks for pull requests.
- Verify whether backend CI tests use SQLite or PostgreSQL and align the CI database configuration accordingly.

---

# Regression Testing

When fixing a bug, the preferred workflow is:

```text
Reproduce bug
     │
     ▼
Identify cause
     │
     ▼
Apply smallest relevant fix
     │
     ▼
Run existing validation
     │
     ▼
Add regression test where practical
     │
     ▼
Confirm behaviour
```

This helps prevent maintenance work from introducing unrelated changes.

---

# Debugging Failed Checks

When a CI check fails, reproduce the failing command locally before changing unrelated code.

A useful workflow is:

```text
CI failure
    │
    ▼
Identify failing workflow
    │
    ▼
Read exact error
    │
    ▼
Run failing command locally
    │
    ▼
Fix smallest relevant issue
    │
    ▼
Run validation again
    │
    ▼
Push change
```

Common failures may include:

- Missing Python dependencies
- Missing Node modules
- Incorrect imports
- TypeScript compilation errors
- Test collection errors
- Environment configuration issues
- Docker build failures
- Database configuration problems

See [Troubleshooting](./troubleshooting.md) for broader diagnostic guidance.

---

## Related Documentation

- [Documentation Index](./README.md)
- [Project Details](./project-details.md)
- [Architecture](./architecture.md)
- [API Reference](./api-reference.md)
- [Setup Guide](./setup.md)
- [Roadmap & Maintenance](./roadmap.md)
- [Troubleshooting](./troubleshooting.md)