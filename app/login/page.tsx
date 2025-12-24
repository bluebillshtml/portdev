'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the magic link!' })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-50 pointer-events-none select-none overflow-hidden bg-[#F5F5F7]">
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-[#E0F7FA] opacity-80 mix-blend-multiply blur-[100px] animate-blob"></div>
        <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-white opacity-100 mix-blend-multiply blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="vision-window w-full max-w-md p-8 md:p-12 relative">
        <div className="absolute top-5 left-5 flex gap-2 z-20 opacity-60">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/5"></div>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/5"></div>
          <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/5"></div>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-[#86868b] mb-8">
            Sign in to manage your link-in-bio
          </p>

          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
              />
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-[#007AFF] text-white font-medium hover:bg-[#0071eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <span>Send Magic Link</span>
                  <span className="iconify" data-icon="lucide:mail" data-width="18"></span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#86868b] hover:text-[#007AFF] transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
