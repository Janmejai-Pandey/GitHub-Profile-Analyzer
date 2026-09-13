import os
from functools import lru_cache

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


class Settings:
    """All app configuration in one place, pulled from environment variables."""

    GITHUB_API_BASE: str = "https://api.github.com"

    # Optional: a GitHub personal access token raises the rate limit
    # from 60 req/hr (unauthenticated) to 5000 req/hr.
    GITHUB_TOKEN: str | None = os.getenv("GITHUB_TOKEN")

    DEFAULT_PER_PAGE: int = 30
    MAX_PER_PAGE: int = 100

    # How many of a user's repos to inspect when building dashboard/analysis
    # aggregates (keeps things fast and within rate limits).
    MAX_REPOS_FOR_AGGREGATION: int = 100


@lru_cache
def get_settings() -> Settings:
    return Settings()
