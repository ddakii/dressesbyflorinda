import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { products } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { useUiStore } from '@/lib/stores'
import { formatPrice, loc } from '@/types'

export function SearchOverlay() {
  const { locale, t } = useI18n()
  const open = useUiStore((s) => s.searchOpen)
  const setOpen = useUiStore((s) => s.setSearchOpen)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const suggestions = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (query.length < 1) return []
    return products
      .filter((p) =>
        `${loc(p.name, 'en')} ${loc(p.name, 'sq')} ${p.slug}`.toLowerCase().includes(query),
      )
      .slice(0, 6)
  }, [q])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-ivory/98 animate-fade-in">
      <div className="mx-auto max-w-3xl px-4 pt-10 md:pt-16">
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.22em] uppercase">{t('search.title')}</p>
          <button type="button" onClick={() => setOpen(false)} aria-label={t('nav.close')}>
            <X size={20} strokeWidth={1.25} />
          </button>
        </div>
        <form
          className="mt-8 border-b border-ink"
          onSubmit={(e) => {
            e.preventDefault()
            if (!q.trim()) return
            setOpen(false)
            navigate(`/search?q=${encodeURIComponent(q.trim())}`)
          }}
        >
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-transparent py-4 font-serif text-3xl font-light outline-none placeholder:text-taupe md:text-4xl"
            aria-label={t('search.title')}
          />
        </form>
        <ul className="mt-8 space-y-4">
          {suggestions.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                className="flex w-full items-center gap-4 text-left"
                onClick={() => {
                  setOpen(false)
                  navigate(`/shop/${product.slug}`)
                }}
              >
                <img src={product.images[0]?.url} alt="" className="h-16 w-12 object-cover" />
                <span className="flex-1 font-serif text-xl font-light">{loc(product.name, locale)}</span>
                <span className="text-sm">{formatPrice(product.salePrice ?? product.price, locale)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
