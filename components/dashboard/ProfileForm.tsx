'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/dashboard/actions'

interface ProfileFormProps {
  profile: {
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
  }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setMessage(null)
    startTransition(async () => {
      const result = await updateProfile(formData)
      setMessage(result)
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Username (read-only for now) */}
      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
          Username
        </label>
        <input
          type="text"
          value={profile.username}
          disabled
          className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-[#86868b] cursor-not-allowed"
        />
        <p className="text-xs text-[#86868b] mt-1">Username cannot be changed</p>
      </div>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
          Display Name
        </label>
        <input
          type="text"
          name="display_name"
          defaultValue={profile.display_name || ''}
          placeholder="Your Name"
          maxLength={50}
          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          defaultValue={profile.bio || ''}
          placeholder="A short description about yourself..."
          maxLength={200}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all resize-none"
        />
      </div>

      {/* Avatar URL */}
      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
          Avatar URL
        </label>
        <input
          type="url"
          name="avatar_url"
          defaultValue={profile.avatar_url || ''}
          placeholder="https://example.com/avatar.jpg"
          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 rounded-xl bg-[#007AFF] text-white font-medium hover:bg-[#0071eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
