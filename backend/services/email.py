import resend
from backend.config.config import RESEND_API_KEY, EMAIL_BACKEND

resend.api_key = RESEND_API_KEY
def send_email(to_email: str, subject: str, html: str):
     if EMAIL_BACKEND == "console":
          print(f"[EMAIL -> {to_email} {subject}: {html}]")
          return

     resend.Emails.send({"from": "Salon Daniela <onboarding@resend.dev>",
                        "to": [to_email],
                        "subject": subject,
                        "html": html})

def send_appointment_received_email(to_email: str, client_name: str, starts_at_str: str):
    mesaj = send_email(to_email, "Cerere de programare primita - Salon Daniela", (f"Buna {client_name}! Am primit cererea ta de programare pentru {starts_at_str}. Daniela o va verifica in curand si vei primi o confirmare"))
    return mesaj

def send_appointment_confirmed_email(to_email: str, client_name: str, starts_at_str: str):
    mesaj = send_email(to_email, "Programare confirmata! - Salon Daniela", (f"Draga {client_name}, programarea ta pentru {starts_at_str} a fost confirmata cu succes de Daniela!"))
    return mesaj

def send_reminder_email(to_email: str, client_name: str, starts_at_str: str):
    mesaj = send_email(to_email, "Reminder programare - Salon Daniela", (f"Draga {client_name}, va reamintim ca aveti o programare la {starts_at_str}"))
    return mesaj 

def send_appointment_cancelled_by_admin_email(to_email:str, client_name: str, starts_at_str: str):
    mesaj = send_email(to_email, "Informare programare - Salon Daniela", (f"Buna {client_name}, din pacate programarea ta pentru {starts_at_str} nu a putut fi confirmata sau a fost anulata de catre salon. Ne cerem scuze pentru neplaceri!"))
    return mesaj

def send_admin_new_appointment_email(to_email: str, client_name: str, starts_at: str):
    mesaj = send_email(to_email, "Aveti o noua programare in asteptare - Salon Daniela", (f"{client_name}, a facut o programare pe data de {starts_at} si asteapta aprobarea"))
    return mesaj

def send_admin_new_review_email(to_email: str, rating:int, comment:str | None ):
    mesaj = send_email(to_email, "Rcenzie noua de aprobat - Salon Daniela", (f" Recenzie cu {rating} stele , si cu comentariul: {comment} asteapta aprobarea"))
    return mesaj 
def send_admin_appointment_cancelled_by_client_email(to_email: str, client_name: str, starts_at: str):
     mesaj = send_email(to_email, "Programara anulata de client - Salon Daniela", (f"Programarea de la {starts_at} a fost anulata de catre {client_name}"))
     return mesaj 