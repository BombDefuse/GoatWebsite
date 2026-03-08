# Steam VAC Watch (Vercel + Supabase)

Private site for tracking Steam profiles and seeing whether any tracked profile receives a VAC ban.

## Features

- password-protected group site
- add Steam profile URLs, `/id/` vanity URLs, or 17-digit SteamID64 values
- resolves vanity URLs through the Steam Web API
- stores tracked profiles in Supabase instead of a local file
- shows current VAC status, game bans, last checked time, and the first time a VAC ban was seen while tracked
- manual refresh button
- optional Vercel daily cron refresh

## 1) Create your Steam Web API key

Create a Steam Web API key and keep it server-side only.

## 2) Create a Supabase project

In Supabase, create a new project. Then open the SQL editor and run `supabase/schema.sql`.

After that, copy these values from Supabase project settings:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3) Local development

Copy `.env.example` to `.env.local` and fill in the values.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4) Deploy on Vercel

### GitHub route

1. Create a GitHub repository and upload this project.
2. In Vercel, click **Add New → Project**.
3. Import the GitHub repository.
4. Add these environment variables in Project Settings:
   - `APP_PASSWORD`
   - `SESSION_SECRET`
   - `STEAM_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
5. Deploy.

### Vercel CLI route

```bash
npm i -g vercel
vercel
```

Then add the same environment variables in the Vercel dashboard and redeploy.

## Notes

- `vercel.json` includes one cron job at `0 8 * * *` for a daily refresh.
- On Vercel Hobby, cron jobs are limited to once per day, so the app also has a manual refresh button.
- Because the app uses the Supabase service role key, all database access stays on the server.

## Important security notes

- Never expose the Steam API key or Supabase service role key to the browser.
- Change `APP_PASSWORD` to something strong.
- Change `SESSION_SECRET` and `CRON_SECRET` to long random strings.
