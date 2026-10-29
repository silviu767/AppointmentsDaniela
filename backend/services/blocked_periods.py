from fastapi import HTTPException
from sqlalchemy.orm import Session
from backend.models.blocked_periods import BlockedPeriod
from backend.schemas.blocked_periods import BlockedPeriodCreate
from backend.repositories import blocked_periods as blockend_periods_repository
from backend.services.slots import BUSINESS_TZ

def get_all_blocked_periods(db: Session):
    return blockend_periods_repository.get_all_blocked_periods(db)

def create_blocked_period(db: Session, period_data: BlockedPeriodCreate):
    if period_data.starts_at.tzinfo is None:
        starts_at = period_data.starts_at.replace(tzinfo=BUSINESS_TZ)
    else:
        starts_at = period_data.starts_at.astimezone(BUSINESS_TZ)

    if period_data.ends_at.tzinfo is None:
            ends_at = period_data.ends_at.replace(tzinfo=BUSINESS_TZ)
    else:
            ends_at = period_data.ends_at.astimezone(BUSINESS_TZ)
    
    if ends_at <= starts_at:
         raise HTTPException(status_code=400,
                             detail="Data de sfarsit trebuie sa fie dupa data de inceput")

    new_period = BlockedPeriod( starts_at = starts_at,
                               ends_at = ends_at,
                               reason = period_data.reason)
    return blockend_periods_repository.create_blocked_period(db, new_period)

def delete_blocked_period(db: Session, period_id: int):
     period = blockend_periods_repository.get_blocked_period_by_id(db, period_id)
     if period is None:
          raise HTTPException(status_code=404,
                              detail="Perioada blocata nu afost gasita")
     return blockend_periods_repository.delete_blocked_period(db, period)
                               