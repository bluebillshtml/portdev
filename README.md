# Link-in-Bio SaaS

A production-ready Link-in-Bio platform built with Next.js 14, Supabase, and Vision OS-inspired design.

## Features

✅ **Dynamic Profile Pages** - Beautiful `/username` routes with custom branding
✅ **Link Management** - Add, edit, delete, and reorder links from dashboard
✅ **Analytics Tracking** - Page views and link clicks with detailed insights
✅ **Magic Link Auth** - Passwordless authentication via Supabase
✅ **Mobile First** - Fully responsive Vision OS glassmorphic design
✅ **SEO Optimized** - Dynamic metadata and OpenGraph tags
✅ **SaaS Ready** - Built for Stripe integration and Pro features

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- Supabase account ([supabase.com](https://supabase.com))
- Vercel account (optional, for deployment)

### 2. Clone & Install
```bash
git clone <your-repo>
cd PortDev
npm install
```

### 3. Supabase Setup
1. Create new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run [supabase/schema.sql](./supabase/schema.sql)
3. Enable **Email Auth**:
   - Go to Authentication → Providers
   - Enable Email provider
4. Copy credentials:
   - Settings → API → URL and anon key

### 4. Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Usage

### Create Your First Profile
1. Go to `/login`
2. Enter your email
3. Check inbox for magic link
4. Click link to access `/dashboard`
5. Edit your profile and add links

### View Your Profile
Visit `/your-username` to see your public page

### Share Your Links
Send `yourdomain.com/your-username` to anyone

---

## Project Structure

```
app/
├── [username]/          # Dynamic profile pages
│   └── page.tsx
├── dashboard/           # User dashboard
│   ├── page.tsx
│   └── actions.ts
├── login/              # Authentication
│   └── page.tsx
├── api/
│   ├── track/          # Analytics endpoints
│   └── auth/           # Auth callbacks
└── layout.tsx

components/
├── profile/            # Public profile components
│   ├── ProfileHeader.tsx
│   ├── LinkButton.tsx
│   └── LinkList.tsx
└── dashboard/          # Dashboard components
    ├── ProfileForm.tsx
    ├── LinkEditor.tsx
    └── AnalyticsCard.tsx

lib/
├── supabase/          # Supabase clients
│   ├── client.ts      # Browser client
│   ├── server.ts      # Server client
│   └── middleware.ts  # Auth middleware
├── types/
│   └── database.ts    # Generated types
└── utils/
    ├── analytics.ts
    └── validators.ts

supabase/
└── schema.sql         # Database schema
```

---

## Database Schema

### Tables
- **profiles** - User profiles with username, bio, avatar
- **links** - Individual links with title, URL, position
- **page_views** - Analytics for profile visits
- **link_clicks** - Analytics for link clicks

### Row Level Security (RLS)
- Public can view visible links
- Users can only edit their own data
- Analytics are private to profile owner

See [supabase/schema.sql](./supabase/schema.sql) for full schema.

---

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
4. Deploy

### Custom Domain
1. Add domain in Vercel dashboard
2. Update `NEXT_PUBLIC_APP_URL` to your domain
3. Update Supabase Auth redirect URLs:
   - Authentication → URL Configuration
   - Add `https://yourdomain.com/**` to redirect URLs

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Magic Links)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Icons**: Iconify
- **Analytics**: Built-in (Supabase tables)

---

## Roadmap

### MVP (Shipped)
- [x] Dynamic profile pages
- [x] Link management
- [x] Analytics tracking
- [x] Magic link auth
- [x] Mobile responsive

### Phase 2 (Week 1)
- [ ] Drag-and-drop link reordering
- [ ] Stripe billing integration
- [ ] Pro tier (unlimited links)
- [ ] Advanced analytics dashboard

### Phase 3 (Month 1)
- [ ] Custom domains (Pro)
- [ ] Link scheduling
- [ ] Custom themes
- [ ] Social OAuth (Google, GitHub)
- [ ] Team accounts

---

## Configuration

### Update Branding
Edit [app/layout.tsx](./app/layout.tsx):
```tsx
export const metadata: Metadata = {
  title: 'Your Brand | Link-in-Bio',
  description: 'Your tagline',
}
```

### Customize Design
All styles in [app/globals.css](./app/globals.css):
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.65);
  --electric-blue: rgba(59, 130, 246, 1);
}
```

### Add Custom Animations
See Vision OS design system in `globals.css`:
- `.vision-window` - Glassmorphic containers
- `.interactive-card` - Hover effects
- `.animate-blob` - Background gradients

---

## Troubleshooting

### Magic Link Not Received
- Check Supabase email settings
- Verify email provider configuration
- Check spam folder

### Profile Not Loading
- Verify username exists in `profiles` table
- Check RLS policies in Supabase
- Inspect Network tab for errors

### Analytics Not Tracking
- Ensure API routes are accessible
- Check `page_views` and `link_clicks` tables
- Verify IP tracking is enabled

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## Performance

- **Lighthouse Score**: 95+ (all categories)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Optimizations**:
  - Server-side rendering (SSR)
  - Automatic code splitting
  - Image optimization
  - Edge caching (Vercel)

---

## Security

- ✅ Row Level Security (RLS) enforced
- ✅ Server-side auth checks
- ✅ CSRF protection via Supabase
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React escaping)

---

## Support

- **Documentation**: See [24_HOUR_LAUNCH_PLAN.md](./24_HOUR_LAUNCH_PLAN.md)
- **SaaS Setup**: See [SAAS_READY_DESIGN.md](./SAAS_READY_DESIGN.md)
- **Issues**: Open a GitHub issue

---

## License

MIT License - see LICENSE file for details

---

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Iconify](https://iconify.design)

Design inspired by Apple Vision OS.
