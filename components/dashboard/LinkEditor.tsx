'use client'

import { useState, useTransition } from 'react'
import { addLink, updateLink, deleteLink } from '@/app/dashboard/actions'

interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  position: number
  is_visible: boolean
}

interface LinkEditorProps {
  links: Link[]
  profileId: string
}

export default function LinkEditor({ links: initialLinks, profileId }: LinkEditorProps) {
  const [links, setLinks] = useState(initialLinks)
  const [isAdding, setIsAdding] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAddLink = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addLink(formData, profileId)
      if (result.success && result.link) {
        setLinks([...links, result.link])
        setIsAdding(false)
      }
    })
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Delete this link?')) return
    startTransition(async () => {
      const result = await deleteLink(linkId)
      if (result.success) {
        setLinks(links.filter(l => l.id !== linkId))
      }
    })
  }

  const handleToggleVisibility = async (link: Link) => {
    const formData = new FormData()
    formData.append('link_id', link.id)
    formData.append('is_visible', (!link.is_visible).toString())

    startTransition(async () => {
      const result = await updateLink(formData)
      if (result.success) {
        setLinks(links.map(l => l.id === link.id ? { ...l, is_visible: !l.is_visible } : l))
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Existing Links */}
      {links.length === 0 && !isAdding && (
        <p className="text-center text-[#86868b] text-sm py-8">
          No links yet. Add your first link below.
        </p>
      )}

      {links.map((link) => (
        <div
          key={link.id}
          className="flex items-center gap-4 p-4 rounded-xl bg-white/50 border border-white/60"
        >
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">{link.title}</h3>
            <p className="text-xs text-[#86868b] truncate">{link.url}</p>
          </div>
          <button
            onClick={() => handleToggleVisibility(link)}
            disabled={isPending}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              link.is_visible
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            {link.is_visible ? 'Visible' : 'Hidden'}
          </button>
          <button
            onClick={() => handleDeleteLink(link.id)}
            disabled={isPending}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <span className="iconify" data-icon="lucide:trash-2" data-width="16"></span>
          </button>
        </div>
      ))}

      {/* Add New Link Form */}
      {isAdding ? (
        <form action={handleAddLink} className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Link Title"
            required
            maxLength={100}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none"
          />
          <input
            type="url"
            name="url"
            placeholder="https://example.com"
            required
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none"
          />
          <input
            type="text"
            name="icon"
            placeholder="Icon (e.g., lucide:link)"
            defaultValue="lucide:link"
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 rounded-lg bg-[#007AFF] text-white font-medium hover:bg-[#0071eb] disabled:opacity-50"
            >
              {isPending ? 'Adding...' : 'Add Link'}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg bg-white text-[#86868b] font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-[#86868b] hover:border-[#007AFF] hover:text-[#007AFF] transition-all flex items-center justify-center gap-2"
        >
          <span className="iconify" data-icon="lucide:plus" data-width="18"></span>
          <span className="font-medium">Add New Link</span>
        </button>
      )}
    </div>
  )
}
