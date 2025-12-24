# Quick Reference Card

## 🚀 Commands

```bash
# Install
npm install

# Development
npm run dev              # Start dev server (localhost:3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Deployment
vercel                  # Deploy to Vercel
vercel --prod           # Deploy to production
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| [supabase/schema.sql](./supabase/schema.sql) | Database schema (run once) |
| [.env.local.example](./.env.local.example) | Environment template |
| [app/[username]/page.tsx](./app/[username]/page.tsx) | Public profile page |
| [app/dashboard/page.tsx](./app/dashboard/page.tsx) | User dashboard |
| [app/dashboard/actions.ts](./app/dashboard/actions.ts) | CRUD operations |
| [lib/supabase/server.ts](./lib/supabase/server.ts) | Database client |

---

## 🗄️ Database Tables

```sql
profiles
  ├─ id (UUID, PK)
  ├─ username (TEXT, UNIQUE)
  ├─ display_name (TEXT)
  ├─ bio (TEXT)
  └─ avatar_url (TEXT)

links
  ├─ id (UUID, PK)
  ├─ profile_id (UUID, FK → profiles)
  ├─ title (TEXT)
  ├─ url (TEXT)
  ├─ icon (TEXT)
  ├─ position (INT)
  └─ is_visible (BOOL)

page_views
  ├─ id (UUID, PK)
  ├─ profile_id (UUID, FK → profiles)
  ├─ viewed_at (TIMESTAMP)
  └─ ip_address (INET)

link_clicks
  ├─ id (UUID, PK)
  ├─ link_id (UUID, FK → links)
  ├─ clicked_at (TIMESTAMP)
  └─ ip_address (INET)
```

---

## 🔐 Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Get from**: Supabase Dashboard → Settings → API

---

## 🛣️ Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Landing page | No |
| `/login` | Authentication | No |
| `/:username` | Public profile | No |
| `/dashboard` | User dashboard | Yes |
| `/api/track/view` | Log page view | No |
| `/api/track/click` | Log link click | No |
| `/api/auth/callback` | OAuth callback | No |
| `/api/auth/signout` | Logout | Yes |

---

## 🎨 CSS Classes (Vision OS)

```css
.vision-window          → Glass container
.interactive-card       → Hover effect card
.animate-blob          → Background gradient
.reveal-window         → Scroll animation
```

**Colors**:
```css
--glass-bg:        rgba(255, 255, 255, 0.65)
--glass-border:    rgba(255, 255, 255, 0.6)
--electric-blue:   rgba(59, 130, 246, 1)
```

---

## 🔍 Useful Queries

### Get user's profile
```sql
SELECT * FROM profiles WHERE username = 'johndoe';
```

### Get visible links
```sql
SELECT * FROM links
WHERE profile_id = 'user-uuid'
  AND is_visible = true
ORDER BY position;
```

### Analytics (last 7 days)
```sql
SELECT COUNT(*) FROM page_views
WHERE profile_id = 'user-uuid'
  AND viewed_at > NOW() - INTERVAL '7 days';
```

### Top clicked links
```sql
SELECT l.title, COUNT(lc.id) as clicks
FROM links l
LEFT JOIN link_clicks lc ON l.id = lc.link_id
WHERE l.profile_id = 'user-uuid'
GROUP BY l.id, l.title
ORDER BY clicks DESC;
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Magic link not received | Check spam, verify Supabase email settings |
| Profile not found | Check `profiles` table in Supabase |
| Links not showing | Verify `is_visible = true` |
| Auth redirect fails | Check `NEXT_PUBLIC_APP_URL` matches domain |
| RLS errors | Ensure policies enabled in Supabase |
| Build fails | Clear `.next/` and `node_modules/`, reinstall |

---

## 📊 Performance Tips

```typescript
// Optimize images
import Image from 'next/image'
<Image src={url} width={96} height={96} alt="Avatar" />

// Cache profile lookups
export const revalidate = 60 // seconds

// Reduce bundle size
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('./Chart'), { ssr: false })
```

---

## 🎯 Iconify Icons

Common icons for links:
```
lucide:link          → Generic
lucide:globe         → Website
lucide:twitter       → Twitter/X
lucide:instagram     → Instagram
lucide:youtube       → YouTube
lucide:github        → GitHub
lucide:linkedin      → LinkedIn
lucide:mail          → Newsletter
lucide:shopping-cart → Store
lucide:coffee        → Buy Me Coffee
```

Browse: [icones.js.org](https://icones.js.org)

---

## 🔒 RLS Quick Reference

```sql
-- Profiles
SELECT: Anyone
INSERT: Own profile only
UPDATE: Own profile only

-- Links
SELECT: Public (visible) or owner
INSERT: Own links only
UPDATE: Own links only
DELETE: Own links only

-- Analytics
SELECT: Owner only
INSERT: Anyone (tracking)
```

---

## 📦 Dependencies

```json
{
  "@supabase/ssr": "^0.5.2",
  "@supabase/supabase-js": "^2.45.6",
  "next": "^15.1.3",
  "react": "^19.0.0"
}
```

**Total Bundle Size**: ~150KB (gzipped)

---

## 🚀 Deployment Checklist

- [ ] Supabase project created
- [ ] Schema deployed (`schema.sql`)
- [ ] Email auth enabled
- [ ] `.env.local` configured
- [ ] Local dev server runs
- [ ] Test profile created
- [ ] Links added and visible
- [ ] Analytics tracking works
- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Env vars added in Vercel
- [ ] Production build succeeds
- [ ] Custom domain configured
- [ ] SSL certificate active

---

## 📖 Documentation Index

| Guide | Purpose |
|-------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup |
| [README.md](./README.md) | Full documentation |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design |
| [24_HOUR_LAUNCH_PLAN.md](./24_HOUR_LAUNCH_PLAN.md) | Deployment timeline |
| [SAAS_READY_DESIGN.md](./SAAS_READY_DESIGN.md) | Monetization strategy |
| [HTML_MAPPING.md](./HTML_MAPPING.md) | Component mapping |
| [DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md) | What was built |

---

## 💡 Pro Tips

1. **Username Rules**: 3-30 chars, lowercase, alphanumeric + `-_`
2. **Avatar URLs**: Use Gravatar, Cloudinary, or Dicebear
3. **Link Limit**: 5 (Free), Unlimited (Pro)
4. **Analytics Retention**: 7 days (Free), Lifetime (Pro)
5. **Custom Domains**: Pro feature (see SAAS_READY_DESIGN.md)

---

## 🎨 Customization

### Change Brand Name
Edit [app/layout.tsx](./app/layout.tsx):
```tsx
export const metadata: Metadata = {
  title: 'Your Brand | Link-in-Bio',
}
```

### Update Colors
Edit [app/globals.css](./app/globals.css):
```css
:root {
  --electric-blue: rgba(59, 130, 246, 1); /* Change this */
}
```

### Add Footer Text
Edit profile page footer (Line ~120)

---

## 📞 Quick Links

- **Supabase Dashboard**: [app.supabase.com](https://app.supabase.com)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Iconify Search**: [icones.js.org](https://icones.js.org)
- **Tailwind Docs**: [tailwindcss.com](https://tailwindcss.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## ⚡ Shortcuts

```bash
# Quick restart
npm run dev

# Force clean rebuild
rm -rf .next node_modules && npm install && npm run dev

# Check build size
npm run build
# Look for "First Load JS"

# Update dependencies
npm update

# Generate types from Supabase
npx supabase gen types typescript --project-id "YOUR_PROJECT_ID" > lib/types/database.ts
```

---

## 🎯 Success Metrics

| Metric | Good | Great |
|--------|------|-------|
| Lighthouse Score | > 90 | > 95 |
| First Paint | < 1.5s | < 1s |
| Time to Interactive | < 2.5s | < 2s |
| Database Query | < 100ms | < 50ms |
| API Response | < 200ms | < 100ms |

**Measure**: Chrome DevTools → Lighthouse

---

## 🔮 Future Features Roadmap

**Shipped** ✅:
- Dynamic profiles
- Link management
- Analytics tracking
- Magic link auth

**Next** 🎯:
- Drag-and-drop reorder
- Stripe billing
- Custom domains
- Advanced analytics

**Later** 💭:
- Team accounts
- Custom themes
- A/B testing
- QR codes

---

## 🎓 Learn More

**Next.js 14**:
- Server vs Client Components
- Server Actions
- Middleware

**Supabase**:
- Row Level Security (RLS)
- Magic Link Auth
- Real-time subscriptions

**Vercel**:
- Edge Functions
- Caching strategies
- Analytics

---

**Print this for quick reference!**
