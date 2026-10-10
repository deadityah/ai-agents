"""
FastAPI application entrypoint for ResearchPilot.
CORS, health check, router registration, and startup lifecycle per docs/04-BACKEND-SPEC.md §2, §3, §9.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.budget import router as budget_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("researchpilot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Log the parsed ALLOWED_ORIGINS list at startup (docs/04-BACKEND-SPEC.md §2)
    logger.info("Starting ResearchPilot backend [env: %s]", settings.APP_ENV)
    logger.info("Parsed ALLOWED_ORIGINS: %s", settings.parsed_allowed_origins)
    yield
    logger.info("Shutting down ResearchPilot backend")


app = FastAPI(
    title="ResearchPilot API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS Middleware (docs/04-BACKEND-SPEC.md §3)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
async def health():
    """Health check endpoint per docs/04-BACKEND-SPEC.md §9"""
    return {"status": "ok"}


# Mount API routers
app.include_router(budget_router, prefix="/api")
