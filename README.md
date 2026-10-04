# JB Fit Blueprint

A fitness web application for creating personalized workout and nutrition programs, tracking progress, and reading fitness articles. This repository contains the frontend, which connects to the `fit-blueprint-server` backend and uses Supabase for authentication.

## Features

- Member registration, login, and password reset
- Personalized programs based on body measurements, goals, experience, training frequency, and user restrictions
- Member dashboard with weight tracking, workout logs, nutrition logs, personal records, and monthly goals
- Member profile management
- Fitness blog with article categories
- Admin tools for managing members, admin accounts, articles, categories, profiles, and notifications, with access based on account permissions

## Tech Stack

- React 19 and JavaScript / JSX
- Vite 8
- Tailwind CSS 4 and shadcn/ui / Radix UI
- React Router
- Lucide React and Sonner
- Axios and Supabase
- ESLint and the Node.js test runner

## Getting Started

### Prerequisites

- Node.js 22.12 or later and npm
- A configured Supabase project
- A running instance of the `fit-blueprint-server` backend

### Installation

1. Install dependencies from the project root:

   ```sh
   npm ci
   ```

2. Create `.env.local` in the project root:

   ```dotenv
   VITE_API_BASE_URL=http://localhost:3000
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
   ```

   Set the API URL to your backend address. Use the URL and publishable key for the same Supabase project as the backend. Variables prefixed with `VITE_` are exposed to the browser; never use a service role key or secret key here.

3. Start the backend separately and configure its CORS settings to allow the frontend origin.

4. Start the development server:

   ```sh
   npm run dev
   ```

   Open the URL printed in the terminal, usually `http://localhost:5173`. Restart the development server after changing `.env.local`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check code with ESLint |
| `npm test` | Run the tests in `test/` using the Node.js test runner |

## Project Structure

```text
src/
  components/    Shared UI, admin and member components, and navigation
  contexts/      Shared state contexts and providers
  data/          Static and mock data
  hooks/         Custom React hooks
  lib/           Library configuration, including the Supabase client
  pages/         Public, member, and admin pages
  services/      API requests and session / storage management
  styles/        Application styles
  utils/         Utility functions
  App.jsx        Routes and app composition
public/          Static assets
test/            Test suites
```

The `@/` import alias resolves to `src/`.

## Main Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/blog` | Article listing |
| `/article/:id` | Article details |
| `/program` | Personalized program creation |
| `/login`, `/signup`, `/reset-password` | Member authentication |
| `/member-management` | Member profile |
| `/member/dashboard` | Member dashboard; login required |
| `/admin/login` | Admin login |
| `/admin/*` | Admin management pages, subject to account permissions |

## Build and Deployment

```sh
npm run build
npm run preview
```

Configure environment variables on your hosting platform before building. Vite embeds these values into the frontend at build time.

The included `vercel.json` configures Vercel to:

- Forward `/api/*` requests to `https://fit-blueprint-server.vercel.app`
- Rewrite frontend routes to `/` so React Router supports direct URL access
- Enable Git deployments for the `main` branch

In production, the main API client and article engagement service use `/api`. The public article service still uses `VITE_API_BASE_URL`, so configure that variable for production as well. Use `/api` when deploying with the included Vercel rewrites.

For other hosting platforms, configure a single-page application fallback and an `/api` proxy to the backend. `npm run preview` previews the local build but does not reproduce Vercel rewrites.

## Development Guidelines

Read `AGENTS.md` before changing the code. Follow the existing project structure, reuse existing UI components, and run lint, tests, or builds as appropriate for your changes.
