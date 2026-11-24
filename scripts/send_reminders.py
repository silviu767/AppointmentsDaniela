from datetime import datetime, timedelta
from backend.database import SessionLocal
from backend.repositories import appointments as appointments_repository
from backend.services.slots import BUSINESS_TZ
from backend.services.email import send_reminder_email


def run_reminders():
    db = SessionLocal()
    try:
        now = datetime.now(BUSINESS_TZ)
        window_end = now + timedelta(hours=24)
        upcoming = appointments_repository.get_upcoming_appointments(db, now, window_end)
        sent_count = 0
        for app in upcoming:
            if app.user and app.user.email:
                send_reminder_email(app.user.email, app.user.first_name, app.starts_at)
                sent_count += 1
        print(f"Remindere procesate cu succes: {sent_count} trimise.")
    finally:
        db.close()


if __name__ == "__main__":
    run_reminders()
