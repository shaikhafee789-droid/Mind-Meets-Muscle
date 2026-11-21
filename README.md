# Problem Crackers

Professional startup collaboration platform MVP.

## Run locally

Open `index.html` directly, or start a static server:

```powershell
cd "C:\Users\HP\Desktop\New folder (7)"
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Demo behavior

The current build is a clearly identified demo environment. It uses browser local storage for navigation, authentication state, published ideas, skills, businesses, collaborations, messages, saved items, and notifications.

This is intentionally not presented as a live backend until Supabase is connected.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase_schema.sql` in the Supabase SQL Editor.
3. Enable Email auth and, if available for the project region/provider, Phone auth.
4. Create the following Storage buckets: `avatars`, `business-images`, `project-files`.
5. Add a frontend configuration file with:

```javascript
window.PROBLEM_CRACKERS_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLISHABLE_OR_ANON_KEY"
};
```

Never place a Supabase service-role key in this browser application. The publishable/anon key is designed for frontend use with RLS enabled.

## Frontend structure

- `index.html`: application entry point
- `styles.css`: responsive design system
- `app.js`: routes, demo state, forms, matching presentation, and interactions
- `supabase_schema.sql`: PostgreSQL tables, relationships, triggers, and RLS policies

## Production integration

Replace local-storage operations in `app.js` with Supabase client calls. The real integration should use:

- `supabase.auth.signInWithPassword()` for email login
- `supabase.auth.signUp()` for registration
- `supabase.auth.signInWithOtp({ phone })` and `verifyOtp()` for mobile OTP
- Supabase tables and Storage for persisted records and files
- Realtime subscriptions for messages and notifications
- Database matching queries or an Edge Function for compatibility scores
