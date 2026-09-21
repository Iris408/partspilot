# PartsPilot Architecture

## Overview

PartsPilot is a full-stack automotive inventory management and analytics platform built around a layered architecture.

The system separates the user interface, API, application logic, persistence, database, and business intelligence responsibilities.

The primary application stack consists of:

- React
- TypeScript
- FastAPI
- SQLAlchemy
- PostgreSQL
- Docker
- Power BI

---

## High-Level Architecture

```text
┌─────────────────────────────┐
│      React + TypeScript     │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ HTTP / REST
               │ JWT Authentication
               ▼
┌─────────────────────────────┐
│           FastAPI           │
│            API              │
└──────────────┬──────────────┘
               │
               │ Application Logic
               │ SQLAlchemy
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│           Database          │
└──────────────┬──────────────┘
               │
               │ Reporting Data
               ▼
┌─────────────────────────────┐
│          Power BI           │
│      Analytics Layer        │
└─────────────────────────────┘
```

The React frontend handles user interaction while FastAPI provides the application API.

SQLAlchemy manages persistence between the backend and PostgreSQL.

Power BI provides a separate business intelligence layer for deeper inventory analysis and reporting.

---

# Frontend Architecture

The frontend is built with React, TypeScript, Vite, and Tailwind CSS.

Its primary responsibility is presentation and user interaction.

```text
User
 │
 ▼
React Application
 │
 ├── Authentication
 ├── Dashboard
 ├── Inventory
 ├── Reports
 ├── Suppliers
 └── Settings
 │
 ▼
API Requests
 │
 ▼
FastAPI
```

## Responsibilities

The frontend handles:

- Login state
- Authentication token storage
- Application navigation
- Dashboard presentation
- Inventory table rendering
- Inventory forms
- Search controls
- Category filtering
- Sorting
- Pagination
- Stock status presentation
- Responsive layouts
- API request handling

The frontend does not communicate directly with PostgreSQL.

All application data access goes through the FastAPI API.

---

# Backend Architecture

The backend is built with Python and FastAPI.

FastAPI acts as the central application layer between the frontend and PostgreSQL.

```text
HTTP Request
     │
     ▼
FastAPI Route
     │
     ├── Authentication
     ├── Validation
     └── Request Handling
     │
     ▼
Application / Query Logic
     │
     ▼
SQLAlchemy
     │
     ▼
PostgreSQL
```

## Responsibilities

The backend handles:

- User authentication
- JWT validation
- Inventory CRUD operations
- Request validation
- Search
- Filtering
- Sorting
- Pagination
- Inventory calculations
- Category analytics
- Dashboard analytics
- Database interaction
- API responses

Keeping these responsibilities on the backend prevents important inventory logic from depending entirely on the frontend.

---

# Persistence Layer

SQLAlchemy provides the persistence layer between FastAPI and PostgreSQL.

```text
FastAPI
   │
   ▼
SQLAlchemy
   │
   ▼
PostgreSQL
```

SQLAlchemy is responsible for translating application-level database operations into queries against PostgreSQL.

This allows the backend to work with Python models while PostgreSQL remains responsible for persistent relational storage.

---

# Database Architecture

PostgreSQL is the primary application database.

The current database contains data for:

- Inventory items
- Application users

Inventory records include fields such as:

```text
id
name
category
quantity
price
created_at
updated_at
```

User records support the authentication system.

Additional operational information, such as stock status and inventory value, can be derived from the underlying inventory data.

Database schema changes are managed using Alembic.

---

# Authentication Flow

PartsPilot uses JWT-based authentication.

A simplified authentication flow is:

```text
User
 │
 │ Credentials
 ▼
Login Interface
 │
 │ POST /auth/login
 ▼
FastAPI
 │
 │ Validate User
 ▼
Authentication Logic
 │
 │
 ▼
JWT Access Token
 │
 ▼
React Application
 │
 │ Store Token
 │
 │ Authorization: Bearer <token>
 ▼
Protected API Endpoint
```

The frontend stores the access token locally and includes it with requests to protected backend endpoints.

The backend remains responsible for validating authentication before protected operations are performed.

---

# Inventory Request Flow

A typical inventory request follows this path:

```text
User Action
    │
    ▼
React Component
    │
    │ HTTP Request
    ▼
FastAPI Endpoint
    │
    ├── Authentication
    ├── Validation
    └── Query Logic
    │
    ▼
SQLAlchemy
    │
    ▼
PostgreSQL
    │
    ▼
SQLAlchemy Result
    │
    ▼
FastAPI Response
    │
    ▼
React UI Update
```

For example, when a user updates an inventory item:

1. The user submits the edit form.
2. React sends an authenticated request to FastAPI.
3. FastAPI validates the request.
4. SQLAlchemy updates the relevant PostgreSQL record.
5. FastAPI returns the result.
6. React updates the displayed inventory state.

---

# Analytics Architecture

PartsPilot contains two different analytics layers.

## Application Analytics

FastAPI provides operational analytics used directly by the React dashboard.

Examples include:

- Inventory totals
- Inventory value
- Stock status
- Low-stock items
- Category summaries
- Category value
- Highest-value items
- Recent inventory

The flow is:

```text
PostgreSQL
     │
     ▼
FastAPI Analytics
     │
     ▼
REST API
     │
     ▼
React Dashboard
```

These analytics are designed for application-level operational information.

---

## Power BI Analytics

Power BI provides a separate business intelligence layer.

```text
PartsPilot Data
      │
      ▼
   Power BI
      │
      ├── Inventory Analysis
      ├── Category Analysis
      ├── Stock Analysis
      └── Operational Reporting
```

The Power BI dashboard is intended for deeper analysis and reporting rather than transactional inventory management.

This keeps the responsibilities separate:

```text
React Dashboard
    ↓
Operational application interface

Power BI
    ↓
Business intelligence and reporting
```

Power BI-specific documentation is maintained in [`powerbi/`](../powerbi/).

---

# Docker Architecture

PartsPilot can run as a multi-container application using Docker Compose.

```text
Host Machine
│
├── localhost:5174
│        │
│        ▼
│   ┌──────────────┐
│   │   Frontend   │
│   │    :5173     │
│   └──────┬───────┘
│          │
│          ▼
│   ┌──────────────┐
│   │   FastAPI    │
│   │     API      │
│   └──────┬───────┘
│          │
│          │ db:5432
│          ▼
│   ┌──────────────┐
│   │  PostgreSQL  │
│   │    :5432     │
│   └──────────────┘
│
└── localhost:8001 → FastAPI
```

Docker Compose provides networking between the application services.

Within the Compose network, containers communicate using service names.

For example:

```text
db:5432
```

is used by the FastAPI container to communicate with PostgreSQL.

`localhost` cannot be used for this connection because, inside the API container, `localhost` refers to the API container itself.

See the [Setup Guide](./setup.md) for configuration details.

---

# Local Development Architecture

When services run directly on the host machine, the network topology changes.

```text
React
 localhost:5174
       │
       ▼
FastAPI
 localhost:8000
       │
       ▼
PostgreSQL
 localhost:<configured-port>
```

Unlike the Docker environment, local processes can communicate through host-accessible ports.

This means the database connection configuration differs between local and containerised development.

---

# Deployment Architecture

The portfolio deployment separates the frontend and backend.

```text
User
 │
 ▼
Vercel
 │
 │ React Application
 ▼
Render
 │
 │ FastAPI API
 ▼
PostgreSQL
```

The deployed frontend communicates with the deployed FastAPI API rather than a local development address.

Environment variables are used to configure the correct backend URL for each environment.

---

# Continuous Integration

PartsPilot uses GitHub Actions to validate multiple areas of the application.

```text
Git Push / Pull Request
          │
          ▼
     GitHub Actions
          │
          ├── Backend CI
          │      └── Automated tests
          │
          ├── Frontend CI
          │      └── Production build
          │
          └── Docker CI
                 └── Build validation
```

Separating these workflows makes failures easier to identify by application layer.

---

# Architectural Principles

PartsPilot development follows several core principles.

### Separation of Responsibilities

Frontend, backend, database, analytics, and infrastructure responsibilities remain separated where practical.

### Backend-Owned Application Logic

Important inventory operations and analytics should not depend solely on calculations performed by the frontend.

### Persistent Data

PostgreSQL acts as the source of persistent application data.

### Containerised Development

Docker Compose provides a reproducible development environment for the main application services.

### Incremental Development

PartsPilot has evolved gradually from a basic inventory CRUD application into a broader inventory and analytics platform.

New functionality should solve a clear operational or engineering problem rather than being added solely to increase project size.

---

# Future Architecture

PartsPilot is approaching a maintenance-focused stage, but the architecture leaves room for future capabilities such as:

- Supplier management
- Expanded reporting
- Role-based access control
- Improved authentication/session handling
- Additional automated testing
- Production observability
- AWS infrastructure

Major architectural changes should only be introduced when required by a concrete feature or operational need.

---

## Related Documentation

- [Project Details](./project-details.md)
- [API Reference](./api-reference.md)
- [Setup Guide](./setup.md)
- [Testing](./testing.md)
- [Roadmap](./roadmap.md)
- [Troubleshooting](./troubleshooting.md)
- [Power BI Documentation](../powerbi/README.md)