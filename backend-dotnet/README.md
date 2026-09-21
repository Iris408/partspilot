# PartsPilot API v3

ASP.NET Core backend foundation for the PartsPilot v3 migration.

PartsPilot v3 migrates the backend from FastAPI to ASP.NET Core while preserving the existing production demo experience from PartsPilot v2.

## Current Status

This backend is in the first foundation slice.

Implemented:

- ASP.NET Core Web API project
- `/health` endpoint
- Local development run confirmed

Not implemented yet:

- Inventory models
- EF Core
- Database connection
- Authentication
- Docker
- Frontend integration
- Deployment

## Tech Stack

- C#
- ASP.NET Core
- .NET 10
- OpenAPI

## Local Development

From this folder:

```bash
dotnet run
```

The app will print the local URL in the terminal.

Example:

```txt
Now listening on: http://localhost:5078
```

Health check:

```txt
http://localhost:5078/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "partspilot-api",
  "version": "3.0.0"
}
```

## Migration Notes

The current live PartsPilot demo remains on the v2 stack while this v3 backend is developed separately.

The first goal is to rebuild the backend in small, explainable slices before connecting it to the existing React/TypeScript frontend.

## Next Steps

- Define the v3 inventory item model
- Compare current FastAPI response fields with frontend requirements
- Add EF Core
- Add database configuration
- Add initial inventory endpoints
- Add Docker support
- Add GitHub Actions CI