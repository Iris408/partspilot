# PartsPilot Setup Guide

## Overview

This guide explains how to run PartsPilot locally for development.

PartsPilot consists of:

- React and TypeScript frontend
- FastAPI backend
- PostgreSQL database
- Docker / Docker Compose

The primary development workflow uses:

```text
PostgreSQL → Docker
FastAPI    → Local
React/Vite → Local
```

The application can also be run using Docker Compose.

---

# Prerequisites

Install:

- Git
- Python 3
- pip
- Node.js
- npm
- Docker
- Docker Compose

A separate local PostgreSQL installation is not required when using the Docker database.

---

# Clone the Repository

```bash
git clone https://github.com/Iris408/partspilot.git
cd partspilot
```

---

# Environment Configuration

PartsPilot uses environment variables for database connections, authentication, and frontend API configuration.

Real `.env` files, passwords, database credentials, API keys, and production secrets must not be committed to Git.

---

## Frontend Environment

Create:

```text
frontend/.env
```

For the current local development environment:

```env
VITE_API_URL=http://localhost:8001
```

Vite uses this value when sending requests to the FastAPI backend.

---

## Backend Environment

Create:

```text
backend/.env
```

The backend requires configuration for areas such as:

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
```

Use environment-specific values rather than committing credentials to the repository.

When FastAPI runs locally and PostgreSQL runs through the PartsPilot Docker configuration, the database is accessible through:

```text
localhost:5436
```

A connection therefore follows the structure:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5436/DATABASE
```

Use the database credentials configured for your local environment.

---

# Recommended Development Workflow

The current PartsPilot development environment uses three services:

```text
Docker
└── PostgreSQL
    localhost:5436

Terminal 1
└── FastAPI
    localhost:8001

Terminal 2
└── React / Vite
    localhost:5174
```

---

## 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d db
```

Check that PostgreSQL is running:

```bash
docker compose ps
```

The database container exposes PostgreSQL as:

```text
Host:      localhost:5436
Container: 5432
```

---

## 2. Start FastAPI

Move into the backend directory:

```bash
cd backend
```

Create a virtual environment if required:

```bash
python3 -m venv .venv
```

Activate it on macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
python3 -m pip install --upgrade pip
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload --port 8001
```

If required:

```bash
python3 -m uvicorn main:app --reload --port 8001
```

The backend is available at:

| Service | URL |
| --- | --- |
| API | `http://localhost:8001` |
| Swagger | `http://localhost:8001/docs` |
| OpenAPI | `http://localhost:8001/openapi.json` |

---

## 3. Start the Frontend

Open a second terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend is available at:

```text
http://localhost:5173
```

The FastAPI backend and PostgreSQL database must also be running for API-dependent application functionality.

---

# Local Services

The completed development environment should look like:

| Service | Location |
| --- | --- |
| Frontend | `http://localhost:5173` |
| FastAPI | `http://localhost:8001` |
| Swagger | `http://localhost:8001/docs` |
| PostgreSQL | `localhost:5436` |

---

# PostgreSQL

PartsPilot uses PostgreSQL for persistent application data.

The current database contains tables for:

```text
users
items
suppliers
```

The database can be accessed directly through the running Docker container.

Example:

```bash
docker compose exec db psql -U inventory_user -d partspilot_db
```

Useful PostgreSQL command:

```text
\dt
```

This lists the tables in the current database.

Exit PostgreSQL with:

```text
\q
```

---

# Docker Networking

Database configuration differs depending on whether FastAPI runs on the host or inside Docker.

This distinction is important.

## FastAPI Running Locally

When FastAPI runs directly on the host:

```text
FastAPI
localhost:8001
      │
      ▼
PostgreSQL
localhost:5436
```

The database connection uses the host-accessible PostgreSQL port:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5436/DATABASE
```

---

## FastAPI Running in Docker

Inside Docker, `localhost` refers to the current container.

It does **not** refer to the PostgreSQL container.

Containers should communicate using their Docker Compose service names:

```text
FastAPI container
       │
       ▼
    db:5432
       │
       ▼
PostgreSQL container
```

The corresponding connection follows the structure:

```env
DATABASE_URL=postgresql://USER:PASSWORD@db:5432/DATABASE
```

PostgreSQL's internal container port remains:

```text
5432
```

The host mapping to `5436` is used when software running outside Docker needs to connect to the database.

---

# Docker Compose

PartsPilot also supports Docker Compose for containerised development.

Build and start the configured services:

```bash
docker compose up --build
```

Run them in the background:

```bash
docker compose up --build -d
```

Check service state:

```bash
docker compose ps
```

Validate the Compose configuration:

```bash
docker compose config --quiet
```

The exact exposed ports depend on the current `docker-compose.yml`.

For the authoritative container configuration, refer directly to:

```text
docker-compose.yml
```

---

# Restarting PartsPilot

Stop the Docker environment:

```bash
docker compose down
```

Restart:

```bash
docker compose up -d db
```

For a complete rebuild:

```bash
docker compose down
docker compose up --build --force-recreate
```

---

# Resetting PostgreSQL Data

Docker volumes preserve PostgreSQL data between normal container restarts.

To remove containers and Compose-managed volumes:

```bash
docker compose down --volumes
```

Then rebuild or restart the required services.

> **Warning:** Removing the PostgreSQL volume deletes locally persisted database data. Back up anything that needs to be retained before removing the volume.

---

# Development Checks

Before committing changes, run the checks relevant to the area being modified.

## Backend Tests

```bash
cd backend
pytest
```

## Python Validation

```bash
cd backend
python3 -m compileall .
```

## Frontend Production Build

```bash
cd frontend
npm run build
```

## Docker Compose Validation

From the project root:

```bash
docker compose config --quiet
```

## Git Whitespace Check

```bash
git diff --check
```

No output from `git diff --check` indicates that the check passed.

For the complete testing and CI workflow, see [Testing](./testing.md).

---

# Stopping PartsPilot

Stop Docker services while preserving the PostgreSQL volume:

```bash
docker compose down
```

To also remove persistent Compose volumes:

```bash
docker compose down -v
```

Use volume removal carefully when working with local data.

---

# Deployment Configuration

The React frontend is currently hosted on Vercel.

The FastAPI backend and PostgreSQL database are not currently publicly deployed.

The frontend API URL is controlled through:

```env
VITE_API_URL=
```

For local development:

```env
VITE_API_URL=http://localhost:8001
```

When a public backend is deployed, the production Vercel environment should instead use the public HTTPS API URL.

Do not hard-code environment-specific API addresses into frontend application code.

---

# Troubleshooting

Common setup problems include:

- PostgreSQL container is not running
- Incorrect PostgreSQL host or port
- Using `localhost` from inside a Docker container
- Missing environment variables
- Existing Docker volumes containing older database state
- Port conflicts with other development projects
- Frontend API URL pointing to the wrong backend port
- FastAPI running on a different port than `VITE_API_URL`
- PostgreSQL schema or tables not matching the current application

See [Troubleshooting](./troubleshooting.md) for detailed diagnostic steps.

---

## Related Documentation

- [Documentation Index](./README.md)
- [Project Details](./project-details.md)
- [Architecture](./architecture.md)
- [API Reference](./api-reference.md)
- [Testing](./testing.md)
- [Roadmap & Maintenance](./roadmap.md)
- [Troubleshooting](./troubleshooting.md)