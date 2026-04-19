interface SpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
  minimal?: boolean
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

export default function Spinner({ message, size = 'md', fullPage, minimal }: SpinnerProps) {
  if (minimal) {
    return <div className="text-center py-12">{message || 'Loading...'}</div>
  }

  const spinner = (
    <div className="text-center">
      <div className={`inline-block animate-spin rounded-full ${sizes[size]} border-b-2 border-indigo-600`} />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex justify-center items-center h-96">
        {spinner}
      </div>
    )
  }

  return spinner
}
