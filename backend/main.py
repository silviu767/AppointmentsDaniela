from fastapi import FastAPI
from backend.routers.services import router as services_router
from backend.routers.slots import router as slots_router
from backend.routers.users import router as users_router

app = FastAPI(title = "Programari Salon Daniela")

app.include_router(slots_router)
app.include_router(services_router)
app.include_router(users_router)
