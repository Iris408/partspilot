# PartsPilot v3 Migration Plan

## Migration Goal

PartsPilot v3 migrates the backend from FastAPI to ASP.NET Core while preserving the existing production demo experience.

The goal is to improve job-fit, backend architecture, CI/CD practice and deployment discipline without breaking the current live v2 demo.

## Current Production Version

- Version: v2.0.0
- Frontend: React / TypeScript
- Backend: FastAPI
- Database: PostgreSQL
- Hosting: Vercel + Railway
- Status: Production demo ready

## v3 Target Stack

- ASP.NET Core Web API
- EF Core
- SQL Server or PostgreSQL
- React / TypeScript frontend
- Docker Compose
- GitHub Actions CI/CD
- Vercel frontend deployment
- Railway or Render backend deployment
- Terraform in later v3.x milestones
- Kubernetes in later v3.x milestones

## Migration Rules

- Keep v2 live while v3 is developed
- Do not remove the FastAPI backend until v3 is stable
- Rebuild one API area at a time
- Match existing frontend behaviour before adding new features
- Document API differences between v2 and v3
- Keep commits small and explainable
- Capture bugs, fixes and learning notes in session recaps

## First Migration Slice

The first v3 slice should prove that the new backend can run independently before any database or frontend integration work begins.

- Create ASP.NET Core backend project
- Add health endpoint
- Run locally
- Confirm response shape
- Commit the backend foundation