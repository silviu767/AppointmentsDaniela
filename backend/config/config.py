import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
DATABASE_URL = os.getenv("DATABASE_URL",
                         "postgresql+psycopg2://silviantataru:@localhost:5432/appointments")

FRONTEND_URL = os.getenv("FRONTEND_URL",
                        "http://localhost:5173")

REDIS_URL = os.getenv("REDIS_URL", 
                      "redis://localhost:6379") 

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")
S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY_ID")
S3_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
CDN_BASE_URL = os.getenv("CDN_BASE_URL")
