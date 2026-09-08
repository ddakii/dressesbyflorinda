import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'

type Props = {
  title: string
  text?: string
  cta?: string
  to?: string
}

export function EmptyState({ title, text, cta, to = '/shop' }: Props) {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="font-serif text-4xl font-light">{title}</h1>
      {text ? <p className="mt-4 text-sm leading-7 text-muted">{text}</p> : null}
      {cta ? (
        <div className="mt-10">
          <Link to={to}>
            <Button variant="secondary">{cta} →</Button>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
