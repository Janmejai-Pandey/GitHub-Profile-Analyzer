import os
import json

from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from pydantic import BaseModel, Field


# -----------------------------
# Load environment variables
# -----------------------------

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is not set in .env")


# -----------------------------
# Groq client
# -----------------------------

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)


# -----------------------------
# FastAPI application
# -----------------------------

app = FastAPI(
    title="GitHub Profile Analyzer AI"
)


# -----------------------------
# Input data model
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


class AnalysisResponse(BaseModel):
    username: str
    analysis: AIAnalysis

# -----------------------------
# Health check
# -----------------------------

@app.get("/")
def root():
    return {
        "message": "GitHub Profile Analyzer AI is running"
    }


# -----------------------------
# AI analysis endpoint
# -----------------------------

@app.post("/analyze", response_model=AnalysisResponse)
def analyze_profile(profile: GitHubProfile):

    github_data = profile.model_dump()

    prompt = f"""
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

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You analyze GitHub profiles and provide "
                    "evidence-based developer career recommendations."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "github_profile_analysis",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "developer_summary": {
                            "type": "string"
                        },
                        "strengths": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "best_suited_role": {
                            "type": "object",
                            "properties": {
                                "role": {
                                    "type": "string"
                                },
                                "reason": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "role",
                                "reason"
                            ],
                            "additionalProperties": False
                        },
                        "skill_gaps": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "recommendations": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "projects_to_build": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {
                                        "type": "string"
                                    },
                                    "description": {
                                        "type": "string"
                                    },
                                    "technologies": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "required": [
                                    "title",
                                    "description",
                                    "technologies"
                                ],
                                "additionalProperties": False
                            }
                        },
                        "readme_suggestions": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "resume_suggestions": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    },
                    "required": [
                        "developer_summary",
                        "strengths",
                        "best_suited_role",
                        "skill_gaps",
                        "recommendations",
                        "projects_to_build",
                        "readme_suggestions",
                        "resume_suggestions"
                    ],
                    "additionalProperties": False
                }
            }
        }
    )

    analysis = json.loads(
        response.choices[0].message.content
    )

    return {
        "username": profile.username,
        "analysis": analysis
    }