// src/services/api.js
//
// Central place for all backend calls.
// Toggle USE_MOCK to false once your FastAPI backend is running on localhost:8000.

const BASE_URL = "http://localhost:8000";
const USE_MOCK = true; // <-- set to false when backend is ready

// ---------- Mock data (matches API_CONTRACT.md shapes) ----------
const mockProfile = {
  login: "torvalds",
  name: "Linus Torvalds",
  avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
  bio: "Creator of Linux and Git",
  location: "Portland, OR",
  company: "Linux Foundation",
  email: null,
  blog: "",
  followers: 210000,
  following: 0,
  public_repos: 6,
  public_gists: 0,
  html_url: "https://github.com/torvalds",
  created_at: "2011-09-03T15:26:22Z",
};

const mockRepos = [
  {
    name: "linux",
    full_name: "torvalds/linux",
    description: "Linux kernel source tree",
    html_url: "https://github.com/torvalds/linux",
    language: "C",
    stargazers_count: 185000,
    forks_count: 54000,
    open_issues_count: 300,
    size: 4500000,
    created_at: "2011-09-04T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
    pushed_at: "2024-05-01T00:00:00Z",
    fork: false,
    archived: false,
  },
  {
    name: "subsurface",
    full_name: "torvalds/subsurface",
    description: "Divelog software",
    html_url: "https://github.com/torvalds/subsurface",
    language: "C++",
    stargazers_count: 2200,
    forks_count: 300,
    open_issues_count: 20,
    size: 80000,
    created_at: "2012-01-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
    pushed_at: "2024-03-01T00:00:00Z",
    fork: false,
    archived: false,
  },
];

const mockDashboard = {
  username: "torvalds",
  total_public_repos: 6,
  repos_analyzed: 6,
  total_stars: 187200,
  total_forks: 54300,
  top_languages: [
    { language: "C", repo_count: 3 },
    { language: "C++", repo_count: 1 },
    { language: "Shell", repo_count: 2 },
  ],
  most_starred_repo: mockRepos[0],
  most_forked_repo: mockRepos[0],
  recently_updated_repos: mockRepos,
  followers: 210000,
  following: 0,
};

const mockAnalysis = {
  username: "torvalds",
  summary:
    "A systems-level engineer with deep expertise in low-level programming and large-scale open-source project maintenance.",
  strengths: ["Kernel-level programming", "Distributed version control design", "Long-term project stewardship"],
  suggested_technologies: ["Rust", "eBPF"],
  raw_stats: mockDashboard,
};

// ---------- Helper ----------
async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ---------- Public API functions ----------

export async function getProfile(username) {
  if (USE_MOCK) return delay(mockProfile);
  return request(`/api/profile/${username}`);
}

export async function getFollowers(username, page = 1, per_page = 30) {
  if (USE_MOCK) return delay([]);
  return request(`/api/profile/${username}/followers?page=${page}&per_page=${per_page}`);
}

export async function getRepos(username, { page = 1, per_page = 30, sort = "updated" } = {}) {
  if (USE_MOCK) {
    const sorted = [...mockRepos].sort((a, b) => {
      if (sort === "full_name") return a.full_name.localeCompare(b.full_name);
      if (sort === "created") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      // default: "updated"
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    return delay(sorted);
  }
  return request(`/api/repos/${username}?page=${page}&per_page=${per_page}&sort=${sort}`);
}

export async function getRepoLanguages(owner, repo) {
  if (USE_MOCK) return delay({ C: 480000, Shell: 12000 });
  return request(`/api/repos/${owner}/${repo}/languages`);
}

export async function getDashboard(username) {
  if (USE_MOCK) return delay(mockDashboard);
  return request(`/api/dashboard/${username}`);
}

export async function getAIAnalysis(username) {
  if (USE_MOCK) return delay(mockAnalysis, 1200); // simulate slower AI call
  const res = await fetch(`${BASE_URL}/api/analysis/${username}`, { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function searchUsers(query, page = 1, per_page = 30) {
  if (USE_MOCK) return delay({ total_count: 0, incomplete_results: false, items: [] });
  return request(`/api/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`);
}

// Simulates network latency for mock mode so loading states feel real
function delay(data, ms = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}