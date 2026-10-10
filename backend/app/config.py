"""
Application configuration for ResearchPilot backend.
Reads environment variables using Pydantic Settings per docs/04-BACKEND-SPEC.md §2.
"""

from typing import List
import logging
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("researchpilot.config")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # API Keys & DB credentials (docs/00-START-HERE.md §6)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    TAVILY_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Server & CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    APP_ENV: str = "development"

    # Budgets & Limits
    DAILY_GEMINI_BUDGET: int = 80
    MONTHLY_TAVILY_BUDGET: int = 900
    MAX_RUNS_PER_HOUR_PER_IP: int = 5
    RUN_TIMEOUT_SECONDS: int = 150

    @property
    def parsed_allowed_origins(self) -> List[str]:
        """
        Parses ALLOWED_ORIGINS by splitting on comma, stripping whitespace,
        removing trailing slashes, and dropping empty entries.
        """
        raw = self.ALLOWED_ORIGINS or ""
        origins = [orig.strip().rstrip("/") for orig in raw.split(",")]
        return [orig for orig in origins if orig]

    def validate_secrets(self) -> None:
        """
        Validates presence of required secrets for agent and database execution.
        Fails fast with a clear message without leaking any key values.
        """
        required = {
            "GEMINI_API_KEY": self.GEMINI_API_KEY,
            "TAVILY_API_KEY": self.TAVILY_API_KEY,
            "SUPABASE_URL": self.SUPABASE_URL,
            "SUPABASE_SERVICE_ROLE_KEY": self.SUPABASE_SERVICE_ROLE_KEY,
        }
        missing = [name for name, val in required.items() if not val]
        if missing:
            raise ValueError(
                f"Missing required environment variable(s): {', '.join(missing)}. "
                "Please configure them in backend/.env or your deployment environment."
            )


settings = Settings()
