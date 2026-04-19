import Link from 'next/link'

type StatCardColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'indigo'

interface StatCardProps {
  title: string
  value: number | string
  icon: string
  color?: StatCardColor
  href?: string
  highlight?: boolean
  change?: string
  variant?: 'admin' | 'host'
}

const adminColors: Record<StatCardColor, string> = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  red: 'bg-red-50 border-red-200',
  purple: 'bg-purple-50 border-purple-200',
  orange: 'bg-orange-50 border-orange-200',
  indigo: 'bg-indigo-50 border-indigo-200',
}

export default function StatCard({ title, value, icon, color = 'blue', href, highlight, change, variant = 'admin' }: StatCardProps) {
  if (variant === 'host') {
    const content = (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            {change && <p className="text-green-600 text-sm font-semibold mt-2">{change} from last month</p>}
          </div>
          <span className="text-4xl">{icon}</span>
        </div>
      </div>
    )
    return href ? <Link href={href}>{content}</Link> : content
  }

  const content = (
    <div
      className={`${adminColors[color]} ${
        highlight ? 'ring-2 ring-offset-2 ring-red-400' : ''
      } border rounded-lg p-6 transition-all hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        <span className="text-4xl opacity-50">{icon}</span>
      </div>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
