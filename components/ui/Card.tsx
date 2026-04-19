type CardProps = {
  title: string
  description: string
  children?: React.ReactNode
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-zinc-950">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </article>
  )
}
