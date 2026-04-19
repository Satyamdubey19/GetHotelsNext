'use client'

interface FilterTabsProps<T extends string> {
  tabs: T[]
  active: T
  onChange: (tab: T) => void
  formatLabel?: (tab: T) => string
  className?: string
}

export default function FilterTabs<T extends string>({
  tabs,
  active,
  onChange,
  formatLabel,
  className,
}: FilterTabsProps<T>) {
  return (
    <div className={`flex gap-2 flex-wrap ${className || ''}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            active === tab
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {formatLabel ? formatLabel(tab) : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}
