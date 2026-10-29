from datetime import datetime
from sqlalchemy.orm import Session 
from backend.models.blocked_periods import BlockedPeriod

def get_blocked_periods_for_day(db: Session, day_start: datetime, day_end: datetime):
    return db.query(BlockedPeriod).filter(BlockedPeriod.starts_at < day_end, BlockedPeriod.ends_at > day_start).order_by(BlockedPeriod.starts_at).all()

def get_all_blocked_periods(db: Session):
    return db.query(BlockedPeriod).order_by(BlockedPeriod.starts_at).all()

def get_blocked_period_by_id(db: Session, period_id: int):
    return db.query(BlockedPeriod).filter(BlockedPeriod.period_id == period_id).first()

def create_blocked_period(db: Session, period: BlockedPeriod):
    db.add(period)
    db.commit()
    db.refresh(period)
    return period
def delete_blocked_period(db:Session, period: BlockedPeriod):
    db.delete(period)
    db.commit()