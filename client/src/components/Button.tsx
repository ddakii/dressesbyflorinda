import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 px-7 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors duration-400 disabled:opacity-40 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-ink text-ivory hover:bg-ink/90',
    secondary: 'border border-ink/70 text-ink bg-transparent hover:bg-ink hover:text-ivory',
    ghost: 'text-ink hover:text-accent px-0 py-0',
  }

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
