# WildPath — Africa Safari Network

## Getting Started

### Step 1: Supabase Setup
1. Go to supabase.com and create a new project
2. In the SQL Editor, paste and run the contents of `supabase_setup.sql`
3. Go to Settings → API and copy:
   - Project URL
   - anon/public key

### Step 2: Configure Environment
1. Copy `.env.example` to `.env`
2. Paste your Supabase URL and anon key

```
REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Install and Run
```bash
npm install
npm start
```

### Step 4: Deploy to Vercel
1. Push this folder to a GitHub repository
2. Go to vercel.com → New Project → Import from GitHub
3. Add your environment variables in Vercel project settings
4. Deploy — your app will be live at a `.vercel.app` URL

## What's Built

- `/` — Home page with hero, features, and operator CTA
- `/discover` — Safari operator listings with search and country filters
- `/operators/join` — 4-step operator application form (saves to Supabase)
- `/operators/:id` — Individual operator profile with enquiry form
- `/login` — Sign in / Sign up with Supabase Auth

## Tech Stack

- React 18
- React Router 6
- Supabase (database + auth)
- Deployed on Vercel
