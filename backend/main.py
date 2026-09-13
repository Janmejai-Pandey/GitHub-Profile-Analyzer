import sys
from collections import Counter
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from backend.config import get_settings
from backend.github_client import github_client
from backend.schemas import (
    UserProfile, RepoSummary, GitHubUserRef, Contributor, Commit,
    SearchUsersResult, SearchRepositoriesResult, DashboardStats,
    AnalysisResponse, ErrorResponse,
)

# Make the sibling `AI` package importable (resolved relative to this
# file's own location, so it works regardless of the current working
# directory the server was launched from).
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from AI.main import analyze_profile, GitHubProfile  # noqa: E402

settings = get_settings()
COMMON_ERRORS = {404: {"model": ErrorResponse}, 429: {"model": ErrorResponse}}


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await github_client.close()


app = FastAPI(title="GitHub Profile Analyzer — Backend", version="1.0.0", lifespan=lifespan)

# Allow the frontend to call this API directly.
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)


# =====================================================================
# Profile
# =====================================================================

@app.get("/api/profile/{username}", response_model=UserProfile, responses=COMMON_ERRORS, tags=["profile"])
async def get_profile(username: str):
    return await github_client.get_user(username)


@app.get("/api/profile/{username}/followers", response_model=list[GitHubUserRef], responses=COMMON_ERRORS, tags=["profile"])
async def get_followers(username: str, page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    return await github_client.get_followers(username, page, per_page)


@app.get("/api/profile/{username}/following", response_model=list[GitHubUserRef], responses=COMMON_ERRORS, tags=["profile"])
async def get_following(username: str, page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    return await github_client.get_following(username, page, per_page)


# =====================================================================
# Repos
# =====================================================================

@app.get("/api/repos/{username}", response_model=list[RepoSummary], responses=COMMON_ERRORS, tags=["repos"])
async def list_user_repos(
    username: str, page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100),
    sort: str = Query("updated", pattern="^(created|updated|pushed|full_name)$"),
):
    return await github_client.get_user_repos(username, page, per_page, sort)


@app.get("/api/repos/{owner}/{repo}", response_model=RepoSummary, responses=COMMON_ERRORS, tags=["repos"])
async def get_repo_details(owner: str, repo: str):
    return await github_client.get_repo(owner, repo)


@app.get("/api/repos/{owner}/{repo}/languages", response_model=dict[str, int], responses=COMMON_ERRORS, tags=["repos"])
async def get_repo_languages(owner: str, repo: str):
    return await github_client.get_repo_languages(owner, repo)


@app.get("/api/repos/{owner}/{repo}/contributors", response_model=list[Contributor], responses=COMMON_ERRORS, tags=["repos"])
async def get_repo_contributors(owner: str, repo: str, page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    return await github_client.get_repo_contributors(owner, repo, page, per_page)


@app.get("/api/repos/{owner}/{repo}/commits", response_model=list[Commit], responses=COMMON_ERRORS, tags=["repos"])
async def get_repo_commits(owner: str, repo: str, page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    return await github_client.get_repo_commits(owner, repo, page, per_page)


# =====================================================================
# Search
# =====================================================================

@app.get("/api/search/users", response_model=SearchUsersResult, responses=COMMON_ERRORS, tags=["search"])
async def search_users(q: str = Query(..., min_length=1), page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    return await github_client.search_users(q, page, per_page)


@app.get("/api/search/repositories", response_model=SearchRepositoriesResult, responses=COMMON_ERRORS, tags=["search"])
async def search_repositories(q: str = Query(..., min_length=1), page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    return await github_client.search_repositories(q, page, per_page)


# =====================================================================
# Dashboard (our own computed stats — no single GitHub endpoint gives us this)
# =====================================================================

def _to_repo_summary(repo: dict) -> RepoSummary:
    return RepoSummary(
        name=repo.get("name"), full_name=repo.get("full_name"),
        description=repo.get("description"), html_url=repo.get("html_url"),
        language=repo.get("language"), stargazers_count=repo.get("stargazers_count", 0),
        forks_count=repo.get("forks_count", 0), open_issues_count=repo.get("open_issues_count", 0),
        size=repo.get("size", 0), created_at=repo.get("created_at"),
        updated_at=repo.get("updated_at"), pushed_at=repo.get("pushed_at"),
        fork=repo.get("fork", False), archived=repo.get("archived", False),
    )


async def build_dashboard_stats(username: str) -> DashboardStats:
    user = await github_client.get_user(username)
    raw_repos = await github_client.get_all_user_repos(username, settings.MAX_REPOS_FOR_AGGREGATION)
    repos = [_to_repo_summary(r) for r in raw_repos]

    language_counts = Counter(r.language for r in repos if r.language)
    top_languages = [{"language": lang, "repo_count": c} for lang, c in language_counts.most_common(10)]

    return DashboardStats(
        username=username,
        total_public_repos=user.get("public_repos", 0),
        repos_analyzed=len(repos),
        total_stars=sum(r.stargazers_count for r in repos),
        total_forks=sum(r.forks_count for r in repos),
        top_languages=top_languages,
        most_starred_repo=max(repos, key=lambda r: r.stargazers_count, default=None),
        most_forked_repo=max(repos, key=lambda r: r.forks_count, default=None),
        recently_updated_repos=sorted(repos, key=lambda r: r.updated_at or "", reverse=True)[:5],
        followers=user.get("followers", 0),
        following=user.get("following", 0),
    )


@app.get("/api/dashboard/{username}", response_model=DashboardStats, responses=COMMON_ERRORS, tags=["dashboard"])
async def get_dashboard(username: str):
    return await build_dashboard_stats(username)


# =====================================================================
# AI analysis (the one endpoint that also reaches into AI/)
# =====================================================================

REPO_FIELDS_FOR_AI = (
    "name", "description", "language", "stargazers_count", "forks_count",
    "topics", "fork", "archived", "created_at", "updated_at",
)


async def _build_github_profile_for_ai(username: str) -> GitHubProfile:
    user = await github_client.get_user(username)
    raw_repos = await github_client.get_all_user_repos(username, settings.MAX_REPOS_FOR_AGGREGATION)

    # % of repos with each primary language — repo-count based, not
    # byte-count based (a true byte percentage needs one extra GitHub
    # call per repo, which isn't worth it here).
    lang_counts = Counter(r.get("language") for r in raw_repos if r.get("language"))
    total = sum(lang_counts.values())
    languages = {lang: round((c / total) * 100, 2) for lang, c in lang_counts.items()} if total else {}

    repositories = [{f: r.get(f) for f in REPO_FIELDS_FOR_AI} for r in raw_repos]

    return GitHubProfile(
        username=user.get("login", username), bio=user.get("bio"),
        followers=user.get("followers", 0), following=user.get("following", 0),
        languages=languages, repositories=repositories,
    )


@app.post(
    "/api/analysis/{username}",
    response_model=AnalysisResponse,
    responses={**COMMON_ERRORS, 502: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
    tags=["analysis"],
)
async def analyze_developer(username: str):
    """Build a GitHubProfile from live GitHub data, then call
    AI.main.analyze_profile() in-process (Groq under the hood).
    Requires GROQ_API_KEY to be set (in AI/.env or the environment)."""
    profile = await _build_github_profile_for_ai(username)

    try:
        # analyze_profile() is a sync/blocking call — run it off the event loop.
        analysis = await run_in_threadpool(analyze_profile, profile)
    except ValueError as exc:
        # Raised by AI.main when GROQ_API_KEY isn't set.
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {exc}")

    return AnalysisResponse(username=profile.username, analysis=analysis)


# =====================================================================
# Utility
# =====================================================================

@app.get("/")
async def root():
    return {
        "message": "GitHub Profile Analyzer API",
        "docs": "/docs",
        "endpoints": {
            "profile": "/api/profile/{username}",
            "followers": "/api/profile/{username}/followers",
            "following": "/api/profile/{username}/following",
            "repos": "/api/repos/{username}",
            "repo_details": "/api/repos/{owner}/{repo}",
            "repo_languages": "/api/repos/{owner}/{repo}/languages",
            "repo_contributors": "/api/repos/{owner}/{repo}/contributors",
            "repo_commits": "/api/repos/{owner}/{repo}/commits",
            "search_users": "/api/search/users?q=",
            "search_repositories": "/api/search/repositories?q=",
            "dashboard": "/api/dashboard/{username}",
            "ai_analysis": "POST /api/analysis/{username}",
        },
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
