from fastapi import FastAPI
from backend.database import engine 
from sqlalchemy import text
from backend.routers.services import router as services_router
from backend.routers.slots import router as slots_router
app = FastAPI(title = "Programari Salon Daniela")

app.include_router(slots_router)
app.include_router(services_router)

@app.get("/")
def read_root():
    return {"message": "Serverul de programari functioneaza cu succes!"}



@app.get("/api/test-db")
def test_db_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return {
                "status": "success",
                "message": "Conexiunea cu PostgreSQL a reusit",
            }
    except Exception as e:
        return{"status": "error", "message": str(e)}