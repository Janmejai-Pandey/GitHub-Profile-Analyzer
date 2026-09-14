import httpx
from fastapi import HTTPException

from backend.config import get_settings

settings = get_settings()


class GitHubClient:
    """Thin async wrapper around the GitHub REST API.

    Handles auth headers, pagination params, and translates GitHub's
    error responses (404, rate limit, etc.) into FastAPI HTTPExceptions
    so every route in routes.py gets consistent error behavior for free.
    """

    def __init__(self) -> None:
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if settings.GITHUB_TOKEN:
            headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
        self._client = httpx.AsyncClient(
            base_url=settings.GITHUB_API_BASE, headers=headers, timeout=15.0
        )

    async def close(self) -> None:
        await self._client.aclose()

    async def _get(self, path: str, params: dict | None = None) -> httpx.Response:
        response = await self._client.get(path, params=params)

        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"GitHub resource not found: {path}")

        if response.status_code == 403 and response.headers.get("X-RateLimit-Remaining") == "0":
            reset = response.headers.get("X-RateLimit-Reset")
            raise HTTPException(
                status_code=429,
                detail=(
                    f"GitHub API rate limit exceeded. Resets at unix timestamp {reset}. "
                    "Set a GITHUB_TOKEN env var to raise the limit."
                ),
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"GitHub API error for {path}: {response.text}",
            )

        return response

    @staticmethod
    def _pagination(page: int, per_page: int) -> dict:
        return {"page": page, "per_page": min(per_page, settings.MAX_PER_PAGE)}

    # ---- Users --------------------------------------------------------

    async def get_user(self, username: str) -> dict:
        return (await self._get(f"/users/{username}")).json()

    async def get_followers(self, username: str, page: int, per_page: int) -> list[dict]:
        return (await self._get(f"/users/{username}/followers", self._pagination(page, per_page))).json()

    async def get_following(self, username: str, page: int, per_page: int) -> list[dict]:
        return (await self._get(f"/users/{username}/following", self._pagination(page, per_page))).json()

    # ---- Repos ----------------------------------------------------------

    async def get_user_repos(self, username: str, page: int, per_page: int, sort: str = "updated") -> list[dict]:
        params = self._pagination(page, per_page)
        params["sort"] = sort
        return (await self._get(f"/users/{username}/repos", params)).json()

    async def get_all_user_repos(self, username: str, max_repos: int) -> list[dict]:
        """Paginate through a user's repos up to max_repos (used by the
        dashboard and AI-analysis aggregation)."""
        repos: list[dict] = []
        page = 1
        per_page = min(100, max_repos)
        while len(repos) < max_repos:
            batch = await self.get_user_repos(username, page=page, per_page=per_page)
            if not batch:
                break
            repos.extend(batch)
            if len(batch) < per_page:
                break
            page += 1
        return repos[:max_repos]

    async def get_repo(self, owner: str, repo: str) -> dict:
        return (await self._get(f"/repos/{owner}/{repo}")).json()

    async def get_repo_languages(self, owner: str, repo: str) -> dict:
        return (await self._get(f"/repos/{owner}/{repo}/languages")).json()

    async def get_repo_contributors(self, owner: str, repo: str, page: int, per_page: int) -> list[dict]:
        return (await self._get(f"/repos/{owner}/{repo}/contributors", self._pagination(page, per_page))).json()

    async def get_repo_commits(self, owner: str, repo: str, page: int, per_page: int) -> list[dict]:
        return (await self._get(f"/repos/{owner}/{repo}/commits", self._pagination(page, per_page))).json()

    # ---- Search -----------------------------------------------------------

    async def search_users(self, query: str, page: int, per_page: int) -> dict:
        params = self._pagination(page, per_page)
        params["q"] = query
        return (await self._get("/search/users", params)).json()

    async def search_repositories(self, query: str, page: int, per_page: int) -> dict:
        params = self._pagination(page, per_page)
        params["q"] = query
        return (await self._get("/search/repositories", params)).json()
    
    async def search_issues(self, query: str, page: int, per_page: int) -> dict:
        """Searches issues AND pull requests (GitHub treats PRs as issues
        for search purposes) — e.g. `is:pr is:merged author:USERNAME` or
        `is:pr reviewed-by:USERNAME`."""
        params = self._pagination(page, per_page)
        params["q"] = query
        return (await self._get("/search/issues", params)).json()


# One shared client instance, opened at import time and closed via the
# FastAPI lifespan hook in main.py.
github_client = GitHubClient()
