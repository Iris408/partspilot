import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.item_model import Item
from app.models.user_model import User
from app.models.supplier_model import Supplier

from app.routes.item_routes import router as item_router
from app.routes.auth_routes import router as auth_router
from app.routes.supplier_routes import router as supplier_router
from app.routes import reports

IS_TESTING = os.getenv("TESTING", "false").lower() == "true"

app = FastAPI(
    title="PartsPilot API",
    description=(
        "Backend API for inventory management, operational analytics "
        "and business intelligence reporting."
    ),
    version="2.0.0",
)


cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5174,https://inventory-management-system-iris408.vercel.app,partspilot.uk",
)

origins = [
    origin.strip()
    for origin in cors_origins.split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_database_tables():
    if not IS_TESTING:
        Base.metadata.create_all(bind=engine, checkfirst=True)

@app.get("/")
def home():
    return {
        "message": "PartsPilot API",
        "status": "ok"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(item_router)
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(reports.router)
app.include_router(supplier_router)