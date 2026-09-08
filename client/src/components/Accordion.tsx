import { useId, useState, type ReactNode } from 'react'

type Item = {
  title: string
  content: ReactNode
}

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <div className="divide-y divide-line">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div key={item.title}>
            <button
              type="button"
              id={`${baseId}-btn-${index}`}
              aria-expanded={isOpen}
              aria-controls={`${baseId}-panel-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-5 text-left text-[11px] tracking-[0.2em] uppercase"
            >
              {item.title}
              <span aria-hidden className="text-muted">
                {isOpen ? '–' : '+'}
              </span>
            </button>
            <div
              id={`${baseId}-panel-${index}`}
              role="region"
              aria-labelledby={`${baseId}-btn-${index}`}
              hidden={!isOpen}
              className="pb-6 text-sm leading-7 text-muted"
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
