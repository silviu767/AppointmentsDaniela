from datetime import datetime, timedelta
import redis
from backend.config.config import REDIS_URL
from backend.database import SessionLocal
from backend.services.slots import BUSINESS_TZ
from backend.repositories import appointments as appointments_repository, users as user_repository 
from backend.services.email import send_reminder_email

redis_client = redis.from_url(REDIS_URL)

def process_reminders():
    db = SessionLocal()
    try:
        now = datetime.now(BUSINESS_TZ) 
        window_end = now + timedelta(hours=24)
        upcoming = appointments_repository.get_upcoming_appointments(db, now, window_end)

        for app in upcoming:
            redis_key = f"reminder:{app.appointment_id}"

            if redis_client.get(redis_key) is not None:
                continue

            user = user_repository.get_user_by_id(db, app.user_id)

            if user and user.email is not None:
                try :
                    send_reminder_email(user.email, user.first_name, str(app.starts_at))
                    redis_client.setex(redis_key, 86400, "sent")
                except Exception as e:
                    print(f"Eroare la trimiterea remider-ului pentru programarea {app.appointment_id}: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    process_reminders()