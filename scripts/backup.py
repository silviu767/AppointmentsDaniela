import os, subprocess
from datetime import datetime, timezone 
import boto3
from backend.config.config import DATABASE_URL, STORAGE_BACKEND, S3_ENDPOINT_URL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME

def run_backup():
    os.makedirs("backups", exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    filename = f"backup_{timestamp}.sql"
    filepath = f"backups/{filename}"

    pg_url = DATABASE_URL.replace("postgresql+psycopg2://", "postgresql://")
    pg_dump = subprocess.run(["pg_dump", pg_url, "-f", filepath], check = True)

    if STORAGE_BACKEND == "local":
        print(f"Backup salvat local {filepath}")
        return 

    s3_client = boto3.client("s3", endpoint_url = S3_ENDPOINT_URL,aws_access_key_id = S3_ACCESS_KEY_ID, aws_secret_access_key =S3_SECRET_ACCESS_KEY)
    s3_client.upload_file(filepath, S3_BUCKET_NAME, f"backups/{filename}")
    os.remove(filepath)
    print("Backup-ul a ajuns cu siguranta in S3/R2")


if __name__ == "__main__":
    run_backup()
