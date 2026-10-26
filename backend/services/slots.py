from datetime import datetime, date, time, timedelta
from zoneinfo import ZoneInfo
from fastapi import HTTPException
from sqlalchemy.orm import Session
from backend.repositories import services as service_repository
from backend.repositories import appointments as appointments_repository
from backend.repositories import working_hours as working_hours_repository
from backend.repositories import blocked_periods as blocked_periods_repository
from backend.schemas.slots import SlotOut

BUSINESS_TZ = ZoneInfo("Europe/Paris")
BUFFER_MINUTES = 10
STEP_MINUTES = 60
MAX_DAYS_AHEAD = 90
MIN_HOURS_AHEAD = 2
def is_slot_available(slot_start, busy_until, blocked_periods, appointments, now):

    if slot_start <= now + timedelta(hours=MIN_HOURS_AHEAD):
        return False
   
    for bp in blocked_periods:
        if slot_start < bp.ends_at and busy_until > bp.starts_at:
            return False

    for app in appointments:
        if slot_start < app.ends_at + timedelta(minutes=BUFFER_MINUTES) and busy_until > app.starts_at:
            return False
    
    return True 


def get_available_slots(db: Session, service_id: int, target_date: date):
    #asta este etapa de verificare a validitati (paznici)
    service =  service_repository.get_active_service_by_id(db, service_id)
    if  service == None:
        raise HTTPException(status_code=404,
                            detail="Serviciul nu a fost gasit")
    working_hours = working_hours_repository.get_working_hours_for_day(db, target_date.weekday())
    if not working_hours:
        return []
    
    now = datetime.now(BUSINESS_TZ) 

    if target_date < now.date() or target_date > now.date() + timedelta(days=MAX_DAYS_AHEAD):
        return []
#Aducem obstacolele din ziua respectiva 
    day_start = datetime.combine(target_date, time(0,0), tzinfo=BUSINESS_TZ)
    day_end = day_start + timedelta(days=1)
    blocked_periods = blocked_periods_repository.get_blocked_periods_for_day(db, day_start, day_end)
    appointments = appointments_repository.get_active_appointments_for_day(db, day_start, day_end)
#Ceasul si cosul 
    available_slots = []

    for wh in working_hours:
        slot_start = datetime.combine(target_date, wh.starts_at, tzinfo=BUSINESS_TZ)
        work_end = datetime.combine(target_date, wh.ends_at, tzinfo=BUSINESS_TZ)

        while slot_start + timedelta(minutes=service.duration_minutes) <= work_end:
            slot_end = slot_start + timedelta(minutes=service.duration_minutes)
            busy_until = slot_end + timedelta(minutes=BUFFER_MINUTES)
            if is_slot_available(slot_start, busy_until, blocked_periods, appointments, now):
                available_slots.append(SlotOut(starts_at = slot_start, ends_at = slot_end))
            slot_start += timedelta(minutes=STEP_MINUTES)

    return available_slots