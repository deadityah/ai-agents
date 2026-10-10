"""
Budget routes for ResearchPilot API.
In Phase 1, returns placeholder data in the final JSON shape (docs/04-BACKEND-SPEC.md §9).
"""

from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo
from fastapi import APIRouter
from app.config import settings

router = APIRouter()


@router.get("/budget")
async def get_budget():
    """
    Returns daily Gemini budget, monthly Tavily credits, and per-depth availability.
    In Phase 1, returns placeholder fake numbers with realistic timezone resets.
    """
    tz = ZoneInfo("America/Los_Angeles")
    now_la = datetime.now(tz)
    tomorrow_la = now_la.date() + timedelta(days=1)
    resets_at = datetime.combine(tomorrow_la, time.min, tzinfo=tz).isoformat()
    current_month = now_la.strftime("%Y-%m")

    # Placeholder numbers in the exact contract shape (docs/04-BACKEND-SPEC.md §9)
    gemini_limit = settings.DAILY_GEMINI_BUDGET
    gemini_used = 14
    gemini_remaining = max(0, gemini_limit - gemini_used)

    tavily_limit = settings.MONTHLY_TAVILY_BUDGET
    tavily_used = 34
    tavily_remaining = max(0, tavily_limit - tavily_used)

    return {
        "gemini": {
            "used": gemini_used,
            "limit": gemini_limit,
            "remaining": gemini_remaining,
            "resets_at": resets_at,
        },
        "tavily": {
            "used": tavily_used,
            "limit": tavily_limit,
            "remaining": tavily_remaining,
            "month": current_month,
        },
        "depths": {
            "quick": {"gemini_cap": 4, "allowed": True},
            "standard": {"gemini_cap": 6, "allowed": True},
            "deep": {"gemini_cap": 8, "allowed": False},
        },
    }
