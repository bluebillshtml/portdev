'use client'

import { useEffect } from 'react'
import LinkButton from './LinkButton'

interface Link {
  id: string
  title: string
  url: string
  icon: string | null
}

interface LinkListProps {
  links: Link[]
  profileId: string
}

export default function LinkList({ links, profileId }: LinkListProps) {
  useEffect(() => {
    // Track page view on mount (client-side only)
    fetch('/api/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId }),
    }).catch(() => {}) // Silently fail
  }, [profileId])

  if (links.length === 0) {
    return (
      <div className="text-center text-[#86868b] text-sm mt-8">
        No links available yet.
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-8">
      {links.map((link) => (
        <LinkButton
          key={link.id}
          id={link.id}
          title={link.title}
          url={link.url}
          icon={link.icon}
          profileId={profileId}
        />
      ))}
    </div>
  )
}
