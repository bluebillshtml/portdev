'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { type: 'error' as const, text: 'Not authenticated' }
    }

    const displayName = formData.get('display_name') as string
    const bio = formData.get('bio') as string
    const avatarUrl = formData.get('avatar_url') as string

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard')
    return { type: 'success' as const, text: 'Profile updated successfully!' }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { type: 'error' as const, text: 'Failed to update profile' }
  }
}

export async function addLink(formData: FormData, profileId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== profileId) {
      return { success: false, error: 'Not authenticated' }
    }

    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const icon = (formData.get('icon') as string) || 'lucide:link'

    // Get max position
    const { data: links } = await supabase
      .from('links')
      .select('position')
      .eq('profile_id', profileId)
      .order('position', { ascending: false })
      .limit(1)

    const nextPosition = (links?.[0]?.position || 0) + 1

    const { data: newLink, error } = await supabase
      .from('links')
      .insert({
        profile_id: profileId,
        title,
        url,
        icon,
        position: nextPosition,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard')
    return { success: true, link: newLink }
  } catch (error) {
    console.error('Error adding link:', error)
    return { success: false, error: 'Failed to add link' }
  }
}

export async function updateLink(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const linkId = formData.get('link_id') as string
    const isVisible = formData.get('is_visible') === 'true'

    const { error } = await supabase
      .from('links')
      .update({ is_visible: isVisible })
      .eq('id', linkId)
      .eq('profile_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error updating link:', error)
    return { success: false, error: 'Failed to update link' }
  }
}

export async function deleteLink(linkId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)
      .eq('profile_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting link:', error)
    return { success: false, error: 'Failed to delete link' }
  }
}
