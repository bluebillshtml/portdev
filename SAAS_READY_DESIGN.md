# SaaS-Ready Architecture

## Stripe Integration (Future)

### Where Stripe Slots In
```typescript
// lib/stripe/client.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Pricing tiers
export const PLANS = {
  free: {
    price: 0,
    maxLinks: 5,
    customDomain: false,
    analytics: 'basic',
    stripe_price_id: null,
  },
  pro: {
    price: 9,
    maxLinks: 100,
    customDomain: true,
    analytics: 'advanced',
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID,
  },
}
```

### Database Changes
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN subscription_status TEXT;

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Webhook Handler
```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case 'customer.subscription.created':
      // Upgrade user to Pro
      break
    case 'customer.subscription.deleted':
      // Downgrade to Free
      break
  }

  return new Response('OK')
}
```

### Gating Features
```typescript
// middleware.ts additions
export async function middleware(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, is_pro')
      .eq('id', user.id)
      .single()

    // Check link count for free users
    if (profile?.plan === 'free') {
      const { count } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)

      if (count >= 5) {
        // Redirect to upgrade page
      }
    }
  }

  return await updateSession(request)
}
```

---

## Custom Domains (Pro Feature)

### Architecture
```
User's Domain (custom.com)
    ↓
Vercel Deployment (app.linkbio.com)
    ↓
Middleware checks domain mapping
    ↓
Fetch profile by custom_domain field
    ↓
Render profile page
```

### Database Schema
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN custom_domain TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN domain_verified BOOLEAN DEFAULT false;

-- Custom domains table (for verification)
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  verification_token TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Middleware Logic
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Check if custom domain
  if (!hostname.includes('yourdomain.com')) {
    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('custom_domain', hostname)
      .eq('domain_verified', true)
      .single()

    if (profile) {
      // Rewrite to /:username
      return NextResponse.rewrite(
        new URL(`/${profile.username}`, request.url)
      )
    }
  }

  return await updateSession(request)
}
```

### Vercel Configuration
```json
// vercel.json
{
  "wildcard": [
    {
      "domain": "*.yourdomain.com"
    }
  ]
}
```

Users add CNAME record:
```
CNAME → cname.vercel-dns.com
```

### DNS Verification Flow
1. User enters custom domain in dashboard
2. System generates verification TXT record
3. User adds TXT to DNS
4. System polls DNS for verification
5. Once verified, domain is live

---

## Pro Feature Gating Matrix

| Feature | Free | Pro |
|---------|------|-----|
| Max Links | 5 | Unlimited |
| Analytics | 7 days | Lifetime |
| Custom Domain | ❌ | ✅ |
| Link Scheduling | ❌ | ✅ |
| Remove Branding | ❌ | ✅ |
| Priority Support | ❌ | ✅ |
| Advanced Themes | ❌ | ✅ |

### Implementation
```typescript
// lib/utils/features.ts
export function canAddLink(profile: Profile, currentLinkCount: number): boolean {
  if (profile.is_pro) return true
  return currentLinkCount < 5
}

export function canUseCustomDomain(profile: Profile): boolean {
  return profile.is_pro
}

export function getAnalyticsRetention(profile: Profile): number {
  return profile.is_pro ? Infinity : 7 // days
}
```

### Dashboard UI Gating
```tsx
// components/dashboard/LinkEditor.tsx
{!canAddLink(profile, links.length) && (
  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
    <p className="text-sm text-amber-800">
      Free plan limit reached (5 links).{' '}
      <a href="/upgrade" className="font-semibold underline">
        Upgrade to Pro
      </a>{' '}
      for unlimited links.
    </p>
  </div>
)}
```

---

## Scaling Without Refactor

### Current Architecture Supports:
- ✅ Multi-tenancy (RLS isolation)
- ✅ Horizontal scaling (stateless Next.js)
- ✅ Database sharding (Supabase handles)
- ✅ CDN caching (Vercel Edge)
- ✅ Analytics at scale (partitioned tables)

### Future Optimizations (No Breaking Changes):
1. **Add Redis caching** for profile lookups
   ```typescript
   // lib/cache/redis.ts
   import { createClient } from 'redis'

   export async function getCachedProfile(username: string) {
     const cached = await redis.get(`profile:${username}`)
     if (cached) return JSON.parse(cached)

     // Fetch from DB, cache for 1 hour
     const profile = await db.getProfile(username)
     await redis.setex(`profile:${username}`, 3600, JSON.stringify(profile))
     return profile
   }
   ```

2. **Image optimization** via Vercel Image API
   ```tsx
   <Image
     src={profile.avatar_url}
     width={96}
     height={96}
     alt="Avatar"
   />
   ```

3. **Geolocation enrichment** for analytics
   ```typescript
   // Use Vercel's geo headers
   const country = request.geo?.country
   const city = request.geo?.city
   ```

4. **Partitioned analytics tables** (when > 1M rows)
   ```sql
   -- Partition by month
   CREATE TABLE page_views_2025_01 PARTITION OF page_views
   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
   ```

---

## Monetization Strategy

### Month 1: Free Only
- Build user base
- Gather feedback
- No payment required

### Month 2: Introduce Pro ($9/mo)
- Stripe integration
- Upgrade CTA in dashboard
- 14-day free trial

### Month 3: Add Team Plan ($29/mo)
- Multi-user accounts
- Shared analytics
- Role-based permissions

### No Refactor Required
All billing logic lives in:
- `lib/stripe/`
- `app/api/webhooks/stripe/`
- Middleware checks `profile.plan`

Core app logic remains unchanged.

---

## Summary

This architecture ships fast AND scales:

1. **Stripe**: Add when revenue-ready (1 week integration)
2. **Custom Domains**: Enable when Pro tier launches (3 days)
3. **Feature Gating**: Simple middleware + RLS checks
4. **No Refactor**: All SaaS logic is additive, not invasive

Launch with core features. Monetize later. Scale forever.
