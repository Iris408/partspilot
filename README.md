![Backend CI](https://github.com/Iris408/partspilot/actions/workflows/backend-ci.yml/badge.svg)
![Frontend CI](https://github.com/Iris408/partspilot/actions/workflows/frontend-ci.yml/badge.svg)
![Docker CI](https://github.com/Iris408/partspilot/actions/workflows/docker-ci.yml/badge.svg)

# PartsPilot

### Automotive Inventory Management & Analytics Platform

PartsPilot is a full-stack automotive inventory platform built with React, TypeScript, FastAPI, PostgreSQL, Docker, and Power BI.

It combines authenticated inventory and supplier management with stock monitoring, operational analytics, reporting, business intelligence, and a deployed public demo.

## Current Status

**v2.0.0 — Feature complete, fully deployed, and moving into maintenance**

| Area | Status | Area | Status |
| --- | --- | --- | --- |
| Full-stack application | ✅ Complete | Responsive UI | ✅ Complete |
| JWT authentication | ✅ Working | PostgreSQL | ✅ Production |
| Inventory management | ✅ Complete | Supplier management | ✅ Complete |
| Dashboard analytics | ✅ Complete | Reports & CSV export | ✅ Complete |
| Power BI dashboard | ✅ Complete | Docker Compose | ✅ Working |
| Backend CI | ✅ Passing | Frontend CI | ✅ Passing |
| Docker CI | ✅ Passing | Frontend deployment | ✅ Live |
| Backend deployment | ✅ Live | Public demo | ✅ Read-only |
| Production database | ✅ Live | Maintenance | 🔧 Active |

## Features

- JWT-authenticated application access
- Automotive inventory CRUD
- Supplier management
- Search, filtering, sorting, and pagination
- Low-stock and out-of-stock monitoring
- Operational dashboard and category insights
- Inventory valuation and reporting
- CSV report export
- Power BI inventory analytics
- Responsive desktop and mobile interfaces
- Public authenticated read-only demo
- Role-based write protection for shared demo data

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy, JWT |
| Database | PostgreSQL |
| Analytics | Power BI |
| Infrastructure | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Vercel, Railway |

## Production Architecture

```text
partspilot.uk
      ↓
Vercel
React + TypeScript frontend
      ↓
Railway
FastAPI backend
      ↓
Railway PostgreSQL
Persistent production data
```

The public demo uses JWT authentication with a dedicated `demo` role.

Demo users can explore inventory, suppliers, reports, analytics, search, filtering, sorting, and pagination while write operations remain protected at the API layer.

```text
GET requests
→ 200 OK

POST / PUT / DELETE
→ 403 Forbidden for demo users
```

This keeps the shared production dataset safe while still allowing visitors to explore the application and its workflows.

## Screenshots

| Dashboard | Inventory | Mobile |
| --- | --- | --- |
| ![Dashboard](screenshots/01-dashboard-overview.png) | ![Inventory](screenshots/04-search-filter-sort.png) | ![Mobile](screenshots/05-mobile-dashboard.png) |

### Power BI Analytics

![PartsPilot Power BI Inventory Analytics Dashboard](screenshots/07-powerbi-inventory-analytics.png)

## Live Demo

[Open PartsPilot](https://partspilot.uk)

The public application is deployed end to end:

- React and TypeScript frontend hosted on Vercel
- FastAPI backend hosted on Railway
- PostgreSQL production database hosted on Railway
- JWT-authenticated demo access
- Shared demo inventory and supplier data
- Read-only protection for public users

The public demo includes seeded inventory and supplier data so visitors can explore the application without modifying the shared production dataset.

## Quick Start

Clone the repository:

```bash
git clone https://github.com/Iris408/partspilot.git
cd partspilot
```

Start PostgreSQL:

```bash
docker compose up -d db
```

Start the API:

```bash
cd backend
uvicorn main:app --reload --port 8001
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| API | `http://localhost:8001` |
| Swagger | `http://localhost:8001/docs` |

## Documentation

Detailed engineering documentation is available in [`docs/`](./docs/).

| Document | Description |
| --- | --- |
| [Documentation Index](./docs/README.md) | Technical documentation overview |
| [API Reference](./docs/api-reference.md) | Authentication, inventory, supplier, and analytics endpoints |
| [Architecture](./docs/architecture.md) | Full-stack application and deployment architecture |
| [Project Details](./docs/project-details.md) | Technical decisions, implementation details, and limitations |
| [Setup](./docs/setup.md) | Local development and environment setup |
| [Testing](./docs/testing.md) | Automated testing and CI |
| [Troubleshooting](./docs/troubleshooting.md) | Common development and deployment issues |
| [Roadmap](./docs/roadmap.md) | Release history and maintenance direction |

## Engineering Highlights

PartsPilot covers the full lifecycle of a production-style web application:

- REST API development with FastAPI
- Relational data modelling with PostgreSQL and SQLAlchemy
- JWT authentication
- Role-based authorization
- React and TypeScript application development
- Responsive UI design
- Inventory and supplier workflows
- Operational analytics and reporting
- Power BI integration
- Docker-based local development
- GitHub Actions CI
- Vercel frontend deployment
- Railway backend deployment
- Railway PostgreSQL production persistence
- Environment-specific configuration
- Production data migration
- Public demo security

## Deployment & Demo Security

PartsPilot's public demo uses the same deployed backend and PostgreSQL database as the production application.

To protect shared demo data, the public account is assigned a dedicated `demo` role.

Read operations remain available:

```text
GET /items
GET /items/*
GET /suppliers
GET /suppliers/*
```

Write operations are protected by backend authorization:

```text
POST
PUT
DELETE
→ 403 Forbidden for demo users
```

The frontend also reflects this state by keeping Add, Edit, and Delete controls visible but disabled.

This allows visitors to see that CRUD functionality exists while ensuring the shared public dataset cannot be modified.

## Data

The deployed demo currently includes:

- 49 automotive inventory items
- 7 suppliers
- Stock quantities and minimum thresholds
- Product pricing
- Category data
- Supplier contact and sourcing information

The production dataset is stored in PostgreSQL on Railway.

## Testing & CI

PartsPilot uses automated GitHub Actions workflows for:

- Backend CI
- Frontend CI
- Docker CI

The application has also been tested across:

- Authentication flows
- Protected API routes
- Inventory operations
- Supplier operations
- Production API connectivity
- Public read-only authorization
- Responsive layouts
- Local and production environments

## Project Summary

PartsPilot was built as a full-stack automotive engineering project covering API development, relational data persistence, authentication and authorization, frontend application development, responsive UI, analytics, business intelligence, containerisation, testing, CI/CD, and production deployment.

v2.0.0 completes the project's primary feature-development and deployment cycle.

The application now runs as a fully deployed full-stack demo, with the React frontend hosted on Vercel, the FastAPI backend hosted on Railway, and PostgreSQL providing persistent production data.

The project now moves into maintenance, with future work focused on reliability, automated testing, monitoring, dependency updates, documentation, and infrastructure improvements rather than continued feature expansion.

## Future Improvements

Potential maintenance and infrastructure work includes:

- Expanded backend test coverage
- Expanded frontend component testing
- End-to-end browser testing
- Production monitoring and observability
- Automated database backup validation
- Dependency and security updates
- Improved deployment checks
- Additional CI/CD automation
- Isolated interactive demo sessions
- Demo data reset functionality

## Author

Built by [Iris408](https://github.com/Iris408)

## License

This project is licensed under the [MIT License](./LICENSE).