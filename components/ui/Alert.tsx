type AlertVariant = 'error' | 'success' | 'warning' | 'info'

interface AlertProps {
  variant: AlertVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<AlertVariant, string> = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-amber-50 border-amber-100 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
}

export default function Alert({ variant, children, className }: AlertProps) {
  return (
    <div className={`p-4 border rounded-lg ${variantStyles[variant]} ${className || ''}`}>
      {typeof children === 'string' ? (
        <p className="text-sm font-medium">{children}</p>
      ) : (
        children
      )}
    </div>
  )
}
