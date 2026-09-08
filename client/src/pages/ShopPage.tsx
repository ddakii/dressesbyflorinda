import { useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '@/components/ProductGrid'
import { Seo } from '@/components/Seo'
import { categories, collections, products } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { loc, productInStock } from '@/types'

const sizes = ['XS', 'S', 'M', 'L', 'XL']

export function ShopPage() {
  const { t } = useI18n()
  const [params, setParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)

  const category = params.get('category') ?? ''
  const size = params.get('size') ?? ''
  const color = params.get('color') ?? ''
  const collection = params.get('collection') ?? ''
  const availability = params.get('availability') ?? ''
  const sort = params.get('sort') ?? 'featured'
  const maxPrice = Number(params.get('max') || 0)

  const colors = [...new Set(products.flatMap((p) => p.variants.map((v) => v.color)))]

  const filtered = useMemo(() => {
    let list = products.filter((p) => !p.archived)
    if (category === 'new-arrivals') list = list.filter((p) => p.newArrival)
    else if (category === 'best-sellers') list = list.filter((p) => p.featured)
    else if (category) {
      const cat = categories.find((c) => c.slug === category)
      if (cat) list = list.filter((p) => p.categoryId === cat.id)
    }
    if (collection) {
      const col = collections.find((c) => c.slug === collection)
      if (col) list = list.filter((p) => p.collectionId === col.id)
    }
    if (size) list = list.filter((p) => p.variants.some((v) => v.size === size.toUpperCase() && v.stock > 0))
    if (color) list = list.filter((p) => p.variants.some((v) => v.color.toLowerCase() === color.toLowerCase()))
    if (availability === 'in') list = list.filter(productInStock)
    if (availability === 'out') list = list.filter((p) => !productInStock(p))
    if (maxPrice) list = list.filter((p) => (p.salePrice ?? p.price) <= maxPrice)

    if (sort === 'newest') list = [...list].reverse()
    if (sort === 'price-asc') list = [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    if (sort === 'price-desc') list = [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
    return list
  }, [category, size, color, collection, availability, sort, maxPrice])

  function set(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const filters = (
    <Filters
      category={category}
      size={size}
      color={color}
      collection={collection}
      availability={availability}
      maxPrice={maxPrice}
      colors={colors}
      onChange={set}
      onClear={() => setParams({})}
    />
  )

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
      <Seo title={`${t('shop.title')} | Dresses by Florinda`} description={t('shop.description')} />
      <h1 className="font-serif text-4xl font-light md:text-5xl">{t('shop.title')}</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">{t('shop.description')}</p>

      <div className="mt-8 flex items-center justify-between border-y border-line py-4 lg:hidden">
        <button type="button" className="text-[11px] tracking-[0.2em] uppercase" onClick={() => setMobileFilters(true)}>
          {t('shop.filter')}
        </button>
        <select
          value={sort}
          onChange={(e) => set('sort', e.target.value)}
          className="bg-transparent text-[11px] tracking-[0.16em] uppercase outline-none"
          aria-label={t('shop.sort')}
        >
          <option value="featured">{t('shop.featured')}</option>
          <option value="newest">{t('shop.newest')}</option>
          <option value="price-asc">{t('shop.priceAsc')}</option>
          <option value="price-desc">{t('shop.priceDesc')}</option>
        </select>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          <div className="mb-8 hidden items-center justify-between lg:flex">
            <p className="text-sm text-muted">{t('shop.results', { count: filtered.length })}</p>
            <select
              value={sort}
              onChange={(e) => set('sort', e.target.value)}
              className="bg-transparent text-[11px] tracking-[0.16em] uppercase outline-none"
              aria-label={t('shop.sort')}
            >
              <option value="featured">{t('shop.featured')}</option>
              <option value="newest">{t('shop.newest')}</option>
              <option value="price-asc">{t('shop.priceAsc')}</option>
              <option value="price-desc">{t('shop.priceDesc')}</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <p className="py-20 text-center font-serif text-3xl font-light">{t('shop.empty')}</p>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>

      {mobileFilters ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/30" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto bg-ivory px-5 py-6">
            <div className="mb-4 flex justify-between">
              <p className="text-[11px] tracking-[0.2em] uppercase">{t('shop.filters')}</p>
              <button type="button" onClick={() => setMobileFilters(false)}>
                {t('nav.close')}
              </button>
            </div>
            {filters}
            <button
              type="button"
              className="mt-6 w-full bg-ink py-3 text-[11px] tracking-[0.2em] text-ivory uppercase"
              onClick={() => setMobileFilters(false)}
            >
              {t('shop.apply')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Filters({
  category,
  size,
  color,
  collection,
  availability,
  maxPrice,
  colors,
  onChange,
  onClear,
}: {
  category: string
  size: string
  color: string
  collection: string
  availability: string
  maxPrice: number
  colors: string[]
  onChange: (key: string, value: string) => void
  onClear: () => void
}) {
  const { locale, t } = useI18n()

  return (
    <div className="space-y-8 text-sm">
      <FilterGroup label={t('shop.category')}>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={category === c.slug ? 'text-ink' : 'text-muted'}
            onClick={() => onChange('category', category === c.slug ? '' : c.slug)}
          >
            {loc(c.name, locale)}
          </button>
        ))}
      </FilterGroup>
      <FilterGroup label={t('shop.size')}>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              className={`min-w-8 border px-2 py-1 text-xs ${size === s.toLowerCase() || size === s ? 'border-ink' : 'border-line'}`}
              onClick={() => onChange('size', size === s.toLowerCase() || size === s ? '' : s.toLowerCase())}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label={t('shop.color')}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={color.toLowerCase() === c.toLowerCase() ? 'text-ink' : 'text-muted'}
            onClick={() => onChange('color', color.toLowerCase() === c.toLowerCase() ? '' : c.toLowerCase())}
          >
            {c}
          </button>
        ))}
      </FilterGroup>
      <FilterGroup label={t('shop.collection')}>
        {collections.map((c) => (
          <button
            key={c.id}
            type="button"
            className={collection === c.slug ? 'text-ink' : 'text-muted'}
            onClick={() => onChange('collection', collection === c.slug ? '' : c.slug)}
          >
            {loc(c.name, locale)}
          </button>
        ))}
      </FilterGroup>
      <FilterGroup label={t('shop.availability')}>
        <button type="button" className={availability === 'in' ? 'text-ink' : 'text-muted'} onClick={() => onChange('availability', availability === 'in' ? '' : 'in')}>
          {t('shop.inStock')}
        </button>
        <button type="button" className={availability === 'out' ? 'text-ink' : 'text-muted'} onClick={() => onChange('availability', availability === 'out' ? '' : 'out')}>
          {t('shop.outOfStock')}
        </button>
      </FilterGroup>
      <FilterGroup label={t('shop.price')}>
        <input
          type="range"
          min={20000}
          max={55000}
          step={1000}
          value={maxPrice || 55000}
          onChange={(e) => onChange('max', e.target.value)}
          className="w-full"
        />
      </FilterGroup>
      <button type="button" className="text-[11px] tracking-[0.18em] uppercase text-muted" onClick={onClear}>
        {t('shop.clear')}
      </button>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] tracking-[0.2em] uppercase">{label}</p>
      <div className="flex flex-col items-start gap-2">{children}</div>
    </div>
  )
}
