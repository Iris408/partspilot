![Backend CI](https://github.com/Iris408/partspilot/actions/workflows/backend-ci.yml/badge.svg)
![Frontend CI](https://github.com/Iris408/partspilot/actions/workflows/frontend-ci.yml/badge.svg)
![Docker CI](https://github.com/Iris408/partspilot/actions/workflows/docker-ci.yml/badge.svg)

# PartsPilot

### Automotive Inventory Management & Analytics Platform

PartsPilot is a full-stack automotive inventory platform built with React, TypeScript, FastAPI, PostgreSQL, Docker, and Power BI.

It combines authenticated inventory and supplier management with stock monitoring, operational analytics, reporting, and business intelligence.

## Current Status

**v2.0.0 — Feature complete and moving into maintenance**

| Area | Status | Area | Status |
| --- | --- | --- | --- |
| Full-stack application | ✅ Complete | Responsive UI | ✅ Complete |
| JWT authentication | ✅ Working | PostgreSQL | ✅ Connected |
| Inventory management | ✅ Complete | Supplier management | ✅ Complete |
| Dashboard analytics | ✅ Complete | Reports & CSV export | ✅ Complete |
| Power BI dashboard | ✅ Complete | Docker Compose | ✅ Working |
| Backend CI | ✅ Passing | Frontend CI | ✅ Passing |
| Docker CI | ✅ Passing | Frontend deployment | ✅ Live |
| Backend deployment | ⏳ Pending | Maintenance | 🔧 Active |

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

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy, JWT |
| Database | PostgreSQL |
| Analytics | Power BI |
| Infrastructure | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

## Screenshots

| Dashboard | Inventory | Mobile |
| --- | --- | --- |
| ![Dashboard](screenshots/01-dashboard-overview.png) | ![Inventory](screenshots/04-search-filter-sort.png) | ![Mobile](screenshots/05-mobile-dashboard.png) |

### Power BI Analytics

![PartsPilot Power BI Inventory Analytics Dashboard](screenshots/07-powerbi-inventory-analytics.png)

## Live Frontend

[Open PartsPilot](https://partspilot.uk)

> The frontend is deployed on Vercel. Public backend deployment is currently pending.

## Quick Start

```bash
git clone https://github.com/Iris408/partspilot.git
cd partspilot
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
| Frontend | `http://localhost:5174` |
| API | `http://localhost:8001` |
| Swagger | `http://localhost:8001/docs` |

## Documentation

Detailed engineering documentation is available in [`docs/`](./docs/).

| Document | Description |
| --- | --- |
| [Documentation Index](./docs/README.md) | Technical documentation overview |
| [API Reference](./docs/api-reference.md) | Authentication, inventory, supplier, and analytics endpoints |
| [Architecture](./docs/architecture.md) | Full-stack application architecture |
| [Project Details](./docs/project-details.md) | Technical decisions, implementation details, and limitations |
| [Setup](./docs/setup.md) | Local development and environment setup |
| [Testing](./docs/testing.md) | Automated testing and CI |
| [Troubleshooting](./docs/troubleshooting.md) | Common development issues and fixes |
| [Roadmap](./docs/roadmap.md) | Release history and maintenance direction |

## Project Summary

PartsPilot was built as a full-stack automotive engineering project covering API development, relational data persistence, authentication, frontend application development, responsive UI, analytics, business intelligence, Docker, testing, and CI/CD.

v2.0.0 completes the project's primary feature-development cycle. Future work is focused on maintenance, automation, testing, dependency updates, and bug fixes.

## Author

Built by [Iris408](https://github.com/Iris408)

## License

This project is licensed under the [MIT License](./LICENSE).