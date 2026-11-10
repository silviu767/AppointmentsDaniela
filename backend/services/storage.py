import os
import uuid
import boto3
from fastapi import UploadFile, HTTPException
from backend.config.config import S3_ACCESS_KEY_ID, S3_BUCKET_NAME, S3_ENDPOINT_URL, S3_SECRET_ACCESS_KEY, CDN_BASE_URL, STORAGE_BACKEND

def upload_photo_file(file: UploadFile) -> str:
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, 
                            detail="Format invalid. Sunt permise doar imagini JPEG, PNG, sau WEBP")

    ext = file.content_type.split("/")[1]
    filename = f"{uuid.uuid4()}.{ext}"
    content = file.file.read()
    if len(content) > 5 * 1024 * 1024 : 
        raise HTTPException(status_code=400,
                            detail="Fisierul este prea mare")

    if STORAGE_BACKEND == "local":
        os.makedirs("uploads", exist_ok=True)
        with open(f"uploads/{filename}", "wb") as buffer:
            buffer.write(content)
        return  f"/uploads/{filename}"

    s3_client = boto3.client("s3", endpoint_url = S3_ENDPOINT_URL,aws_access_key_id = S3_ACCESS_KEY_ID, aws_secret_access_key =S3_SECRET_ACCESS_KEY)
    file.file.seek(0)
    s3_client.upload_fileobj(file.file, S3_BUCKET_NAME, filename, ExtraArgs = {"ContentType": file.content_type})

    return f"{CDN_BASE_URL}/{filename}"

def delete_photo_file(image_url: str):
    filename = image_url.split("/")[-1]
    if STORAGE_BACKEND == "local":
        if os.path.exists(f"uploads/{filename}"):
            os.remove(f"uploads/{filename}")
        return 
        
    s3_client = boto3.client("s3", endpoint_url = S3_ENDPOINT_URL,aws_access_key_id = S3_ACCESS_KEY_ID, aws_secret_access_key =S3_SECRET_ACCESS_KEY)
    s3_client.delete_object(Bucket= S3_BUCKET_NAME, Key = filename)
        