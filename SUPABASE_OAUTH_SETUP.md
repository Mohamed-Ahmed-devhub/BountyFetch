# Supabase OAuth Setup Guide
## Enable Google + GitHub Login in BountyFetch

---

## Step 1 — Run SQL Setup

Go to **Supabase → SQL Editor** and run the file `supabase_setup.sql`

---

## Step 2 — Get Supabase Keys

Go to **Supabase → Project Settings → API**

Copy:
- `Project URL` → paste as `VITE_SUPABASE_URL` in `frontend/.env`
- `anon public` key → paste as `VITE_SUPABASE_ANON_KEY` in `frontend/.env`
- `service_role` key → paste as `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`

---

## Step 3 — Enable Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → **APIs & Services → Credentials**
3. Click **Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add Authorized redirect URI:
   ```
   https://jgctbmzuwbuwzndchimo.supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** and **Client Secret**
7. Go to **Supabase → Authentication → Providers → Google**
8. Enable Google → paste Client ID + Secret → Save

---

## Step 4 — Enable GitHub OAuth

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - Application name: `BountyFetch`
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL:
     ```
     https://jgctbmzuwbuwzndchimo.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy **Client ID** and generate **Client Secret**
6. Go to **Supabase → Authentication → Providers → GitHub**
7. Enable GitHub → paste Client ID + Secret → Save

---

## Step 5 — Install Supabase package

```bash
cd frontend
npm install @supabase/supabase-js
```

```bash
cd backend
npm install @supabase/supabase-js
```

---

## Step 6 — Configure frontend .env

Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_URL=https://jgctbmzuwbuwzndchimo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_key
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

---

## Step 7 — Configure backend .env

```env
SUPABASE_URL=https://jgctbmzuwbuwzndchimo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key
DATABASE_URL=postgresql://postgres.jgctbmzuwbuwzndchimo:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Step 8 — Test the flow

1. Run backend: `cd backend && npm run dev`
2. Run frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173/register`
4. Click **Google** or **GitHub** button
5. After OAuth, you'll be redirected to `/dashboard` ✅

---

## How the Auth Flow Works

```
User clicks "Sign in with Google"
       ↓
Supabase opens Google OAuth popup
       ↓
Google returns token to Supabase
       ↓
Supabase creates session (access_token)
       ↓
Frontend onAuthStateChange fires
       ↓
Frontend calls POST /api/auth/supabase-sync
       ↓
Backend verifies token with Supabase Admin
       ↓
Backend creates/updates user in PostgreSQL
       ↓
User is logged in → redirect to /dashboard ✅
```
