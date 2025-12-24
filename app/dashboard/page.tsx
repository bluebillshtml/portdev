import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/dashboard/ProfileForm'
import LinkEditor from '@/components/dashboard/LinkEditor'
import AnalyticsCard from '@/components/dashboard/AnalyticsCard'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile + links
  const [profileResult, linksResult, viewsResult, clicksResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('links').select('*').eq('profile_id', user.id).order('position'),
    supabase.from('page_views').select('id').eq('profile_id', user.id),
    supabase.from('link_clicks').select('id').eq('profile_id', user.id),
  ])

  const profile = profileResult.data
  const links = linksResult.data || []
  const totalViews = viewsResult.data?.length || 0
  const totalClicks = clicksResult.data?.length || 0

  if (!profile) {
    // Create profile if doesn't exist
    const username = user.email?.split('@')[0] || `user${user.id.slice(0, 8)}`
    await supabase.from('profiles').insert({
      id: user.id,
      username: username.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
    })
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">Dashboard</h1>
            <p className="text-[#86868b] mt-1">
              Manage your profile at{' '}
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] hover:underline"
              >
                /{profile.username}
              </a>
            </p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnalyticsCard label="Total Views" value={totalViews} icon="lucide:eye" />
          <AnalyticsCard label="Total Clicks" value={totalClicks} icon="lucide:mouse-pointer-click" />
          <AnalyticsCard label="Active Links" value={links.filter(l => l.is_visible).length} icon="lucide:link" />
        </div>

        {/* Profile Editor */}
        <div className="vision-window p-8 relative">
          <div className="absolute top-5 left-5 flex gap-2 z-20 opacity-60">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/5"></div>
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/5"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/5"></div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6">Profile Settings</h2>
            <ProfileForm profile={profile} />
          </div>
        </div>

        {/* Link Editor */}
        <div className="vision-window p-8 relative">
          <div className="absolute top-5 left-5 flex gap-2 z-20 opacity-60">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/5"></div>
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/5"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/5"></div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-6">Manage Links</h2>
            <LinkEditor links={links} profileId={user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
