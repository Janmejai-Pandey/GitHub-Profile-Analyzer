const BASE_URL = "http://localhost:8000";
export let USE_MOCK = false;

// ============================================================================
// Multi-Profile Mock Data
// ============================================================================

const mockDataByUser = {
  torvalds: {
    profile: {
      login: "torvalds",
      name: "Linus Torvalds",
      avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
      bio: "Creator of Linux and Git. Advocate of open standards and pragmatic software engineering.",
      location: "Portland, OR",
      company: "Linux Foundation",
      email: null,
      blog: "https://kernel.org",
      followers: 212500,
      following: 0,
      public_repos: 7,
      public_gists: 0,
      html_url: "https://github.com/torvalds",
      created_at: "2011-09-03T15:26:22Z",
    },
    repos: [
      {
        name: "linux",
        full_name: "torvalds/linux",
        description: "Linux kernel source tree",
        html_url: "https://github.com/torvalds/linux",
        language: "C",
        stargazers_count: 185200,
        forks_count: 54100,
        open_issues_count: 310,
        size: 4500000,
        created_at: "2011-09-04T00:00:00Z",
        updated_at: "2024-05-01T12:00:00Z",
        pushed_at: "2024-05-01T12:00:00Z",
        fork: false,
        archived: false,
      },
      {
        name: "subsurface",
        full_name: "torvalds/subsurface",
        description: "Divelog software for desktop and mobile",
        html_url: "https://github.com/torvalds/subsurface",
        language: "C++",
        stargazers_count: 2240,
        forks_count: 320,
        open_issues_count: 22,
        size: 80000,
        created_at: "2012-01-01T00:00:00Z",
        updated_at: "2024-03-01T10:00:00Z",
        pushed_at: "2024-03-01T10:00:00Z",
        fork: false,
        archived: false,
      },
      {
        name: "pesconvert",
        full_name: "torvalds/pesconvert",
        description: "Convert Brother embroidery format PES files to SVG vector paths",
        html_url: "https://github.com/torvalds/pesconvert",
        language: "C",
        stargazers_count: 1450,
        forks_count: 180,
        open_issues_count: 5,
        size: 1200,
        created_at: "2013-05-10T00:00:00Z",
        updated_at: "2023-11-14T08:00:00Z",
        pushed_at: "2023-11-14T08:00:00Z",
        fork: false,
        archived: false,
      },
      {
        name: "test-tlb",
        full_name: "torvalds/test-tlb",
        description: "Micro-benchmarking Translation Lookaside Buffer performance in SMP kernels",
        html_url: "https://github.com/torvalds/test-tlb",
        language: "C",
        stargazers_count: 980,
        forks_count: 110,
        open_issues_count: 2,
        size: 540,
        created_at: "2014-08-20T00:00:00Z",
        updated_at: "2023-08-10T14:00:00Z",
        pushed_at: "2023-08-10T14:00:00Z",
        fork: false,
        archived: false,
      },
      {
        name: "libdivecomputer",
        full_name: "torvalds/libdivecomputer",
        description: "Cross-platform library for communicating with various dive computers",
        html_url: "https://github.com/torvalds/libdivecomputer",
        language: "C",
        stargazers_count: 420,
        forks_count: 95,
        open_issues_count: 4,
        size: 3200,
        created_at: "2015-02-14T00:00:00Z",
        updated_at: "2024-01-20T16:00:00Z",
        pushed_at: "2024-01-20T16:00:00Z",
        fork: true,
        archived: false,
      },
      {
        name: "uemacs",
        full_name: "torvalds/uemacs",
        description: "MicroEMACS text editor variant maintained for Linux kernel development",
        html_url: "https://github.com/torvalds/uemacs",
        language: "C",
        stargazers_count: 1210,
        forks_count: 215,
        open_issues_count: 9,
        size: 1980,
        created_at: "2014-04-01T00:00:00Z",
        updated_at: "2023-12-05T09:00:00Z",
        pushed_at: "2023-12-05T09:00:00Z",
        fork: false,
        archived: false,
      },
    ],
    followers: [
      { login: "antirez", id: 6599, avatar_url: "https://avatars.githubusercontent.com/u/6599?v=4", html_url: "https://github.com/antirez", type: "User", name: "Salvatore Sanfilippo" },
      { login: "gaearon", id: 810438, avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4", html_url: "https://github.com/gaearon", type: "User", name: "Dan Abramov" },
      { login: "kelseyhightower", id: 1120000, avatar_url: "https://avatars.githubusercontent.com/u/1120000?v=4", html_url: "https://github.com/kelseyhightower", type: "User", name: "Kelsey Hightower" },
      { login: "addyosmani", id: 110953, avatar_url: "https://avatars.githubusercontent.com/u/110953?v=4", html_url: "https://github.com/addyosmani", type: "User", name: "Addy Osmani" },
      { login: "shadcn", id: 124599, avatar_url: "https://avatars.githubusercontent.com/u/124599?v=4", html_url: "https://github.com/shadcn", type: "User", name: "shadcn" },
    ],
    following: [],
    openSource: {
      username: "torvalds",
      total_external_contributions: 312,
      pull_requests_merged: 184,
      issues_opened: 42,
      code_reviews: 86,
      external_repos_count: 18,
      community_rank: "Top 0.01% Global Contributor",
      is_mock: true,
      contributed_repositories: [
        {
          name: "git",
          owner: "git",
          full_name: "git/git",
          description: "Fast, scalable, distributed revision control system",
          role: "Original Author & Architect",
          stars: 52400,
          language: "C",
          contributions_count: 945,
          url: "https://github.com/git/git",
        },
        {
          name: "gcc",
          owner: "gcc-mirror",
          full_name: "gcc-mirror/gcc",
          description: "GNU Compiler Collection mirror for kernel toolchain compatibility",
          role: "Toolchain Feedback & Patches",
          stars: 5800,
          language: "C++",
          contributions_count: 28,
          url: "https://github.com/gcc-mirror/gcc",
        },
        {
          name: "sparse",
          owner: "pensarno",
          full_name: "pensarno/sparse",
          description: "Semantic parser for C designed for static analysis of kernel sources",
          role: "Original Designer",
          stars: 1200,
          language: "C",
          contributions_count: 67,
          url: "https://github.com/pensarno/sparse",
        },
      ],
      suggested_repos_to_contribute: [
        {
          full_name: "rust-lang/rust",
          description: "Empowering everyone to build reliable and efficient software with memory safety",
          language: "Rust",
          stars: 101000,
          open_issues: 9400,
          good_first_issues: 42,
          match_reason: "High synergy with Rust-for-Linux integration efforts",
          html_url: "https://github.com/rust-lang/rust",
        },
        {
          full_name: "neovim/neovim",
          description: "Vim-fork focused on extensibility, asynchronous I/O and modern usability",
          language: "C",
          stars: 86000,
          open_issues: 1200,
          good_first_issues: 18,
          match_reason: "Matches your deep C & low-level buffer management background",
          html_url: "https://github.com/neovim/neovim",
        },
        {
          full_name: "iovisor/bcc",
          description: "BPF Compiler Collection for tracing kernel execution and system performance",
          language: "C",
          stars: 19500,
          open_issues: 420,
          good_first_issues: 12,
          match_reason: "Directly relates to Linux kernel tracing & observability",
          html_url: "https://github.com/iovisor/bcc",
        },
      ],
    },
    aiAnalysis: {
      username: "torvalds",
      summary:
        "A foundational systems engineer and master steward of distributed systems with unparalleled depth in OS kernel architecture, multi-threading synchronization, and open-source governance.",
      strengths: [
        "Kernel-level architecture & C memory management",
        "Distributed version control protocol design",
        "Large-scale asynchronous collaborative maintainership",
        "Zero-overhead low-latency algorithmic design",
      ],
      suggested_technologies: ["Rust", "eBPF", "WebAssembly (Wasm)"],
      best_suited_role: {
        role: "Principal Systems Architect / Chief Linux Kernel Maintainer",
        reason:
          "Demonstrated multi-decade track record leading the world's most critical open-source operating system with thousands of contributors.",
      },
      skill_gaps: [
        "Limited observable usage of modern memory-safe languages (Rust/Zig) in primary public repositories",
        "No automated cloud-native CI/CD test manifests (GitHub Actions) on legacy codebase forks",
      ],
      recommendations: [
        "Incorporate Rust modules and safety boundaries into secondary utilities to exemplify modern systems patterns",
        "Configure automated fuzzing workflows and GitHub Actions matrices for cross-architecture builds",
      ],
      projects_to_build: [
        {
          title: "Safe Bare-Metal Microkernel in Rust",
          description:
            "A lightweight async microkernel exploring formal verification and memory safety on x86_64 and RISC-V architectures.",
          technologies: ["Rust", "RISC-V", "x86_64 Assembly"],
        },
        {
          title: "eBPF Kernel Tracing & Visualization Engine",
          description:
            "A zero-overhead daemon utilizing eBPF probes to profile cache misses and lock contention in real-time.",
          technologies: ["C", "eBPF", "WebAssembly"],
        },
      ],
      readme_suggestions: [
        "Add a visual architecture roadmap summarizing the Linux release schedule and subsystem branches",
        "Showcase community guidelines and patch-submission conventions prominently in a pinned repository",
        "Incorporate dynamic CI status badges and release metrics to streamline contributor onboarding",
      ],
      resume_suggestions: [
        "Architected and governed the Linux kernel codebase (185k+ GitHub stars, 54k+ forks), coordinating 15,000+ global patch submissions annually.",
        "Invented Git distributed version control system, redefining modern software engineering collaboration globally.",
        "Engineered multi-threaded cross-platform divelog and peripheral communication suite (Subsurface) using C++ and Qt.",
      ],
    },
  },

  gaearon: {
    profile: {
      login: "gaearon",
      name: "Dan Abramov",
      avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4",
      bio: "Co-author of Redux and Create React App. Former React core team member. Exploring the intersection of JavaScript and mental models.",
      location: "London, UK",
      company: "@bluesky-social",
      email: null,
      blog: "https://overreacted.io",
      followers: 84300,
      following: 172,
      public_repos: 248,
      public_gists: 76,
      html_url: "https://github.com/gaearon",
      created_at: "2011-05-25T18:18:31Z",
    },
    repos: [
      {
        name: "redux",
        full_name: "reduxjs/redux",
        description: "Predictable state container for JavaScript apps",
        html_url: "https://github.com/reduxjs/redux",
        language: "TypeScript",
        stargazers_count: 60400,
        forks_count: 15300,
        open_issues_count: 12,
        size: 42000,
        created_at: "2015-05-30T00:00:00Z",
        updated_at: "2024-05-02T10:00:00Z",
        pushed_at: "2024-05-02T10:00:00Z",
        fork: false,
        archived: false,
      },
      {
        name: "create-react-app",
        full_name: "facebook/create-react-app",
        description: "Set up a modern web app by running one command",
        html_url: "https://github.com/facebook/create-react-app",
        language: "JavaScript",
        stargazers_count: 101400,
        forks_count: 26100,
        open_issues_count: 850,
        size: 198000,
        created_at: "2016-07-15T00:00:00Z",
        updated_at: "2024-04-10T12:00:00Z",
        pushed_at: "2024-04-10T12:00:00Z",
        fork: false,
        archived: true,
      },
      {
        name: "overreacted.io",
        full_name: "gaearon/overreacted.io",
        description: "Personal blog on React mental models and frontend engineering deep-dives",
        html_url: "https://github.com/gaearon/overreacted.io",
        language: "JavaScript",
        stargazers_count: 6300,
        forks_count: 980,
        open_issues_count: 18,
        size: 8900,
        created_at: "2018-11-28T00:00:00Z",
        updated_at: "2024-04-28T18:00:00Z",
        pushed_at: "2024-04-28T18:00:00Z",
        fork: false,
        archived: false,
      },
      {
        name: "react-dnd",
        full_name: "react-dnd/react-dnd",
        description: "Drag and Drop for React with pluggable backends",
        html_url: "https://github.com/react-dnd/react-dnd",
        language: "TypeScript",
        stargazers_count: 20100,
        forks_count: 2100,
        open_issues_count: 90,
        size: 34000,
        created_at: "2014-11-01T00:00:00Z",
        updated_at: "2024-03-15T08:00:00Z",
        pushed_at: "2024-03-15T08:00:00Z",
        fork: false,
        archived: false,
      },
    ],
    followers: [
      { login: "torvalds", id: 1024025, avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4", html_url: "https://github.com/torvalds", type: "User", name: "Linus Torvalds" },
      { login: "shadcn", id: 124599, avatar_url: "https://avatars.githubusercontent.com/u/124599?v=4", html_url: "https://github.com/shadcn", type: "User", name: "shadcn" },
      { login: "wesbos", id: 176013, avatar_url: "https://avatars.githubusercontent.com/u/176013?v=4", html_url: "https://github.com/wesbos", type: "User", name: "Wes Bos" },
    ],
    following: [
      { login: "sophiebits", id: 55219, avatar_url: "https://avatars.githubusercontent.com/u/55219?v=4", html_url: "https://github.com/sophiebits", type: "User", name: "Sophie Alpert" },
      { login: "acdlite", id: 3624098, avatar_url: "https://avatars.githubusercontent.com/u/3624098?v=4", html_url: "https://github.com/acdlite", type: "User", name: "Andrew Clark" },
    ],
    openSource: {
      username: "gaearon",
      total_external_contributions: 580,
      pull_requests_merged: 420,
      issues_opened: 94,
      code_reviews: 195,
      external_repos_count: 36,
      community_rank: "Top 0.05% Frontend Influencer",
      is_mock: true,
      contributed_repositories: [
        {
          name: "react",
          owner: "facebook",
          full_name: "facebook/react",
          description: "The library for web and native user interfaces",
          role: "Core Maintainer & Documentation Lead",
          stars: 224000,
          language: "JavaScript",
          contributions_count: 1420,
          url: "https://github.com/facebook/react",
        },
        {
          name: "bluesky",
          owner: "bluesky-social",
          full_name: "bluesky-social/social-app",
          description: "Bluesky Social open AT protocol client app",
          role: "Core Contributor",
          stars: 14500,
          language: "TypeScript",
          contributions_count: 88,
          url: "https://github.com/bluesky-social/social-app",
        },
      ],
      suggested_repos_to_contribute: [
        {
          full_name: "vercel/next.js",
          description: "The React Framework for the Web with App Router and Server Components",
          language: "TypeScript",
          stars: 122000,
          open_issues: 2400,
          good_first_issues: 45,
          match_reason: "Direct fit with your React Server Components & client hydration expertise",
          html_url: "https://github.com/vercel/next.js",
        },
        {
          full_name: "bluesky-social/atproto",
          description: "Social networking protocol specification and reference implementation",
          language: "TypeScript",
          stars: 8900,
          open_issues: 140,
          good_first_issues: 12,
          match_reason: "High affinity with your decentralized social architecture focus",
          html_url: "https://github.com/bluesky-social/atproto",
        },
      ],
    },
    aiAnalysis: {
      username: "gaearon",
      summary:
        "World-renowned frontend architect and developer advocate who shaped modern state management and component mental models across the global JavaScript ecosystem.",
      strengths: [
        "State management architecture (Redux, React Context, RSC)",
        "Exceptional technical documentation & mental model explanation",
        "API ergonomics & developer experience (DX) design",
        "Ecosystem bootstrapping and zero-config tooling (CRA)",
      ],
      suggested_technologies: ["AT Protocol", "Rust for tooling", "SQLite on WASM"],
      best_suited_role: {
        role: "Principal Frontend Architect / Chief Developer Experience Officer",
        reason:
          "Proven creator of ubiquitous frontend developer tools used by millions of engineers with deep expertise in UI architectures.",
      },
      skill_gaps: [
        "Backend cloud infrastructure pipelines (Kubernetes / AWS IAM) are rarely represented in public code",
        "Low-level systems programming languages (C/Rust) underrepresented relative to JS/TS tooling",
      ],
      recommendations: [
        "Experiment with Rust-based AST transforms or bundling plugins to bridge high-performance tooling",
        "Expand work on decentralized protocols (ATProto) into multi-tier distributed storage designs",
      ],
      projects_to_build: [
        {
          title: "Local-First State Synchronization Engine with CRDTs",
          description:
            "A lightweight TypeScript library exploring conflict-free replicated data types for peer-to-peer collaborative React apps.",
          technologies: ["TypeScript", "CRDTs", "IndexedDB"],
        },
        {
          title: "Interactive React Internals Visualizer",
          description:
            "An educational canvas tool rendering fiber reconciliation phases, concurrent transitions, and lane priority.",
          technologies: ["React", "HTML5 Canvas", "Tailwind CSS"],
        },
      ],
      readme_suggestions: [
        "Include an 'Essays & Mental Models' directory linking to foundational articles on overreacted.io",
        "Highlight your current work with AT Protocol and decentralized social frameworks",
        "Pin top community-facing repositories with quick links to interactive CodeSandbox playgrounds",
      ],
      resume_suggestions: [
        "Created Redux (60k+ GitHub stars), standardizing immutable global state management across millions of enterprise React applications.",
        "Led developer experience on the React core team at Meta, authoring official documentation and introducing React Hooks mental models.",
        "Spearheaded Create React App (100k+ stars), abstracting Webpack/Babel toolchains to onboard over 1M+ developers into modern web development.",
      ],
    },
  },

  shadcn: {
    profile: {
      login: "shadcn",
      name: "shadcn",
      avatar_url: "https://avatars.githubusercontent.com/u/124599?v=4",
      bio: "Building accessible, customizable UI components and developer tools. Creator of shadcn/ui.",
      location: "San Francisco, CA",
      company: "@vercel",
      email: null,
      blog: "https://ui.shadcn.com",
      followers: 78900,
      following: 84,
      public_repos: 42,
      public_gists: 15,
      html_url: "https://github.com/shadcn",
      created_at: "2012-02-10T12:00:00Z",
    },
    repos: [
      {
        name: "ui",
        full_name: "shadcn/ui",
        description: "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
        html_url: "https://github.com/shadcn/ui",
        language: "TypeScript",
        stargazers_count: 72400,
        forks_count: 6200,
        open_issues_count: 140,
        size: 58000,
        created_at: "2023-01-20T00:00:00Z",
        updated_at: "2024-05-02T14:00:00Z",
        pushed_at: "2024-05-02T14:00:00Z",
        fork: false,
        archived: false,
      },
      {
        name: "taxonomy",
        full_name: "shadcn/taxonomy",
        description: "An open source application built using the new router, server components and everything new in Next.js 13.",
        html_url: "https://github.com/shadcn/taxonomy",
        language: "TypeScript",
        stargazers_count: 17800,
        forks_count: 2400,
        open_issues_count: 35,
        size: 24000,
        created_at: "2022-10-25T00:00:00Z",
        updated_at: "2024-04-18T16:00:00Z",
        pushed_at: "2024-04-18T16:00:00Z",
        fork: false,
        archived: false,
      },
    ],
    followers: [
      { login: "gaearon", id: 810438, avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4", html_url: "https://github.com/gaearon", type: "User", name: "Dan Abramov" },
      { login: "leerob", id: 9113740, avatar_url: "https://avatars.githubusercontent.com/u/9113740?v=4", html_url: "https://github.com/leerob", type: "User", name: "Lee Robinson" },
    ],
    following: [
      { login: "rauchg", id: 13041, avatar_url: "https://avatars.githubusercontent.com/u/13041?v=4", html_url: "https://github.com/rauchg", type: "User", name: "Guillermo Rauch" },
    ],
    openSource: {
      username: "shadcn",
      total_external_contributions: 420,
      pull_requests_merged: 310,
      issues_opened: 65,
      code_reviews: 140,
      external_repos_count: 28,
      community_rank: "Top 0.01% UI Innovator",
      is_mock: true,
      contributed_repositories: [
        {
          name: "radix-primitives",
          owner: "radix-ui",
          full_name: "radix-ui/primitives",
          description: "Unstyled, accessible components for building high‑quality design systems and web apps",
          role: "Core Contributor & Integration Partner",
          stars: 15400,
          language: "TypeScript",
          contributions_count: 94,
          url: "https://github.com/radix-ui/primitives",
        },
      ],
      suggested_repos_to_contribute: [
        {
          full_name: "tailwindlabs/tailwindcss",
          description: "A utility-first CSS framework for rapid UI development",
          language: "JavaScript",
          stars: 79000,
          open_issues: 620,
          good_first_issues: 22,
          match_reason: "Direct synergy with Tailwind CSS design tokens and component extraction",
          html_url: "https://github.com/tailwindlabs/tailwindcss",
        },
      ],
    },
    aiAnalysis: {
      username: "shadcn",
      summary:
        "Visionary design engineer who transformed web component architecture by pioneering copy-paste CLI distribution, accessible primitives, and modern aesthetic standards.",
      strengths: [
        "Design systems & accessible component ergonomics (Radix / Tailwind)",
        "CLI-driven code distribution and AST codemods",
        "Next.js App Router and Server Actions mastery",
      ],
      suggested_technologies: ["Framer Motion 3D", "Tailwind v4 Oxide", "React 19 Server Actions"],
      best_suited_role: {
        role: "Head of Design Engineering / Principal UI Architect",
        reason:
          "Redefined modern frontend design engineering with the fastest-growing UI component library in open-source history.",
      },
      skill_gaps: [
        "Heavy reliance on TypeScript/React without public backend microservice architecture",
      ],
      recommendations: [
        "Document custom CLI AST parsing internals to teach advanced codemod engineering",
      ],
      projects_to_build: [
        {
          title: "AI Component Generator CLI",
          description:
            "A terminal utility converting natural language prompts directly into accessible shadcn-compliant TSX components.",
          technologies: ["TypeScript", "Node.js", "Tailwind CSS"],
        },
      ],
      readme_suggestions: [
        "Highlight the architectural philosophy of 'own your code' vs npm dependency wrappers",
      ],
      resume_suggestions: [
        "Engineered and launched shadcn/ui (72k+ GitHub stars), creating the de-facto UI component standard across the modern React ecosystem.",
      ],
    },
  },
};

// Generates dynamic mock data for any arbitrary username typed into the search bar
function generateDynamicMock(username) {
  const cleanUser = username.trim().replace(/^@/, '');
  const capitalized = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
  const hash = Array.from(cleanUser).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const repoCount = (hash % 18) + 4;
  const starsCount = (hash * 37) % 3500 + 120;
  const forksCount = Math.floor(starsCount * 0.28);
  const followersCount = (hash * 42) % 4200 + 45;

  const mockRepos = [
    {
      name: `${cleanUser}-toolkit`,
      full_name: `${cleanUser}/${cleanUser}-toolkit`,
      description: `Modern utility libraries, CLI tools, and development helpers crafted in TypeScript`,
      html_url: `https://github.com/${cleanUser}/${cleanUser}-toolkit`,
      language: "TypeScript",
      stargazers_count: Math.floor(starsCount * 0.6),
      forks_count: Math.floor(forksCount * 0.5),
      open_issues_count: 4,
      size: 4800,
      created_at: "2023-01-15T00:00:00Z",
      updated_at: "2024-04-20T10:00:00Z",
      pushed_at: "2024-04-20T10:00:00Z",
      fork: false,
      archived: false,
    },
    {
      name: "awesome-dev-stack",
      full_name: `${cleanUser}/awesome-dev-stack`,
      description: `Curated resources, architecture patterns, and production recipes for full-stack developers`,
      html_url: `https://github.com/${cleanUser}/awesome-dev-stack`,
      language: "Markdown",
      stargazers_count: Math.floor(starsCount * 0.25),
      forks_count: Math.floor(forksCount * 0.3),
      open_issues_count: 2,
      size: 1200,
      created_at: "2023-06-10T00:00:00Z",
      updated_at: "2024-03-12T14:00:00Z",
      pushed_at: "2024-03-12T14:00:00Z",
      fork: false,
      archived: false,
    },
    {
      name: "api-microservice",
      full_name: `${cleanUser}/api-microservice`,
      description: `High-throughput REST and GraphQL backend services featuring Dockerized container setup`,
      html_url: `https://github.com/${cleanUser}/api-microservice`,
      language: "Python",
      stargazers_count: Math.floor(starsCount * 0.15),
      forks_count: Math.floor(forksCount * 0.2),
      open_issues_count: 1,
      size: 8900,
      created_at: "2023-09-01T00:00:00Z",
      updated_at: "2024-02-28T18:00:00Z",
      pushed_at: "2024-02-28T18:00:00Z",
      fork: false,
      archived: false,
    },
  ];

  return {
    profile: {
      login: cleanUser,
      name: `${capitalized} Developer`,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      bio: `Software engineer passionate about scalable architectures, open-source tooling, and full-stack web applications.`,
      location: "San Francisco, CA",
      company: `@${cleanUser}-labs`,
      email: `${cleanUser}@example.dev`,
      blog: `https://${cleanUser}.dev`,
      followers: followersCount,
      following: 42,
      public_repos: repoCount,
      public_gists: 3,
      html_url: `https://github.com/${cleanUser}`,
      created_at: "2022-04-12T10:00:00Z",
    },
    repos: mockRepos,
    followers: [
      { login: "torvalds", id: 1024025, avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4", html_url: "https://github.com/torvalds", type: "User", name: "Linus Torvalds" },
      { login: "gaearon", id: 810438, avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4", html_url: "https://github.com/gaearon", type: "User", name: "Dan Abramov" },
    ],
    following: [
      { login: "shadcn", id: 124599, avatar_url: "https://avatars.githubusercontent.com/u/124599?v=4", html_url: "https://github.com/shadcn", type: "User", name: "shadcn" },
    ],
    openSource: {
      username: cleanUser,
      total_external_contributions: 38,
      pull_requests_merged: 24,
      issues_opened: 10,
      code_reviews: 14,
      external_repos_count: 6,
      community_rank: "Active Open-Source Contributor",
      is_mock: true,
      contributed_repositories: [
        {
          name: "vite",
          owner: "vitejs",
          full_name: "vitejs/vite",
          description: "Next Generation Frontend Tooling",
          role: "Documentation & Bugfix Contributor",
          stars: 67000,
          language: "TypeScript",
          contributions_count: 6,
          url: "https://github.com/vitejs/vite",
        },
        {
          name: "fastapi",
          owner: "tiangolo",
          full_name: "tiangolo/fastapi",
          description: "FastAPI framework, high performance, easy to learn, fast to code",
          role: "Feature PR Contributor",
          stars: 72000,
          language: "Python",
          contributions_count: 4,
          url: "https://github.com/tiangolo/fastapi",
        },
      ],
      suggested_repos_to_contribute: [
        {
          full_name: "tailwindlabs/tailwindcss",
          description: "A utility-first CSS framework for rapid UI development",
          language: "JavaScript",
          stars: 79000,
          open_issues: 620,
          good_first_issues: 22,
          match_reason: "High affinity with your modern frontend component stack",
          html_url: "https://github.com/tailwindlabs/tailwindcss",
        },
        {
          full_name: "pydantic/pydantic",
          description: "Data validation using Python type hints",
          language: "Python",
          stars: 21000,
          open_issues: 380,
          good_first_issues: 14,
          match_reason: "Matches your Python microservices and backend API experience",
          html_url: "https://github.com/pydantic/pydantic",
        },
      ],
    },
    aiAnalysis: {
      username: cleanUser,
      summary:
        `An adaptable full-stack engineer demonstrating solid command of modern TypeScript web applications, API microservices, and clean repository documentation.`,
      strengths: [
        "Full-stack web application development (React, TypeScript, Python)",
        "API microservice design and containerized deployment",
        "Clean repository structure and organized release hygiene",
      ],
      suggested_technologies: ["Next.js App Router", "Docker & Kubernetes", "FastAPI Async"],
      best_suited_role: {
        role: "Senior Full-Stack Software Engineer",
        reason:
          "Demonstrates balanced frontend and backend capability with production-oriented coding style and active open-source engagement.",
      },
      skill_gaps: [
        "Limited observable end-to-end automated testing suites (Playwright/Jest) in public repositories",
        "Could strengthen automated CI/CD deployment pipelines with preview environments",
      ],
      recommendations: [
        "Add automated unit and integration tests with coverage badges to top repositories",
        "Document architectural trade-offs and deployment diagrams in project README files",
      ],
      projects_to_build: [
        {
          title: "Real-Time Collaborative Workspace",
          description:
            "A full-stack collaborative editor using WebSockets, Redis pub/sub, and PostgreSQL with optimistic UI updates.",
          technologies: ["Next.js", "TypeScript", "FastAPI", "Redis"],
        },
        {
          title: "Cloud Infrastructure Cost Monitor",
          description:
            "A lightweight CLI and dashboard scanning multi-cloud billing APIs to detect anomalous resource provisioning.",
          technologies: ["Python", "Docker", "Tailwind CSS"],
        },
      ],
      readme_suggestions: [
        "Include an interactive demo link or live deployment badge at the top of your flagship repository",
        "Add an architecture flow diagram illustrating data pipelines between frontend and backend",
        "Add clear instructions for local environment setup with a 1-command Docker Compose run",
      ],
      resume_suggestions: [
        `Engineered and published ${cleanUser}-toolkit in TypeScript, achieving scalable utility distribution and clean modular architecture.`,
        `Developed containerized microservices handling high-throughput REST and GraphQL endpoints with automated validation.`,
        `Contributed upstream bugfixes and enhancements to prominent open-source ecosystems including Vite and FastAPI.`,
      ],
    },
  };
}

function resolveMockUser(username) {
  const key = username?.toLowerCase?.().trim();
  if (key && mockDataByUser[key]) {
    return mockDataByUser[key];
  }
  return generateDynamicMock(username || "developer");
}

function buildDashboardStats(userMock) {
  const { profile, repos } = userMock;
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  // Group languages
  const langMap = {};
  repos.forEach((r) => {
    if (r.language) {
      langMap[r.language] = (langMap[r.language] || 0) + 1;
    }
  });
  const topLanguages = Object.entries(langMap)
    .map(([language, repo_count]) => ({ language, repo_count }))
    .sort((a, b) => b.repo_count - a.repo_count);

  const sortedByStars = [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
  const sortedByForks = [...repos].sort((a, b) => (b.forks_count || 0) - (a.forks_count || 0));

  return {
    username: profile.login,
    total_public_repos: profile.public_repos,
    repos_analyzed: repos.length,
    total_stars: totalStars,
    total_forks: totalForks,
    top_languages: topLanguages.length > 0 ? topLanguages : [{ language: "TypeScript", repo_count: 1 }],
    most_starred_repo: sortedByStars[0] || null,
    most_forked_repo: sortedByForks[0] || null,
    recently_updated_repos: repos.slice(0, 5),
    followers: profile.followers,
    following: profile.following,
  };
}

// ============================================================================
// Network Helper
// ============================================================================
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

function delay(data, ms = 450) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Fetch GitHub user profile
 */
export async function getProfile(username) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    return delay(userData.profile);
  }
  return request(`/api/profile/${username}`);
}

/**
 * Fetch followers list
 */
export async function getFollowers(username, page = 1, per_page = 30) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    return delay(userData.followers || []);
  }
  return request(`/api/profile/${username}/followers?page=${page}&per_page=${per_page}`);
}

/**
 * Fetch following list
 */
export async function getFollowing(username, page = 1, per_page = 30) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    return delay(userData.following || []);
  }
  return request(`/api/profile/${username}/following?page=${page}&per_page=${per_page}`);
}

/**
 * Fetch repositories with sorting
 */
export async function getRepos(username, { page = 1, per_page = 30, sort = "updated" } = {}) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    const sorted = [...userData.repos].sort((a, b) => {
      if (sort === "full_name") return a.name.localeCompare(b.name);
      if (sort === "created") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "stars") return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    return delay(sorted);
  }
  return request(`/api/repos/${username}?page=${page}&per_page=${per_page}&sort=${sort}`);
}

/**
 * Fetch repo languages breakdown
 */
export async function getRepoLanguages(owner, repo) {
  if (USE_MOCK) {
    return delay({ TypeScript: 420000, JavaScript: 85000, CSS: 18000 });
  }
  return request(`/api/repos/${owner}/${repo}/languages`);
}

/**
 * Fetch dashboard aggregated stats
 */
export async function getDashboard(username) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    return delay(buildDashboardStats(userData));
  }
  return request(`/api/dashboard/${username}`);
}

/**
 * Fetch AI Career Analysis
 * Matches AI/main.py AnalysisResponse schema
 */
export async function getAIAnalysis(username) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    const mockAi = userData.aiAnalysis;
    return delay({
      ...mockAi,
      summary: mockAi.developer_summary || mockAi.summary,
      developer_summary: mockAi.developer_summary || mockAi.summary,
    }, 800);
  }

  try {
    const res = await request(`/api/analysis/${username}`, { method: "POST" });
    // Backend returns { username: "...", analysis: { developer_summary, ... } }
    const raw = res?.analysis || res;
    return {
      ...raw,
      summary: raw.developer_summary || raw.summary || '',
      developer_summary: raw.developer_summary || raw.summary || '',
    };
  } catch (err) {
    console.warn("Backend AI analysis returned an error or GROQ_API_KEY is not set. Using fallback AI summary:", err);
    const userData = resolveMockUser(username);
    const mockAi = userData.aiAnalysis;
    return {
      ...mockAi,
      summary: mockAi.developer_summary || mockAi.summary,
      developer_summary: mockAi.developer_summary || mockAi.summary,
      is_fallback: true,
    };
  }
}

export async function getOpenSourceContributions(username) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    return delay(userData.openSource, 600);
  }
  try {
    return await request(`/api/contributions/${username}`);
  } catch {
    const userData = resolveMockUser(username);
    return userData.openSource;
  }
}

/**
 * Fetch Resume & README Suggestions
 * (Matches schema from AI/main.py)
 */
export async function getResumeSuggestions(username) {
  if (USE_MOCK) {
    const userData = resolveMockUser(username);
    return delay({
      username,
      readme_suggestions: userData.aiAnalysis.readme_suggestions,
      resume_suggestions: userData.aiAnalysis.resume_suggestions,
      skill_gaps: userData.aiAnalysis.skill_gaps,
      recommendations: userData.aiAnalysis.recommendations,
      best_suited_role: userData.aiAnalysis.best_suited_role,
      is_mock: true,
    }, 700);
  }
  // When live, this is included in AI analysis or dedicated endpoint
  const analysis = await getAIAnalysis(username);
  return {
    username,
    readme_suggestions: analysis.readme_suggestions || [],
    resume_suggestions: analysis.resume_suggestions || [],
    skill_gaps: analysis.skill_gaps || [],
    recommendations: analysis.recommendations || [],
    best_suited_role: analysis.best_suited_role || null,
  };
}

/**
 * Search GitHub users
 */
export async function searchUsers(query, page = 1, per_page = 30) {
  if (USE_MOCK) {
    const items = Object.values(mockDataByUser)
      .map((d) => d.profile)
      .filter((p) => p.login.includes(query.toLowerCase()) || p.name?.toLowerCase?.().includes(query.toLowerCase()));
    return delay({ total_count: items.length, incomplete_results: false, items });
  }
  return request(`/api/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`);
}