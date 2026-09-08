import { EmptyState } from '@/components/EmptyState'
import { ProductGrid } from '@/components/ProductGrid'
import { Seo } from '@/components/Seo'
import { products } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { useWishlistStore } from '@/lib/stores'

export function WishlistPage() {
  const { t } = useI18n()
  const ids = useWishlistStore((s) => s.ids)
  const saved = products.filter((p) => ids.includes(p.id))

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
      <Seo title={`${t('wishlist.title')} | Dresses by Florinda`} description={t('wishlist.empty')} />
      <h1 className="mb-12 font-serif text-4xl font-light">{t('wishlist.title')}</h1>
      {saved.length === 0 ? (
        <EmptyState title={t('wishlist.empty')} text={t('wishlist.emptyText')} cta={t('wishlist.cta')} />
      ) : (
        <ProductGrid products={saved} />
      )}
    </div>
  )
}
