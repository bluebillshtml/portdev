interface AnalyticsCardProps {
  label: string
  value: number
  icon: string
}

export default function AnalyticsCard({ label, value, icon }: AnalyticsCardProps) {
  return (
    <div className="vision-window p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
        <span className="iconify text-[#007AFF]" data-icon={icon} data-width="24"></span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1d1d1f]">{value.toLocaleString()}</p>
        <p className="text-sm text-[#86868b]">{label}</p>
      </div>
    </div>
  )
}
