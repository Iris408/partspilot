# PartsPilot Roadmap

## Overview

PartsPilot has completed its primary feature-development cycle.

What began as an automotive inventory CRUD application has developed into a full-stack inventory management and analytics platform covering authentication, inventory, suppliers, operational reporting, responsive frontend development, PostgreSQL persistence, Docker, CI, and Power BI.

**PartsPilot v2.0.0 is feature complete and has moved into maintenance.**

---

# v2.0.0 — Feature Complete

**Status: Complete** ✅

v2.0.0 represents the final planned feature release of the current PartsPilot project.

The completed application includes:

- React and TypeScript frontend
- FastAPI REST API
- PostgreSQL persistence
- SQLAlchemy integration
- JWT authentication
- Protected application routes
- Inventory CRUD operations
- Supplier CRUD operations
- Search and filtering
- Sorting and pagination
- Stock status monitoring
- Inventory valuation
- Dashboard analytics
- Category analytics
- Reports interface
- CSV report export
- Power BI analytics dashboard
- Responsive desktop and mobile interfaces
- Swagger/OpenAPI documentation
- Docker Compose development environment
- Backend CI
- Frontend CI
- Docker CI
- Vercel frontend deployment

The FastAPI backend and PostgreSQL database are not currently publicly deployed.

---

# Release Progress

```text
Core inventory application       ✅
Authentication                   ✅
Dashboard analytics              ✅
Reports                          ✅
Supplier management              ✅
Responsive desktop/mobile UI     ✅
Power BI dashboard               ✅
Docker environment               ✅
Backend CI                       ✅
Frontend CI                      ✅
Docker CI                        ✅
Documentation refresh            ✅
Frontend deployment              ✅
Backend deployment               ⏳
                                │
                                ▼
                         Maintenance
```

Backend deployment is an infrastructure task and does not reopen the PartsPilot feature-development cycle.

---

# Maintenance Phase

PartsPilot is now maintained rather than actively expanded.

Normal maintenance work may include:

- Bug fixes
- Dependency updates
- Security updates
- Regression testing
- Automated test improvements
- CI/CD maintenance
- Documentation corrections
- Deployment maintenance
- Small accessibility improvements
- Small UI/UX corrections
- Power BI maintenance
- Development workflow automation
- Add CodeQL security analysis workflow
- Add dependency review workflow for pull requests

These changes should improve the reliability and maintainability of the existing application rather than substantially expand its scope.

---

# Testing

Automated testing can continue to improve during maintenance.

Current validation includes:

- Backend automated tests with `pytest`
- Backend CI
- Frontend production build validation
- Docker build validation
- Docker Compose configuration validation

Future maintenance testing can prioritise existing behaviour such as:

- Authentication
- Inventory CRUD
- Supplier CRUD
- Request validation
- Search and filtering
- Sorting and pagination
- Analytics endpoints
- Error handling

Increasing test coverage does not require another feature-development phase.

See [Testing](./testing.md) for the current testing strategy.

---

# Deployment

The React frontend is currently deployed on Vercel.

Public deployment of the FastAPI backend and PostgreSQL database remains pending.

Completing backend deployment would make the full authenticated application publicly accessible and may be completed as a maintenance/release infrastructure task.

Deployment work should not introduce unrelated application features.

---

# Deliberately Out of Scope

PartsPilot does not need to become a complete enterprise inventory or warehouse-management system.

The following capabilities are deliberately outside the current project scope:

- Purchasing systems
- Order management
- Warehouse management
- Complex supplier-to-item relationships
- Supplier performance systems
- Complex enterprise RBAC
- Large administrative systems
- Microservices
- Kubernetes
- Real-time event processing
- AI features
- Complex cloud architecture

Other potential product expansions such as localisation, multiple currencies, advanced session management, and additional reporting formats are also not planned for the current PartsPilot lifecycle.

They should only be reconsidered if there is a concrete future requirement.

---

# Maintenance Principles

Future PartsPilot work should prioritise:

1. Reliability
2. Maintainability
3. Security
4. Testability
5. Clear documentation
6. Accessibility
7. Stable deployment

New technologies or features should only be introduced when they solve a genuine maintenance, reliability, security, or deployment problem.

---

# Project Lifecycle

```text
Initial CRUD Application
          │
          ▼
Full-Stack Development
          │
          ▼
Authentication & Analytics
          │
          ▼
Reporting & Power BI
          │
          ▼
Supplier Management
          │
          ▼
Responsive Product Polish
          │
          ▼
PartsPilot v2.0.0
          │
          ▼
     Maintenance
```

PartsPilot should now remain a stable flagship portfolio project while development effort moves to other projects.

---

## Related Documentation

- [Documentation Index](./README.md)
- [Project Details](./project-details.md)
- [Architecture](./architecture.md)
- [API Reference](./api-reference.md)
- [Setup Guide](./setup.md)
- [Testing](./testing.md)
- [Troubleshooting](./troubleshooting.md)
- [Power BI Documentation](../powerbi/README.md)