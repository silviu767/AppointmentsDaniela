import os
import html
from datetime import datetime
from zoneinfo import ZoneInfo
import resend
from backend.config.config import RESEND_API_KEY, EMAIL_BACKEND

resend.api_key = RESEND_API_KEY
BUSINESS_TZ = ZoneInfo("Europe/Paris")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "Salon Daniela <onboarding@resend.dev>")


def format_starts_at(starts_at_val: str | datetime) -> str:
    if isinstance(starts_at_val, datetime):
        dt = starts_at_val.astimezone(BUSINESS_TZ) if starts_at_val.tzinfo else starts_at_val
        return dt.strftime("%d.%m.%Y la ora %H:%M")
    try:
        dt = datetime.fromisoformat(str(starts_at_val))
        if dt.tzinfo:
            dt = dt.astimezone(BUSINESS_TZ)
        return dt.strftime("%d.%m.%Y la ora %H:%M")
    except Exception:
        return str(starts_at_val)


def send_email(to_email: str, subject: str, html_body: str):
    if not to_email:
        return
    if EMAIL_BACKEND == "console":
        print(f"[EMAIL -> {to_email}] {subject}: {html_body}")
        return

    try:
        resend.Emails.send({
            "from": RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_body,
        })
    except Exception as exc:
        print(f"[EROARE RESEND -> {to_email}] ({exc}). Fallback consola: {subject}: {html_body}")


def send_appointment_received_email(to_email: str, client_name: str, starts_at_str: str | datetime):
    formatted = format_starts_at(starts_at_str)
    return send_email(
        to_email,
        "Cerere de programare primita - Salon Daniela",
        f"Buna {html.escape(client_name)}! Am primit cererea ta de programare pentru {formatted}. Daniela o va verifica in curand si vei primi o confirmare.",
    )


def send_appointment_confirmed_email(to_email: str, client_name: str, starts_at_str: str | datetime):
    formatted = format_starts_at(starts_at_str)
    return send_email(
        to_email,
        "Programare confirmata! - Salon Daniela",
        f"Draga {html.escape(client_name)}, programarea ta pentru {formatted} a fost confirmata cu succes de Daniela!",
    )


def send_reminder_email(to_email: str, client_name: str, starts_at_str: str | datetime):
    formatted = format_starts_at(starts_at_str)
    return send_email(
        to_email,
        "Reminder programare - Salon Daniela",
        f"Draga {html.escape(client_name)}, va reamintim ca aveti o programare pe {formatted}.",
    )


def send_appointment_cancelled_by_admin_email(to_email: str, client_name: str, starts_at_str: str | datetime):
    formatted = format_starts_at(starts_at_str)
    return send_email(
        to_email,
        "Informare programare - Salon Daniela",
        f"Buna {html.escape(client_name)}, din pacate programarea ta pentru {formatted} nu a putut fi confirmata sau a fost anulata de catre salon. Ne cerem scuze pentru neplaceri!",
    )


def send_admin_new_appointment_email(to_email: str, client_name: str, starts_at: str | datetime):
    formatted = format_starts_at(starts_at)
    return send_email(
        to_email,
        "Aveti o noua programare in asteptare - Salon Daniela",
        f"{html.escape(client_name)} a facut o programare pentru {formatted} si asteapta aprobarea.",
    )


def send_admin_new_review_email(to_email: str, rating: int, comment: str | None):
    safe_comment = html.escape(comment) if comment else "Fara comentariu"
    return send_email(
        to_email,
        "Recenzie noua de aprobat - Salon Daniela",
        f"Recenzie cu {rating} stele si comentariul: {safe_comment} asteapta aprobarea.",
    )


def send_admin_appointment_cancelled_by_client_email(to_email: str, client_name: str, starts_at: str | datetime):
    formatted = format_starts_at(starts_at)
    return send_email(
        to_email,
        "Programare anulata de client - Salon Daniela",
        f"Programarea din {formatted} a fost anulata de catre {html.escape(client_name)}.",
    )
