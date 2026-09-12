from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.auth_service import (
    get_current_user,
    require_write_access,
)

from app.database import get_db
from app.models.supplier_model import Supplier
from app.schemas.supplier_schema import (
    SupplierCreate,
    SupplierResponse,
    SupplierUpdate,
)


router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"]
)

@router.post(
    "",
    response_model=SupplierResponse,
    status_code=201
)
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_write_access)
):
    db_supplier = Supplier(
        name=supplier.name,
        contact_name=supplier.contact_name,
        email=supplier.email,
        phone=supplier.phone,
        website=supplier.website,
        category=supplier.category,
        status=supplier.status,
        notes=supplier.notes,
    )

    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)

    return db_supplier

@router.get(
    "",
    response_model=list[SupplierResponse]
)
def get_suppliers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return (
        db.query(Supplier)
        .order_by(Supplier.name.asc())
        .all()
    )


@router.get(
    "/{supplier_id}",
    response_model=SupplierResponse
)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    supplier = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier


@router.put(
    "/{supplier_id}",
    response_model=SupplierResponse
)
def update_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_write_access)
):
    db_supplier = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not db_supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    update_data = supplier.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(db_supplier, field, value)

    db.commit()
    db.refresh(db_supplier)

    return db_supplier


@router.delete(
    "/{supplier_id}",
    status_code=204
)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_write_access)
):
    supplier = (
        db.query(Supplier)
        .filter(Supplier.id == supplier_id)
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    db.delete(supplier)
    db.commit()

    return None