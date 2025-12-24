'use client'

interface ProfileHeaderProps {
  avatarUrl: string | null
  displayName: string | null
  bio: string | null
  isVerified: boolean
}

export default function ProfileHeader({
  avatarUrl,
  displayName,
  bio,
  isVerified,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Avatar */}
      {avatarUrl && (
        <div className="mb-6 relative group">
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img
            src={avatarUrl}
            alt={displayName || 'Profile'}
            className="relative w-24 h-24 rounded-full border-4 border-white/60 shadow-lg object-cover"
          />
        </div>
      )}

      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/60 shadow-sm mb-4 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span className="text-[11px] font-semibold text-[#86868b] tracking-wide uppercase">
          System Online
        </span>
      </div>

      {/* Display Name */}
      <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tighter mb-4 leading-tight flex items-center gap-2">
        {displayName || 'Profile'}
        {isVerified && (
          <span className="iconify text-blue-500" data-icon="lucide:badge-check" data-width="28"></span>
        )}
      </h1>

      {/* Bio */}
      {bio && (
        <p className="text-lg leading-relaxed font-medium text-[#86868b] tracking-tight max-w-md">
          {bio}
        </p>
      )}
    </div>
  )
}
