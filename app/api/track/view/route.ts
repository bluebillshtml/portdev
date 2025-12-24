import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { profileId } = await req.json()

    if (!profileId) {
      return NextResponse.json({ error: 'Missing profileId' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const userAgent = req.headers.get('user-agent') || null
    const referrer = req.headers.get('referer') || null

    // Get IP from headers (Vercel sets x-forwarded-for)
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                      req.headers.get('x-real-ip') ||
                      null

    await supabase.from('page_views').insert({
      profile_id: profileId,
      user_agent: userAgent,
      ip_address: ipAddress,
      referrer: referrer,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking page view:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
