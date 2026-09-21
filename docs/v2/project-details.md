# PartsPilot — Project Details

## Overview

PartsPilot is a production-style automotive inventory management and analytics platform built to demonstrate full-stack application development, backend API design, relational data persistence, authentication, containerisation, CI, and business intelligence.

The platform combines a React and TypeScript application with a FastAPI backend and PostgreSQL database.

Power BI provides an additional reporting and analytics layer over PartsPilot's inventory data.

---

## Core Application

PartsPilot provides an authenticated inventory workflow for managing automotive parts and monitoring stock.

Current functionality includes:

- User authentication
- Inventory CRUD operations
- Product search
- Category filtering
- Inventory sorting
- Pagination
- Stock status tracking
- Inventory value calculations
- Category analytics
- Dashboard summary metrics
- Recent inventory tracking
- PostgreSQL persistence
- Responsive frontend interface
- Swagger/OpenAPI documentation
- Docker Compose support
- GitHub Actions CI
- Live frontend and backend deployment

---

## System Components

PartsPilot is divided into four primary layers:

```text
React + TypeScript
        │
        │ REST API
        ▼
     FastAPI
        │
     SQLAlchemy
        │
        ▼
   PostgreSQL
        │
        ▼
     Power BI
```

Each layer has a separate responsibility within the wider platform.

For a more detailed technical breakdown, please see [Architecture](./architecture.md).

---

## Frontend

The frontend is built with React, TypeScript, Vite, and Tailwind CSS.

It provides the main user-facing inventory workflow and communicates with FastAPI through REST requests.

Current frontend responsibilities include:

- Authentication interface
- Authenticated application layout
- Dashboard navigation
- Inventory table rendering
- Add, edit, and delete workflows
- Search controls
- Category filtering
- Sorting controls
- Pagination
- Stock status presentation
- Dashboard metrics
- Category summaries
- Recent inventory information
- Responsive layouts

The application uses routed pages for:

- Dashboard
- Inventory
- Reports
- Suppliers
- Settings

Some routed areas remain intentionally limited while their underlying functionality is developed.

---

## Backend

The backend is built with Python and FastAPI.

SQLAlchemy provides the application persistence layer between FastAPI and PostgreSQL.

Backend responsibilities include:

- Authentication
- JWT-protected API access
- Request validation
- Inventory CRUD operations
- Database queries
- Search
- Filtering
- Sorting
- Pagination
- Stock calculations
- Inventory analytics
- Category analytics
- API response handling

FastAPI also provides interactive Swagger/OpenAPI documentation for testing and exploring the API.

Detailed endpoint information is available in the [API Reference](./api-reference.md).

---

## Database

PostgreSQL provides persistent storage for PartsPilot.

The current data model includes inventory and user data.

Inventory records contain information such as:

- Item ID
- Name
- Category
- Quantity
- Price
- Creation timestamp
- Update timestamp

Stock status and inventory analytics can then be derived from this underlying inventory data.

The current demonstration dataset contains automotive inventory across multiple product categories and is being expanded as the reporting layer develops.

Database schema changes are managed using Alembic.

---

## Authentication

PartsPilot provides authenticated access to the application and protected backend routes.

The current authentication flow uses JWT-based authentication.

The frontend stores the authentication token locally and includes it with protected API requests.

A dedicated demonstration account is available through the deployed application so recruiters and other users can explore the platform without creating an account.

More advanced authentication behaviour, including expanded role-based access control and session handling, remains as future work.

---

## Application Analytics

PartsPilot provides operational analytics through the main application dashboard.

Current analytics include:

- Total product count
- Total stock quantity
- Inventory value
- Stock status summaries
- Category-level summaries
- Category inventory value
- Highest-value inventory
- Low-stock information
- Recent inventory activity

These application-level analytics are separate from the Power BI reporting layer.

---

## Power BI Analytics

Power BI is being developed as PartsPilot's dedicated business intelligence and reporting layer.

Rather than replacing the React dashboard, Power BI provides deeper analysis of the underlying inventory data.

The dashboard is being designed around areas such as:

- Inventory value
- Stock distribution
- Category performance
- Low-stock analysis
- Inventory status
- Operational reporting

Power BI-specific implementation notes are maintained in [`powerbi/`](../powerbi/).

---

## Docker

PartsPilot supports containerised local development using Docker Compose.

The environment currently includes:

```text
Frontend
    │
    ▼
FastAPI API
    │
    ▼
PostgreSQL
```

Docker Compose provides service networking and orchestration for the application.

Within the Docker network, application services communicate using their Compose service names rather than host-machine addresses.

For example, the FastAPI container connects to PostgreSQL through the database service and PostgreSQL's internal container port.

More detailed setup instructions are available in the [Setup Guide](./setup.md).

---

## Continuous Integration

PartsPilot uses GitHub Actions for automated project validation.

Current workflows cover:

- Backend dependency installation
- Backend automated tests
- Frontend dependency installation
- Frontend production build
- Docker build validation

These checks help detect regressions before any changes are merged.

Testing details are documented separately in [Testing](./testing.md).

---

## Deployment

The application currently uses separate frontend and backend deployments.

```text
Vercel
  │
  │ React frontend
  ▼
Render
  │
  │ FastAPI
  ▼
PostgreSQL
```

The deployed application provides a portfolio demonstration environment.

At this time the production URLs currently retain the project's original Inventory Management System hostname even though the application has since been rebranded as PartsPilot.

---

## Current Limitations

PartsPilot is portfolio-ready, but development is still continuing.

Current limitations include:

- Power BI reporting is still being developed.
- Reports functionality is not yet complete.
- Supplier management is not yet complete.
- Settings functionality remains limited.
- Automated test coverage can be expanded.
- Authentication can be strengthened further.
- Role-based access control can be expanded.
- Production observability can be improved.
- Free-tier deployment services may sleep after inactivity.

These limitations are tracked as future engineering work rather than being blockers for the current portfolio demonstration.

Please see the [Roadmap](./roadmap.md) for planned development.

---

## Engineering Focus

PartsPilot has evolved beyond its original CRUD inventory implementation.

The project now demonstrates work across:

- Backend API architecture
- Relational databases
- Authentication
- Data validation
- CRUD workflows
- Search and filtering
- Pagination
- Analytics
- React application development
- TypeScript
- Responsive interfaces
- Docker
- Docker Compose
- CI
- Automated backend testing
- Deployment
- Business intelligence

The long-term goal is to keep PartsPilot as a realistic inventory workflow rather than adding features solely to increase project scope.

---

## Learning Outcomes

While developing PartsPilot I have learned and gained practical experience with:

- Designing REST APIs with FastAPI
- Structuring a Python backend
- Building SQLAlchemy models and queries
- Working with PostgreSQL
- Implementing JWT authentication
- Building authenticated React interfaces
- Managing application state and API requests
- Building reusable TypeScript components
- Implementing inventory analytics
- Writing automated backend tests
- Debugging Docker networking
- Configuring multi-container applications
- Building GitHub Actions workflows
- Deploying a full-stack application
- Connecting operational data to Power BI
- Maintaining and refactoring an evolving codebase

---

## Related Documentation

- [Architecture](./architecture.md)
- [API Reference](./api-reference.md)
- [Setup Guide](./setup.md)
- [Testing](./testing.md)
- [Roadmap](./roadmap.md)
- [Troubleshooting](./troubleshooting.md)
- [Power BI Documentation](../powerbi/README.md)