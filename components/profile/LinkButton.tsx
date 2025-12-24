'use client'

import { useState } from 'react'

interface LinkButtonProps {
  id: string
  title: string
  url: string
  icon?: string | null
  profileId: string
}

export default function LinkButton({ id, title, url, icon, profileId }: LinkButtonProps) {
  const [isClicking, setIsClicking] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsClicking(true)

    // Track click via API route (non-blocking)
    fetch('/api/track/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId: id, profileId }),
    }).catch(() => {}) // Ignore errors silently

    // Delay for visual feedback, then navigate
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
      setIsClicking(false)
    }, 150)
  }

  return (
    <a
      href={url}
      onClick={handleClick}
      className={`
        interactive-card flex items-center justify-between p-4 rounded-2xl
        bg-white/50 border border-white/60 shadow-sm cursor-pointer
        transition-all duration-300
        ${isClicking ? 'scale-95' : 'hover:scale-[1.02]'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-blue-50 text-blue-600">
          <span
            className="iconify"
            data-icon={icon || 'lucide:link'}
            data-width="18"
          ></span>
        </div>
        <span className="text-sm font-semibold text-[#1d1d1f] tracking-tight">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="iconify text-[#86868b]" data-icon="lucide:arrow-up-right" data-width="16"></span>
      </div>
    </a>
  )
}
