# 24-HOUR EXECUTION PLAN

## HOUR 0–3: Foundation Setup
**Objective:** Get database + auth running

### Tasks
1. **Supabase Project Setup** (30 min)
   - Create new Supabase project at [supabase.com](https://supabase.com)
   - Copy URL + anon key to `.env.local`
   - Run schema: `supabase/schema.sql` in SQL Editor
   - Enable Email Auth in Authentication settings

2. **Next.js Initialization** (30 min)
   ```bash
   npm install
   npm run dev
   ```
   - Verify localhost:3000 runs
   - Test Tailwind + Iconify loading

3. **First Profile Creation** (1 hour)
   - Create test user via Supabase Auth UI
   - Manually insert profile via SQL:
     ```sql
     INSERT INTO profiles (id, username, display_name, bio)
     VALUES ('your-auth-user-id', 'testuser', 'Test User', 'Testing the system');
     ```
   - Visit `/testuser` to verify profile page renders

4. **Auth Flow Test** (1 hour)
   - Visit `/login`
   - Send magic link
   - Verify redirect to `/dashboard`
   - Logout and re-login

**Deliverable:** Working auth + one test profile viewable

---

## HOUR 3–8: Core Features
**Objective:** Profile editing + link management

### Tasks
1. **Dashboard CRUD** (2 hours)
   - Test profile editing (name, bio, avatar)
   - Add 3-5 test links
   - Toggle link visibility
   - Delete a link
   - Verify changes reflect on `/:username` page

2. **Analytics Tracking** (1 hour)
   - Visit profile page in incognito
   - Click a link
   - Check `page_views` and `link_clicks` tables in Supabase
   - Verify counts show in dashboard

3. **Styling Polish** (2 hours)
   - Match Vision OS aesthetic to existing HTML
   - Test mobile responsiveness
   - Fix any layout breaks
   - Ensure animations work (blob gradient, hover effects)

**Deliverable:** Full CRUD + tracking working

---

## HOUR 8–16: Production Prep
**Objective:** Deploy to Vercel + hardening

### Tasks
1. **Vercel Deployment** (1 hour)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Push to GitHub
   # Connect to Vercel
   ```
   - Add env vars in Vercel dashboard
   - Deploy and test live URL

2. **Database Optimization** (2 hours)
   - Add indexes (already in schema)
   - Test RLS policies:
     - Try accessing another user's links via API
     - Ensure unauthorized edits fail
   - Run `EXPLAIN ANALYZE` on profile queries

3. **Error Handling** (2 hours)
   - Add try/catch to all server actions
   - Test 404 for non-existent usernames
   - Test invalid link URLs
   - Add toast notifications for errors

4. **SEO + Metadata** (1 hour)
   - Test OpenGraph preview on [opengraph.xyz](https://www.opengraph.xyz/)
   - Verify Twitter cards
   - Add favicon + manifest.json

5. **Performance** (2 hours)
   - Run Lighthouse audit
   - Optimize images (use Next Image)
   - Add `loading="lazy"` to avatars
   - Test Vercel Analytics

**Deliverable:** Production-ready app on custom domain

---

## HOUR 16–24: Launch Prep
**Objective:** Polish + go-live

### Tasks
1. **Landing Page** (3 hours)
   - Convert existing `index.html` to `app/page.tsx`
   - Keep all animations + Vision OS design
   - Add "Get Started" CTA → `/login`
   - Update footer links

2. **User Onboarding** (2 hours)
   - After signup, auto-create profile with username from email
   - Show "Add your first link" empty state
   - Add tooltips to dashboard

3. **Final Testing** (2 hours)
   - Create 3 real test accounts
   - Simulate user flow:
     1. Sign up
     2. Add links
     3. Share profile URL
     4. Check analytics
   - Test edge cases (no avatar, no bio, 20+ links)

4. **Documentation** (1 hour)
   - Write `README.md` with setup instructions
   - Document env vars
   - Add troubleshooting section

**Deliverable:** Launched SaaS ready for first users

---

## MUST-SHIP FEATURES (No Exceptions)
- ✅ Dynamic `/:username` pages
- ✅ Profile editing (name, bio, avatar)
- ✅ Add/edit/delete links
- ✅ Link visibility toggle
- ✅ Click + view tracking
- ✅ Magic link auth
- ✅ Mobile responsive
- ✅ SEO metadata

---

## ACCEPTABLE SHORTCUTS (Ship Now, Fix Later)
- ❌ No drag-and-drop reordering (use numeric `position` field)
- ❌ No custom domains (Pro feature later)
- ❌ No link scheduling (Pro feature)
- ❌ No analytics charts (show raw numbers only)
- ❌ No theming beyond Vision OS default
- ❌ No social OAuth (just magic link)
- ❌ No file uploads (use external URLs for avatars)

---

## LAUNCH CHECKLIST
- [ ] Supabase project live
- [ ] `.env.local` configured
- [ ] Database schema deployed
- [ ] RLS policies tested
- [ ] Auth working (magic link)
- [ ] Profile page rendering
- [ ] Dashboard CRUD functional
- [ ] Analytics tracking
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] OG tags tested
- [ ] Mobile tested
- [ ] 3 test users created
- [ ] Landing page live
- [ ] README complete

---

## POST-LAUNCH (Week 1)
- Add drag-and-drop link reordering
- Implement Stripe billing (Pro tier)
- Add link scheduling
- Build analytics dashboard (charts)
- Add custom domains (Pro)
- Implement theming system
- Add OAuth providers (Google, GitHub)

---

## CRITICAL WARNINGS
1. **DO NOT** over-engineer the dashboard UI
2. **DO NOT** add features not in the Must-Ship list
3. **DO NOT** redesign the existing HTML (it's final)
4. **TEST RLS** thoroughly before launch
5. **USE EXISTING CSS** from index.html (already perfect)
