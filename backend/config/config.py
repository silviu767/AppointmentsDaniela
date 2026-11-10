import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
if SECRET_KEY is None or len(SECRET_KEY) < 32:
    raise RuntimeError("SECRET_KEY lipseste sau este prea scurt (minim 32 caractere)!")
DATABASE_URL = os.getenv("DATABASE_URL",
                         "postgresql+psycopg2://silviantataru:@localhost:5432/appointments")

FRONTEND_URL = os.getenv("FRONTEND_URL",
                        "http://localhost:5173")

REDIS_URL = os.getenv("REDIS_URL", 
                      "redis://localhost:6379") 

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "console")
if EMAIL_BACKEND not in ["console", "resend"]:
    raise RuntimeError("EMAIL_BACKEND invalid!")

if EMAIL_BACKEND == "resend" and RESEND_API_KEY is None:
    raise RuntimeError("RESEND_API_KEY lipseste pentru EMAIL_BACKEND ='RESEND'!")

S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")
S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY_ID")
S3_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
CDN_BASE_URL = os.getenv("CDN_BASE_URL")

STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")

if STORAGE_BACKEND not in ["local", "s3"]:
    raise RuntimeError("STORAGE_BACKEND invalid ! trebue sa fie local sau s3")
if STORAGE_BACKEND  == "s3" and not all ([S3_ENDPOINT_URL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, CDN_BASE_URL]):
    raise RuntimeError("Configuratia S3/CDN este inclompleta pentru STORAGE_BACKEND = 's3' !")