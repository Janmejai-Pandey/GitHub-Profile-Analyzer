import sys
from pathlib import Path

from pydantic import BaseModel

# Make the sibling `AI` package importable.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from AI.main import AIAnalysis  # noqa: E402


# ---- GitHub-facing shapes -------------------------------------------------

class UserProfile(BaseModel):
    login: str
    name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    location: str | None = None
    company: str | None = None
    email: str | None = None
    blog: str | None = None
    followers: int = 0
    following: int = 0
    public_repos: int = 0
    public_gists: int = 0
    html_url: str | None = None
    created_at: str | None = None


class RepoSummary(BaseModel):
    name: str
    full_name: str
    description: str | None = None
    html_url: str
    language: str | None = None
    stargazers_count: int = 0
    forks_count: int = 0
    open_issues_count: int = 0
    size: int = 0
    created_at: str | None = None
    updated_at: str | None = None
    pushed_at: str | None = None
    fork: bool = False
    archived: bool = False


class GitHubUserRef(BaseModel):
    login: str
    id: int
    avatar_url: str | None = None
    html_url: str | None = None
    type: str | None = None


class Contributor(GitHubUserRef):
    contributions: int = 0


class CommitAuthor(BaseModel):
    name: str | None = None
    email: str | None = None
    date: str | None = None


class CommitDetail(BaseModel):
    author: CommitAuthor | None = None
    committer: CommitAuthor | None = None
    message: str | None = None


class Commit(BaseModel):
    sha: str
    html_url: str | None = None
    commit: CommitDetail
    author: GitHubUserRef | None = None
    committer: GitHubUserRef | None = None


class SearchUsersResult(BaseModel):
    total_count: int
    incomplete_results: bool
    items: list[GitHubUserRef]


class SearchRepositoriesResult(BaseModel):
    total_count: int
    incomplete_results: bool
    items: list[RepoSummary]


# ---- Our own computed/composite shapes ------------------------------------

class DashboardStats(BaseModel):
    username: str
    total_public_repos: int
    repos_analyzed: int
    total_stars: int
    total_forks: int
    top_languages: list[dict]
    most_starred_repo: RepoSummary | None = None
    most_forked_repo: RepoSummary | None = None
    recently_updated_repos: list[RepoSummary]
    followers: int
    following: int


class AnalysisResponse(BaseModel):
    username: str
    analysis: AIAnalysis  # defined in AI/main.py, re-used here as-is

class ContributedRepository(BaseModel):
    name: str
    owner: str
    full_name: str
    description: str | None = None
    role: str
    stars: int = 0
    language: str | None = None
    contributions_count: int = 0
    url: str


class SuggestedRepoToContribute(BaseModel):
    full_name: str
    description: str | None = None
    language: str | None = None
    stars: int = 0
    open_issues: int = 0
    good_first_issues: int = 0
    match_reason: str
    html_url: str


class ContributionsResponse(BaseModel):
    username: str
    total_external_contributions: int = 0
    pull_requests_merged: int = 0
    issues_opened: int = 0
    code_reviews: int = 0
    external_repos_count: int = 0
    community_rank: str
    is_mock: bool = False
    contributed_repositories: list[ContributedRepository] = []
    suggested_repos_to_contribute: list[SuggestedRepoToContribute] = []

class ErrorResponse(BaseModel):
    """Shape of every error response in this API (4xx/5xx)."""
    detail: str
