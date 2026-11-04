import resend
from backend.config.config import RESEND_API_KEY

def send_appointment_email(to_email: str, client_name: str, starts_at_str: str):
    if RESEND_API_KEY is None:
        print(f"Mesajul catre {to_email}, al clientei {client_name}, cu programarea la ora {starts_at_str}, nu poate fi trimis")
        return 

    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": "Salon Daniela <onboarding@resend.dev>",
                       "to": [to_email],
                       "subject": "Confirmare programare - Salon Daniela",
                       "html": f"Draga {client_name}, va asteptam cu drag la {starts_at_str}"})
    
def send_reminder_email(to_email: str, client_name: str, starts_at_str: str):
    if RESEND_API_KEY is None:
        print(f"Reminder catre {to_email}, al clientei {client_name}, cu programarea la  {starts_at_str}, nu poate fi trimis")
        return

    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": "Salon Daniela <onboarding@resend.dev>",
                           "to": [to_email],
                           "subject": "Reminder programare - Salon Daniela",
                           "html": f"Draga {client_name}, va reamintim ca aveti o programare la {starts_at_str}"})
        