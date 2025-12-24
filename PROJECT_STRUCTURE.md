# Project Structure

```
PortDev/
├── app/
│   ├── layout.tsx                 # Root layout (fonts, Supabase provider)
│   ├── page.tsx                   # Landing page (existing index.html)
│   ├── globals.css                # Existing styles from index.html
│   │
│   ├── [username]/
│   │   └── page.tsx               # Dynamic profile page (/zoeyai)
│   │
│   ├── login/
│   │   └── page.tsx               # Auth page (magic link)
│   │
│   ├── dashboard/
│   │   ├── layout.tsx             # Dashboard wrapper (auth check)
│   │   ├── page.tsx               # Profile editor
│   │   └── analytics/
│   │       └── page.tsx           # View stats
│   │
│   └── api/
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts       # OAuth callback handler
│       └── track/
│           ├── view/
│           │   └── route.ts       # Log page views
│           └── click/
│               └── route.ts       # Log link clicks
│
├── components/
│   ├── profile/
│   │   ├── ProfileHeader.tsx      # Avatar, name, bio
│   │   ├── LinkButton.tsx         # Single link card
│   │   ├── LinkList.tsx           # All links container
│   │   └── SocialLinks.tsx        # Footer social icons
│   │
│   ├── dashboard/
│   │   ├── ProfileForm.tsx        # Edit profile fields
│   │   ├── LinkEditor.tsx         # Add/edit/delete links
│   │   ├── LinkReorder.tsx        # Drag-and-drop (later)
│   │   └── AnalyticsCard.tsx      # Stats display
│   │
│   ├── ui/
│   │   ├── VisionWindow.tsx       # Glass container
│   │   ├── InteractiveCard.tsx    # Hover card
│   │   └── Button.tsx             # Consistent buttons
│   │
│   └── providers/
│       └── SupabaseProvider.tsx   # Client-side Supabase context
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Client-side Supabase
│   │   ├── server.ts              # Server-side Supabase (cookies)
│   │   └── middleware.ts          # Auth middleware
│   │
│   ├── utils/
│   │   ├── cn.ts                  # Class name merger
│   │   ├── analytics.ts           # Track helpers
│   │   └── validators.ts          # Username validation
│   │
│   └── types/
│       └── database.ts            # Generated Supabase types
│
├── public/
│   ├── assets/                    # Images from existing site
│   └── icons/                     # Iconify fallbacks
│
├── supabase/
│   ├── schema.sql                 # Database schema
│   └── migrations/                # Auto-generated migrations
│
├── .env.local                     # Environment variables
├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind (existing + custom)
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

## Key Files Mapping

| File | Purpose | Maps From HTML |
|------|---------|----------------|
| `app/[username]/page.tsx` | Public profile | Lines 326-451 (Hero) |
| `components/profile/ProfileHeader.tsx` | Profile info | Lines 338-362 |
| `components/profile/LinkButton.tsx` | Individual link | Lines 393-445 (cards) |
| `app/dashboard/page.tsx` | Edit UI | N/A (minimal form) |
| `globals.css` | Styles | Lines 9-144 (all CSS) |
