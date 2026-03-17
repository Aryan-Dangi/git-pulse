# GitPulse — GitHub Developer Analytics Dashboard

A production-quality GitHub analytics platform built with React + TypeScript + Tailwind CSS.

## Features

- **Profile Search** — Search any GitHub user and get full analytics
- **Repository Analytics** — Language pie charts, top starred repos bar chart
- **Repository Explorer** — Search, filter, and sort repositories
- **Repository Details** — Full repo info with language breakdown
- **Developer Score** — Custom formula: `(Stars×2) + (Forks×1.5) + (Repos×1) + (Followers×2)`
- **Developer Comparison** — Side-by-side profile comparison with radar chart
- **Dark / Light Mode** — Persisted in localStorage
- **Fully Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

- React 18 + Vite
- TypeScript
- Tailwind CSS
- TanStack Query (React Query) — caching & async state
- Recharts — data visualization
- Framer Motion — animations
- Axios — HTTP client
- React Router v6

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

Edit `.env` and add your GitHub token:

```
VITE_GITHUB_TOKEN=your_token_here
```

> Get a token at: GitHub → Settings → Developer Settings → Personal Access Tokens (classic)
> Required scopes: `public_repo`, `read:user`

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
```

---

## Deploy to Vercel

### Option A — Vercel Dashboard (recommended)

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **New Project**
3. Import your GitHub repository
4. In **Environment Variables**, add:
   - Key: `VITE_GITHUB_TOKEN`
   - Value: `your_token_here`
5. Click **Deploy**

Done! Vercel auto-deploys on every push to main.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
# Follow prompts, add env variable when asked
```

---

## Deploy to Netlify

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **New site from Git**
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Go to **Site Settings → Environment Variables** → Add `VITE_GITHUB_TOKEN`
7. Click **Deploy**

---

## Project Structure

```
src/
├── components/
│   ├── cards/
│   │   ├── ProfileCard.tsx      # User profile display
│   │   ├── RepoCard.tsx         # Repository card
│   │   └── DevScoreCard.tsx     # Developer score with breakdown
│   ├── charts/
│   │   ├── LanguageChart.tsx    # Language pie chart
│   │   ├── StarsChart.tsx       # Top starred repos bar chart
│   │   └── RepoLanguageChart.tsx # Per-repo language breakdown
│   └── ui/
│       ├── Navbar.tsx           # Sticky navbar with search
│       └── Skeletons.tsx        # Loading skeleton components
├── context/
│   └── ThemeContext.tsx         # Dark/light mode context
├── hooks/
│   └── useGitHub.ts             # React Query hooks for GitHub API
├── pages/
│   ├── Home/                    # Landing page with search
│   ├── Profile/                 # Full user dashboard
│   ├── RepoDetails/             # Single repository view
│   └── Compare/                 # Side-by-side comparison
├── services/
│   └── githubApi.ts             # Axios API client
├── types/
│   └── index.ts                 # TypeScript interfaces
└── utils/
    └── helpers.ts               # Score calc, formatting, colors
```

---

## Resume Line

```
GitHub Developer Analytics Dashboard
• Built a React + TypeScript dashboard analyzing GitHub profiles via REST API
• Implemented language distribution charts, developer score system, and comparison features
• Designed responsive dark/light UI with Tailwind CSS and Recharts visualizations
• Optimized API fetching with TanStack Query for intelligent caching
```
