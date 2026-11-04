import resend
from backend.config.config import RESEND_API_KEY

def send_appointment_received_email(to_email: str, client_name: str, starts_at_str: str):
    if RESEND_API_KEY is None:
        print("mesaj de cerere primita")
        return 

    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": "Salon Daniela <onboarding@resend.dev>",
                       "to": [to_email],
                       "subject": "Cerere de programare primita - Salon Daniela",
                       "html": f"Buna {client_name}! Am primit cererea ta de programare pentru {starts_at_str}. Daniela o va verifica in curand si vei primi o confirmare"})

def send_appointment_confirmed_email(to_email: str, client_name: str, starts_at_str: str):
    if RESEND_API_KEY is None:
        print("mesaj de confirmare ")
        return 

    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": "Salon Daniela <onboarding@resend.dev>",
                       "to": [to_email],
                       "subject": "Cerere de programare confirmata! - Salon Daniela",
                       "html": f"Draga {client_name}, programarea ta pentru {starts_at_str} a fost confirmata cu succes de Daniela! Te asteptam cu drag."})
    
def send_reminder_email(to_email: str, client_name: str, starts_at_str: str):
    if RESEND_API_KEY is None:
        print("Reminder")
        return

    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": "Salon Daniela <onboarding@resend.dev>",
                           "to": [to_email],
                           "subject": "Reminder programare - Salon Daniela",
                           "html": f"Draga {client_name}, va reamintim ca aveti o programare la {starts_at_str}"})

def send_appointment_cancelled_by_admin_email(to_email:str, client_name: str, starts_at_str: str):
    if RESEND_API_KEY is None:
            print("mesajul de anlare de catre admin")
            return
    
    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": "Salon Daniela <onboarding@resend.dev>",
                        "to": [to_email],
                        "subject": "Informare programare - Salon Daniela",
                        "html": f"Buna {client_name}, din pacate programarea ta pentru {starts_at_str} nu a putut fi confirmata sau a fost anulata de catre salon. Ne cerem scuze pentru neplaceri!"})
    