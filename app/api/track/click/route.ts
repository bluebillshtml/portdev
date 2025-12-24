import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { linkId, profileId } = await req.json()

    if (!linkId || !profileId) {
      return NextResponse.json({ error: 'Missing linkId or profileId' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const userAgent = req.headers.get('user-agent') || null
    const referrer = req.headers.get('referer') || null
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                      req.headers.get('x-real-ip') ||
                      null

    await supabase.from('link_clicks').insert({
      link_id: linkId,
      profile_id: profileId,
      user_agent: userAgent,
      ip_address: ipAddress,
      referrer: referrer,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking link click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
