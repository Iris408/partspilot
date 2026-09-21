# PartsPilot v3 Roadmap

## Purpose

PartsPilot v3.0.0 rebuilds the backend foundation of the existing production demo into a more job-aligned engineering project using ASP.NET Core, EF Core, SQL, Docker, CI/CD and later infrastructure tooling.

The goal is not to replace the original project immediately. The goal is to evolve PartsPilot into a stronger full-stack portfolio system with clearer backend architecture, deployment discipline and production-style workflows.

## Current Version

PartsPilot v2 is a live production demo built with:

- React / TypeScript
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT authentication
- Docker
- GitHub Actions
- Vercel
- Railway

Live production demo: https://www.partspilot.uk

## v3 Direction

PartsPilot v2 will introduce:

- ASP.NET Core Web API backend
- EF Core data access
- SQL Server or PostgreSQL database setup
- Docker Compose development environment
- GitHub Actions CI
- Deployment workflow documentation
- Later CI/CD automation
- Later Terraform infrastructure notes
- Later Kubernetes deployment manifests

## Version Plan

### v2.1.0 — .NET Backend Foundation

- Create ASP.NET Core Web API project
- Add health check endpoint
- Add inventory item model
- Add EF Core database context
- Add initial migration
- Add seed data
- Add basic inventory endpoints
- Add Docker Compose setup
- Add GitHub Actions build/test workflow
- Document local setup

### v2.2.0 — Frontend Integration

- Connect existing React/TypeScript frontend to .NET API
- Update environment variables
- Confirm dashboard data loads from new backend
- Confirm search/filter/sort behaviour
- Confirm create/update/delete flows
- Document API differences from v1

### v2.3.0 — Deployment Pipeline

- Deploy .NET backend
- Configure production database
- Add environment variable documentation
- Add CI/CD deployment notes
- Add rollback notes
- Confirm live demo stability

### v2.4.0 — Infrastructure Foundations

- Add Terraform notes or starter configuration
- Document cloud resources
- Define staging/production environment approach
- Add infrastructure decision record

### v2.5.0 — Kubernetes Practice

- Add local Kubernetes manifests
- Add Deployment, Service, ConfigMap and Secret examples
- Run locally with kind or minikube
- Document Kubernetes learning notes

## Definition of Done

A PartsPilot v2.5 milestone is complete when:

- The app runs locally
- The README is updated
- Required environment variables are documented
- Tests/build checks pass
- Docker setup works where applicable
- The change is committed with a clear message
- Any bugs or debugging steps are captured in the session recap

## Learning Goals

- Improve C# and ASP.NET Core confidence
- Understand EF Core migrations and database modelling
- Build repeatable CI/CD workflows
- Strengthen Docker and deployment fluency
- Add Terraform and Kubernetes as normal engineering practice
- Improve coding independence through small, explainable changes