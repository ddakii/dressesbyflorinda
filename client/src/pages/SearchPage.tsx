import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { ProductGrid } from '@/components/ProductGrid'
import { Seo } from '@/components/Seo'
import { products } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { loc } from '@/types'

export function SearchPage() {
  const { locale, t } = useI18n()
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const results = useMemo(
    () =>
      products.filter((p) =>
        `${loc(p.name, 'en')} ${loc(p.name, 'sq')} ${p.slug} ${loc(p.description, locale)}`
          .toLowerCase()
          .includes(q),
      ),
    [q, locale],
  )

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
      <Seo title={`${t('search.results')} | Dresses by Florinda`} description={t('search.placeholder')} />
      <h1 className="font-serif text-4xl font-light">{t('search.results')}</h1>
      <p className="mt-2 text-sm text-muted">“{q}”</p>
      <div className="mt-12">
        {results.length === 0 ? (
          <EmptyState title={t('search.empty')} text={t('search.emptyText')} cta={t('wishlist.cta')} />
        ) : (
          <ProductGrid products={results} />
        )}
      </div>
    </div>
  )
}
