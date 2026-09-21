# PartsPilot API Reference

## Overview

PartsPilot provides a REST API built with FastAPI for authentication, automotive inventory management, supplier management, and operational analytics.

The API is consumed by the React frontend and can also be explored interactively through FastAPI's generated Swagger/OpenAPI documentation.

---

## Base URL

### Local Development

```text
http://localhost:8001
```

### Swagger Documentation

```text
http://localhost:8001/docs
```

The PartsPilot API is not currently publicly deployed.

---

## Authentication

PartsPilot uses JWT-based authentication for protected API operations.

### Login

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/login` | Authenticate a user and receive an access token |

The login endpoint accepts user credentials and returns a JWT access token after successful authentication.

The React frontend stores the token and includes it with subsequent protected requests.

```text
Authorization: Bearer <access_token>
```

Protected inventory and supplier operations require a valid token.

---

# Inventory

## Inventory CRUD

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/items` | Retrieve inventory items |
| POST | `/items` | Create an inventory item |
| GET | `/items/{id}` | Retrieve an individual inventory item |
| PUT | `/items/{id}` | Update an inventory item |
| DELETE | `/items/{id}` | Delete an inventory item |

These endpoints provide the main inventory management workflow used by the PartsPilot frontend.

---

## Inventory Data

Inventory records represent automotive parts and include information such as:

```text
id
name
sku
category
quantity
minimum_stock
price
created_at
updated_at
```

The application uses this data to determine operational information such as stock status and inventory value.

---

# Search, Filtering, Sorting and Pagination

`GET /items` supports querying the inventory dataset using search, filtering, sorting, and pagination.

Current capabilities include:

- Search by part name
- Filter by category
- Sort inventory results
- Paginate inventory results

Sorting can be used with inventory fields such as price and quantity.

The exact query parameters and currently supported values can be inspected through Swagger:

```text
http://localhost:8001/docs
```

The generated OpenAPI documentation should be treated as the authoritative reference for request parameters and schemas.

---

# Inventory Analytics

PartsPilot provides dedicated inventory analytics endpoints used by the Dashboard and Reports interfaces.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/items/low-stock` | Retrieve low-stock inventory |
| GET | `/items/summary/value` | Retrieve inventory value summary |
| GET | `/items/stats` | Retrieve overall inventory statistics |
| GET | `/items/category-summary` | Retrieve inventory summaries grouped by category |
| GET | `/items/category-value` | Retrieve inventory value grouped by category |
| GET | `/items/highest-value` | Retrieve highest-value inventory items |
| GET | `/items/recent` | Retrieve recently added inventory items |

These endpoints allow the backend to provide operational and analytical information without requiring the frontend to calculate all metrics independently.

PartsPilot uses this data for features including:

- Inventory totals
- Stock status
- Inventory valuation
- Category analysis
- Recent inventory activity
- Reporting

---

# Suppliers

PartsPilot v2.0.0 includes supplier management through a dedicated set of protected API endpoints.

## Supplier CRUD

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/suppliers` | Retrieve suppliers |
| GET | `/suppliers/{supplier_id}` | Retrieve an individual supplier |
| POST | `/suppliers` | Create a supplier |
| PUT | `/suppliers/{supplier_id}` | Update a supplier |
| DELETE | `/suppliers/{supplier_id}` | Delete a supplier |

---

## Supplier Data

Supplier records contain information including:

```text
id
name
contact_name
email
phone
website
category
status
notes
created_at
updated_at
```

Supplier status values are used by the frontend to distinguish suppliers such as active, preferred, and inactive suppliers.

The frontend provides additional supplier workflows including:

- Search
- Status filtering
- Category filtering
- Add supplier
- Edit supplier
- Delete confirmation

Search and filtering are currently handled by the frontend after supplier data is retrieved from the API.

---

# Utility Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Backend root/status endpoint |
| GET | `/docs` | Interactive Swagger/OpenAPI documentation |
| GET | `/openapi.json` | Generated OpenAPI schema |

---

# Swagger / OpenAPI

FastAPI automatically generates interactive API documentation from the application routes and Pydantic schemas.

### Local Swagger

```text
http://localhost:8001/docs
```

Swagger can be used to:

- Inspect available endpoints
- Review request parameters
- Review request and response schemas
- Test API requests
- Inspect validation requirements
- Authenticate against protected endpoints

Because Swagger is generated directly from the FastAPI application, it should be treated as the most current reference for exact request and response schemas.

---

# Request Validation

FastAPI and Pydantic validate incoming API requests before data is persisted.

Validation covers areas such as:

- Required fields
- Expected data types
- Inventory request structure
- Supplier request structure

Invalid request data is rejected with an appropriate HTTP response rather than being written directly to PostgreSQL.

Exact validation requirements can be inspected through the generated OpenAPI documentation.

---

# Common HTTP Responses

PartsPilot uses standard HTTP response codes.

| Status | Meaning |
| --- | --- |
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `401 Unauthorized` | Authentication is missing or invalid |
| `404 Not Found` | Requested resource could not be found |
| `422 Unprocessable Entity` | Request failed FastAPI/Pydantic validation |
| `500 Internal Server Error` | Unexpected server-side failure |

Exact responses vary by endpoint and operation.

---

# API Data Flow

A typical authenticated request follows this path:

```text
React Frontend
      │
      │ HTTP Request
      │ Authorization: Bearer <token>
      ▼
   FastAPI
      │
      ├── Authentication
      └── Request Validation
              │
              ▼
      Application Logic
              │
              │ SQLAlchemy
              ▼
         PostgreSQL
              │
              ▼
         API Response
              │
              ▼
       React Frontend
```

For broader system design information, see [Architecture](./architecture.md).

---

# Related Documentation

- [Documentation Index](./README.md)
- [Architecture](./architecture.md)
- [Project Details](./project-details.md)
- [Setup Guide](./setup.md)
- [Testing](./testing.md)
- [Troubleshooting](./troubleshooting.md)
- [Roadmap & Maintenance](./roadmap.md)