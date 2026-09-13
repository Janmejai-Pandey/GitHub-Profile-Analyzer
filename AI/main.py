import os
import json

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field


# -----------------------------
# Load environment variables
# -----------------------------

load_dotenv()

GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")


# -----------------------------
# Groq client (built lazily)
# -----------------------------

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    """Build the Groq client on first use rather than at import time.

    This module is now imported by backend/ as a plain Python module (no
    FastAPI here anymore — that was only ever there for standalone testing).
    Raising immediately at import time if GROQ_API_KEY is missing would crash
    the whole backend on startup; raising lazily here means the backend only
    fails the one request that actually needs it, with a clear error.
    """
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is not set in .env")
        _client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )
    return _client


# -----------------------------
# Data models
# -----------------------------

class GitHubProfile(BaseModel):
    username: str
    bio: str | None = None
    followers: int = 0
    following: int = 0
    languages: dict[str, float] = Field(default_factory=dict)
    repositories: list[dict] = Field(default_factory=list)


class BestSuitedRole(BaseModel):
    role: str
    reason: str


class ProjectSuggestion(BaseModel):
    title: str
    description: str
    technologies: list[str]


class AIAnalysis(BaseModel):
    developer_summary: str
    strengths: list[str]
    best_suited_role: BestSuitedRole
    skill_gaps: list[str]
    recommendations: list[str]
    projects_to_build: list[ProjectSuggestion]
    readme_suggestions: list[str]
    resume_suggestions: list[str]


SYSTEM_PROMPT = (
    "You analyze GitHub profiles and provide "
    "evidence-based developer career recommendations."
)

RESPONSE_JSON_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "github_profile_analysis",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "developer_summary": {"type": "string"},
                "strengths": {"type": "array", "items": {"type": "string"}},
                "best_suited_role": {
                    "type": "object",
                    "properties": {
                        "role": {"type": "string"},
                        "reason": {"type": "string"},
                    },
                    "required": ["role", "reason"],
                    "additionalProperties": False,
                },
                "skill_gaps": {"type": "array", "items": {"type": "string"}},
                "recommendations": {"type": "array", "items": {"type": "string"}},
                "projects_to_build": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "description": {"type": "string"},
                            "technologies": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                        "required": ["title", "description", "technologies"],
                        "additionalProperties": False,
                    },
                },
                "readme_suggestions": {"type": "array", "items": {"type": "string"}},
                "resume_suggestions": {"type": "array", "items": {"type": "string"}},
            },
            "required": [
                "developer_summary",
                "strengths",
                "best_suited_role",
                "skill_gaps",
                "recommendations",
                "projects_to_build",
                "readme_suggestions",
                "resume_suggestions",
            ],
            "additionalProperties": False,
        },
    },
}


def _build_prompt(github_data: dict) -> str:
    return f"""
You are an expert software developer and career analyst.

Analyze the GitHub developer profile provided below.

Your goal is to produce useful career insights based ONLY on evidence present
in the supplied GitHub data.

STRICT EVIDENCE RULES:

1. Use only information contained in the GitHub profile data.

2. Do NOT invent skills, technologies, jobs, education, certifications,
   achievements, projects, metrics, or professional experience.

3. Do NOT assume that a technology was used just because it would be useful
   for a recommended project.

4. Clearly distinguish between:
   - demonstrated skills: directly supported by the data
   - possible areas to explore: reasonable future recommendations

5. Never create fake numbers or achievements.
   For example, do NOT say "100+ users", "100 requests per day", or
   "production experience" unless the data explicitly supports it.

6. If the profile does not provide enough evidence, say that there is
   insufficient evidence rather than guessing.

7. Recommendations should help the developer improve based on their
   demonstrated work and observable gaps.

8. Suggested projects may use new technologies, but clearly present those
   technologies as recommendations rather than existing skills.

9. For README and resume suggestions, never tell the developer to claim
   experience or achievements that are not supported by the data.

10. Keep the analysis practical, specific, and concise.

11. Absence of information is not proof of absence. If the GitHub data does
    not mention a skill, tool, README, testing, deployment, collaboration,
    or other capability, do not state that the developer lacks it.
    Use wording such as "No evidence provided..." when appropriate.

12. Do not treat stars, forks, followers, or following counts as measures of
    technical ability, collaboration skill, or professional quality.

13. Skill gaps must describe actual technical or professional development
    areas supported by the available evidence. Never use popularity metrics
    as a skill gap.

14. Do not claim that a README, tests, CI/CD, database, framework, API,
    deployment, or other feature is missing unless the input data explicitly
    provides evidence about it.

15. When suggesting a new technology or project, clearly present it as a
    recommendation or area to explore, not as an existing skill.

GITHUB PROFILE DATA:
{json.dumps(github_data, indent=2)}

Now return the analysis using the required JSON structure.
"""


def analyze_profile(profile: GitHubProfile) -> AIAnalysis:
    """Send a GitHubProfile to Groq and return a validated AIAnalysis.

    This is a plain sync function (matches the original sync OpenAI client).
    Call it via `run_in_threadpool` / `asyncio.to_thread` from async code
    (e.g. a FastAPI route) so the blocking network call doesn't stall the
    event loop.
    """
    github_data = profile.model_dump()

    response = _get_client().chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_prompt(github_data)},
        ],
        response_format=RESPONSE_JSON_SCHEMA,
    )

    analysis = json.loads(response.choices[0].message.content)
    return AIAnalysis(**analysis)


if __name__ == "__main__":
    # Quick manual smoke test without FastAPI: `python main.py`
    # (needs GROQ_API_KEY set in AI/.env)
    sample = GitHubProfile(
        username="octocat",
        bio="Just an octocat.",
        followers=5000,
        following=10,
        languages={"Python": 60.0, "JavaScript": 40.0},
        repositories=[
            {
                "name": "Hello-World",
                "description": "My first repository",
                "language": "Python",
                "stargazers_count": 100,
                "forks_count": 20,
            }
        ],
    )
    result = analyze_profile(sample)
    print(result.model_dump_json(indent=2))
