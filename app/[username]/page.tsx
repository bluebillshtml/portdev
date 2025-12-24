import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProfileHeader from '@/components/profile/ProfileHeader'
import LinkList from '@/components/profile/LinkList'
import { trackPageView } from '@/lib/utils/analytics'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Generate metadata for SEO + OG tags
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_url')
    .eq('username', username.toLowerCase())
    .single()

  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  const title = profile.display_name || `@${username}`
  const description = profile.bio || `Check out ${title}'s links`

  return {
    title: `${title} | Link-in-Bio`,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch profile + links in parallel
  const [profileResult, linksResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single(),
    supabase
      .from('links')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('is_visible', true)
      .order('position', { ascending: true }),
  ])

  const profile = profileResult.data
  const links = linksResult.data || []

  if (!profile) {
    notFound()
  }

  // Track page view (client-side via useEffect is better for avoiding bot traffic)
  // But for server-rendered tracking, use API route in client component

  return (
    <div className="antialiased text-[#1d1d1f] relative min-h-screen selection:bg-blue-500/20 selection:text-blue-900">
      {/* Global Mesh Gradient Background (from existing HTML) */}
      <div className="fixed inset-0 -z-50 pointer-events-none select-none overflow-hidden bg-[#F5F5F7]">
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-[#E0F7FA] opacity-80 mix-blend-multiply blur-[100px] animate-blob"></div>
        <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-white opacity-100 mix-blend-multiply blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-[#F5F5F7] opacity-80 mix-blend-multiply blur-[100px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%221%22/%3E%3C/svg%3E')"}}></div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen flex w-full pt-24 px-4 pb-20 relative items-center justify-center">
        <div className="vision-window w-full max-w-2xl mx-auto p-8 md:p-12 overflow-visible reveal-window is-visible">
          {/* Window Controls (Vision OS style) */}
          <div className="absolute top-5 left-5 flex gap-2 z-20 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/5 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/5 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/5 shadow-sm"></div>
          </div>

          <div className="mt-6 relative z-10 text-center">
            <ProfileHeader
              avatarUrl={profile.avatar_url}
              displayName={profile.display_name}
              bio={profile.bio}
              isVerified={profile.is_verified}
            />

            <LinkList links={links} profileId={profile.id} />
          </div>
        </div>
      </main>

      {/* Footer Badge */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-[50px] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-white/30">
          <span className="text-[10px] font-semibold text-[#86868b] tracking-tight">
            Powered by StanceX
          </span>
        </div>
      </footer>
    </div>
  )
}
