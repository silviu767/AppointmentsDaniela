from datetime import datetime
from sqlalchemy.orm import Session 
from backend.models.blocked_periods import BlockedPeriod

def get_blocked_periods_for_day(db: Session, day_start: datetime, day_end: datetime):
    return db.query(BlockedPeriod).filter(BlockedPeriod.starts_at < day_end, BlockedPeriod.ends_at > day_start).order_by(BlockedPeriod.starts_at).all()