type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default'

interface StatusBadgeProps {
  status: string
  colorMap?: Record<string, StatusVariant>
  className?: string
}

const variantColors: Record<StatusVariant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800',
}

const defaultColorMap: Record<string, StatusVariant> = {
  // booking statuses
  pending: 'warning',
  confirmed: 'info',
  cancelled: 'error',
  completed: 'success',
  // KYC statuses
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'error',
  NOT_SUBMITTED: 'default',
  // payout statuses
  processing: 'info',
  failed: 'error',
  // user roles
  USER: 'info',
  HOST: 'success',
  ADMIN: 'error',
}

export default function StatusBadge({ status, colorMap, className }: StatusBadgeProps) {
  const map = colorMap || defaultColorMap
  const variant = map[status] || 'default'
  const colors = variantColors[variant]

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors} ${className || ''}`}>
      {status}
    </span>
  )
}

export { variantColors, defaultColorMap }
export type { StatusVariant }
