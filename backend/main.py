from fastapi import FastAPI
from backend.routers.services import router as services_router
from backend.routers.slots import router as slots_router
from backend.routers.users import router as users_router
from backend.routers.appointments import router as appointments_router
from backend.routers.admin import router as admin_router
from backend.routers.photos import router as photos_router
from backend.routers.reviews import router as review_router
from fastapi.middleware.cors import CORSMiddleware
from backend.config.config import FRONTEND_URL
from backend.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded


app = FastAPI(title = "Programari Salon Daniela")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=[FRONTEND_URL], allow_credentials=True,
                   allow_methods=["GET", "POST", "PATCH", "DELETE"],
                   allow_headers=["Authorization", "Content-Type"],)

app.include_router(slots_router)
app.include_router(services_router)
app.include_router(users_router)
app.include_router(appointments_router)
app.include_router(admin_router)
app.include_router(photos_router)
app.include_router(review_router)