# Starter App (Next.js + Supabase)

## Project Description and Purpose

This is a starter app for building authenticated Next.js projects with Supabase.

It includes:
- Email/password authentication (sign up, login, logout)
- Protected routes using Supabase session checks
- A `profiles` table linked to `auth.users`
- Avatar upload support through Supabase Storage
- A ready-to-run local setup script

Use it as a baseline so new projects can start with auth, profile data, and deployment patterns already in place.

## Prerequisites

- Node.js 20+ (recommended)
- npm
- Docker Desktop or Docker Engine running (required for local Supabase)
- Supabase CLI available via `npx supabase ...` (already in devDependencies)

## Quick Start

1. Install dependencies and initialize local services with the setup script:
   - `chmod +x setup.sh`
   - `./setup.sh`
2. Start the app:
   - `npm run dev`
3. Open `http://localhost:3000`

The setup script does the following:
- Installs npm dependencies
- Runs `npm audit fix` as a best-effort cleanup step, but continues if it cannot fully resolve issues
- Updates `supabase/config.toml` so `project_id` matches the repository folder name
- Starts local Supabase with `npx supabase@latest start`
- Writes `.env.local` with the local Supabase URL and publishable key

## Manual Setup (Step-by-Step)

If you want to set up without the script:

1. Install dependencies:
   - `npm install`
2. Update `supabase/config.toml` so `project_id` matches the folder name you want to use locally.
3. Start local Supabase:
   - `npx supabase@latest start`
4. Create `.env.local` with values from `npx supabase@latest status`:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
5. Run the app:
   - `npm run dev`

## Project Structure

- `app/` - Next.js App Router pages
  - `app/auth/login/` and `app/auth/signup/` - Authentication pages
  - `app/dashboard/` - Protected dashboard
  - `app/profile/` - Profile editing and avatar upload
- `components/` - Reusable UI pieces (`email`, `password`, `spinner`)
- `lib/supabase/` - Supabase clients (browser/server) and session proxy logic
- `supabase/migrations/` - SQL migration history
- `supabase/schemas/` - SQL schema and policy definitions
- `tests/` - Vitest test files
- `setup.sh` - One-command local setup script

## How to Use This Starter for New Projects

1. Clone/fork this repo.
2. Rename the project and update branding/UI text.
3. Keep auth/session wiring from `lib/supabase/` and `proxy.ts`.
4. Add your own tables/migrations under `supabase/migrations/`.
5. Extend protected pages (`dashboard`, `profile`) with your app features.
6. Configure Supabase Cloud + deployment when ready.

## Environment Variables

Required runtime variables:

- `NEXT_PUBLIC_SUPABASE_URL`
  - Supabase project URL (local or cloud)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Supabase publishable (anon) key

Used by:
- Browser client in `lib/supabase/client.ts`
- Server client in `lib/supabase/server.ts`
- Session proxy in `lib/supabase/proxy.ts`

Do not expose the Supabase service role key in frontend code.

## Database Schema Overview

### `public.profiles`

Defined in `supabase/schemas/profiles.sql`:
- `id UUID PRIMARY KEY` references `auth.users(id)`
- `email TEXT NOT NULL UNIQUE`
- `full_name TEXT`
- `avatar_url TEXT`
- `updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`

### Triggers/Functions

- `create_profile()` auto-creates a profile row when a new auth user is inserted
- `update_updated_at_column()` auto-updates `updated_at` before profile updates

### Row Level Security (RLS)

`profiles` RLS policies allow authenticated users to view/update/delete only their own profile row (`auth.uid() = id`).

### Storage Policies

Defined in `supabase/schemas/avatars.sql` for `storage.objects`:
- Bucket: `profiles`
- Folder scope: `avatars/...`
- Owner must match authenticated user
- Intended constraints include JPEG, PNG, WEBP, & GIF MIME types and 5MB size cap for avatar handling

## Authentication Flow Explanation

1. User signs up or logs in from `app/auth/*` pages.
2. Client-side auth calls use the browser Supabase client (`createBrowserClient`).
3. Session cookies are managed/refreshed by proxy logic in `lib/supabase/proxy.ts` via `proxy.ts` matcher.
4. Protected routes redirect unauthenticated users to `/auth/login`.
5. On authenticated pages (`dashboard`, `profile`), user/profile data is fetched from Supabase.
6. Logout calls `supabase.auth.signOut()` and routes back to login.

## Testing

This project uses **Vitest** with **React Testing Library** for component testing. Tests are in `tests/` with naming pattern `*.test.ts` or `*.test.tsx`.

**Run tests:**
- Once: `npm test`
- Watch mode: `npm test -- --watch`
- With UI: `npm test -- --ui`

**Write new tests** by creating a test file and using `describe()` for test suites, `it()` for individual tests, and `expect()` for assertions. See existing tests for patterns: utility tests in `email-validation.test.ts`, component tests in `spinner.test.tsx`, and mocked service tests in `auth-client.test.ts`. Use `vi.mock()` for external dependencies like Supabase.

## Deployment Instructions

### Using Supabase Cloud

1. **Create a Supabase project** - Go to [supabase.com](https://supabase.com) and log in to your account
2. **Set up your database** - Create a new project and wait for the database to be provisioned
3. **Obtain your credentials** - In the Supabase dashboard:
   - Navigate to "Project Overview"
   - Copy your **Project URL** (this will be your `NEXT_PUBLIC_SUPABASE_URL`)
   - Copy your **Publishable API Key** key (this will be your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. **Create a storage bucket**:
   - Go to the "Storage" section in your Supabase dashboard
   - Click "Create a new bucket" and name it `profiles`
   - Set it as **Public** to allow public access
   - Configure file size limit to **5 MB** maximum
5. **Link your local instance and apply migrations**:
   - Run `npx supabase login` to authenticate with your Supabase account
   - Run `npx supabase link --project-ref <project-id>` to link your local instance to your cloud project (replace `<project-id>` with your actual project ID)
   - Run `npx supabase db push` to apply any pending migrations from your local `supabase/migrations` folder to the cloud database
6. **(Optional) Set up CI/CD with GitHub**:
   - Go to "Project Settings" → "CI/CD"
   - To enable GitHub integration, you'll need:
     - Your **Project ID** (from Project Settings → General)
     - Your **Database Password** (from Database → Settings)
     - A **Personal Access Token** (from Account Preferences → Access Tokens)
   - Add as secrets on GitHub to bypass login and add a workflow to apply migrations
7. **Deploy your Next.js app** - Deploy to your preferred hosting platform (Vercel, Netlify, etc.) with the environment variables configured

### Using Vercel

1. **Connect your repository** - Push your code to GitHub, GitLab, or Bitbucket
2. **Import your project** - Go to [vercel.com](https://vercel.com) and click "Add New" → "Project" → select your repository
3. **Configure environment variables**:
   - Navigate to "Environment Variables"
   - Add the credentials you obtained from the Supabase Cloud section:
     - **NEXT_PUBLIC_SUPABASE_URL**: The Project URL copied from Supabase
     - **NEXT_PUBLIC_SUPABASE_ANON_KEY**: The Anon Public key copied from Supabase
   - Make sure these are available in all environments
4. **Deploy** - Click "Deploy" to build and deploy your application
5. **Access your app** - Your application will be available at the Vercel-provided URL

## Troubleshooting

- **`npx supabase@latest start` fails**
  - Ensure Docker is running and has enough resources.
- **Missing `.env.local` values**
   - Re-run `npx supabase@latest status` and verify URL/key values were copied correctly.
- **Redirect loops to login**
  - Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` match the same project.
  - Confirm proxy session handling in `proxy.ts` is active.
- **Avatar upload fails**
  - Confirm `profiles` bucket exists, is public, and storage policies are applied.
  - Check file type is an JPEG, GIF, WEBP, or PNG and size is under 5MB.
- **Cloud DB missing latest schema**
   - Re-link with `npx supabase@latest link --project-ref <project-id>` then run `npx supabase@latest db push`.


