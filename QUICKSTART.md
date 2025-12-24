# 5-Minute Quickstart

Get your Link-in-Bio SaaS running in 5 minutes.

---

## Step 1: Install Dependencies (1 min)
```bash
npm install
```

---

## Step 2: Supabase Setup (2 min)

### A. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `linkbio` (or whatever)
4. Wait 2 minutes for provisioning

### B. Run Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy entire contents of [supabase/schema.sql](./supabase/schema.sql)
4. Paste and click **Run**
5. Verify tables created: `profiles`, `links`, `page_views`, `link_clicks`

### C. Enable Email Auth
1. Go to **Authentication** → **Providers**
2. Toggle **Email** to ON
3. Leave defaults (magic link enabled)

---

## Step 3: Environment Variables (30 sec)

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. In Supabase dashboard, go to **Settings** → **API**

3. Copy these values to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 4: Run Dev Server (10 sec)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 5: Create Your First Profile (1 min)

### A. Sign Up
1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your email
3. Click "Send Magic Link"
4. Check your email
5. Click the link in email

### B. Setup Profile
You'll be redirected to `/dashboard`

1. **Username**: Auto-created from your email (e.g., `john` from `john@example.com`)
2. **Display Name**: Type your name (e.g., "John Doe")
3. **Bio**: Add a short description
4. **Avatar URL**: Paste an image URL (or leave blank)
5. Click **Save Changes**

### C. Add Links
1. Scroll to "Manage Links"
2. Click "Add New Link"
3. Fill in:
   - **Title**: "My Website"
   - **URL**: "https://example.com"
   - **Icon**: "lucide:globe" (or leave default)
4. Click **Add Link**
5. Repeat for more links

### D. View Your Profile
1. Look for the link in dashboard header: `/{username}`
2. Click it to open in new tab
3. Share this URL with anyone!

---

## Step 6: Test Analytics (30 sec)

1. Open profile in **incognito window**
2. Click a few links
3. Go back to `/dashboard`
4. See analytics cards update:
   - Total Views
   - Total Clicks
   - Active Links

---

## Troubleshooting

### "Magic link not received"
- Check spam folder
- Verify email provider in Supabase (Authentication → Settings)
- Try with Gmail/Google Workspace (most reliable)

### "Profile not found"
- Ensure you clicked magic link and redirected to `/dashboard`
- Check Supabase table browser: `profiles` should have 1 row
- Username must be lowercase, alphanumeric + `_` or `-` only

### "Links not showing"
- Ensure `is_visible` is `true` in database
- Refresh page
- Check browser console for errors

### Port 3000 already in use
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## Next Steps

### Deploy to Vercel (5 min)
1. Push code to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add same env vars from `.env.local`
4. Deploy

### Add Custom Domain (10 min)
1. Buy domain (Namecheap, Cloudflare, etc.)
2. Add in Vercel: Settings → Domains
3. Update DNS records (A/CNAME)
4. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
5. Update Supabase redirect URLs:
   - Authentication → URL Configuration
   - Add `https://yourdomain.com/**`

### Enable Stripe (Later)
See [SAAS_READY_DESIGN.md](./SAAS_READY_DESIGN.md#stripe-integration-future)

---

## Sample Data

Want to test with realistic data? Run this in Supabase SQL Editor:

```sql
-- Replace YOUR_USER_ID with your actual user ID from auth.users table
-- Find it: Authentication → Users → copy UUID

INSERT INTO profiles (id, username, display_name, bio, avatar_url, is_verified)
VALUES (
  'YOUR_USER_ID',
  'testuser',
  'Sarah Johnson',
  'Product designer, cat lover, coffee addict ☕',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  true
);

-- Add sample links
INSERT INTO links (profile_id, title, url, icon, position, is_visible)
VALUES
  ('YOUR_USER_ID', 'Portfolio', 'https://sarahjohnson.com', 'lucide:briefcase', 1, true),
  ('YOUR_USER_ID', 'Twitter', 'https://twitter.com/sarahj', 'lucide:twitter', 2, true),
  ('YOUR_USER_ID', 'Instagram', 'https://instagram.com/sarahj', 'lucide:instagram', 3, true),
  ('YOUR_USER_ID', 'Buy Me Coffee', 'https://buymeacoffee.com/sarahj', 'lucide:coffee', 4, true),
  ('YOUR_USER_ID', 'Newsletter', 'https://sarahjohnson.substack.com', 'lucide:mail', 5, true);
```

Visit `/testuser` to see the result!

---

## Cheat Sheet

### Common Iconify Icons
Use these for `links.icon`:

```
lucide:link          → Generic link
lucide:globe         → Website
lucide:twitter       → Twitter
lucide:instagram     → Instagram
lucide:youtube       → YouTube
lucide:github        → GitHub
lucide:linkedin      → LinkedIn
lucide:mail          → Email/Newsletter
lucide:shopping-cart → Store
lucide:coffee        → Buy Me Coffee
lucide:book-open     → Blog
lucide:video         → Video
lucide:music         → Music/Spotify
```

Browse all: [icones.js.org](https://icones.js.org/) (search "lucide")

### Useful Supabase Queries

**See all profiles:**
```sql
SELECT username, display_name, created_at FROM profiles;
```

**See all links for user:**
```sql
SELECT title, url, position, is_visible
FROM links
WHERE profile_id = 'YOUR_USER_ID'
ORDER BY position;
```

**Analytics for last 24 hours:**
```sql
SELECT COUNT(*) AS views
FROM page_views
WHERE profile_id = 'YOUR_USER_ID'
  AND viewed_at > NOW() - INTERVAL '24 hours';
```

**Most clicked links:**
```sql
SELECT l.title, COUNT(lc.id) AS clicks
FROM links l
LEFT JOIN link_clicks lc ON l.id = lc.link_id
WHERE l.profile_id = 'YOUR_USER_ID'
GROUP BY l.id, l.title
ORDER BY clicks DESC;
```

---

## You're Done! 🎉

Your Link-in-Bio SaaS is now running. Share your profile and start tracking analytics!

**Next**: See [24_HOUR_LAUNCH_PLAN.md](./24_HOUR_LAUNCH_PLAN.md) for full production deployment.
