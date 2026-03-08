# Steam VAC Watch (Vercel + Supabase)

This app lets a private group track Steam profiles and see when one of them becomes VAC banned.

## 1) Create Supabase table

Open Supabase SQL Editor and run `supabase/schema.sql`.

## 2) Set environment variables in Vercel

- APP_PASSWORD
- SESSION_SECRET
- STEAM_API_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- CRON_SECRET

## 3) Deploy

- Push this folder to GitHub
- Import the repo into Vercel
- Add the environment variables
- Deploy

## Notes

- The Vercel Hobby plan only supports cron once per day.
- You can still use the manual refresh button in the app at any time.
