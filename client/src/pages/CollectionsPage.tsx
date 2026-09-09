import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductGrid } from '@/components/ProductGrid'
import { Seo } from '@/components/Seo'
import { collections as fallbackCollections, products as fallbackProducts } from '@/data/catalog'
import { fetchCollection, fetchCollections } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { loc, type Collection, type Product } from '@/types'

export function CollectionsPage() {
  const { locale, t } = useI18n()
  const [list, setList] = useState<Collection[]>(fallbackCollections)

  useEffect(() => {
    void fetchCollections().then(setList)
  }, [])

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
      <Seo title={`${t('nav.collections')} | Dresses by Florinda`} description={t('home.featuredText')} />
      <h1 className="mb-12 font-serif text-5xl font-light">{t('nav.collections')}</h1>
      <div className="grid gap-8 md:grid-cols-3">
        {list.map((collection) => (
          <Link key={collection.id} to={`/collections/${collection.slug}`} className="group">
            <div className="overflow-hidden">
              <img
                src={collection.heroImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[3/4] w-full object-cover md:transition-transform md:duration-700 md:group-hover:scale-[1.03]"
              />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-light">{loc(collection.name, locale)}</h2>
            <p className="mt-2 text-[11px] tracking-[0.18em] uppercase">{t('shop.viewCollection')} →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function CollectionDetailPage() {
  const { slug } = useParams()
  const { locale, t } = useI18n()
  const fallback = fallbackCollections.find((c) => c.slug === slug)
  const [collection, setCollection] = useState<Collection | null>(fallback ?? null)
  const [items, setItems] = useState<Product[]>(
    fallback ? fallbackProducts.filter((p) => p.collectionId === fallback.id && !p.archived) : [],
  )

  useEffect(() => {
    if (!slug) return
    void fetchCollection(slug).then((data) => {
      if (!data) {
        setCollection(null)
        setItems([])
        return
      }
      setCollection(data.collection)
      setItems(data.products)
    })
  }, [slug])

  if (!collection) {
    return <p className="px-4 py-24 text-center">{t('errors.notFound')}</p>
  }

  return (
    <div>
      <Seo
        title={`${loc(collection.name, locale)} | Dresses by Florinda`}
        description={loc(collection.description, locale)}
        image={collection.heroImage}
      />
      <section className="relative h-[55vh] min-h-[380px]">
        <img src={collection.heroImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ivory">
          <h1 className="font-serif text-5xl font-light">{loc(collection.name, locale)}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7">{loc(collection.description, locale)}</p>
        </div>
      </section>
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
        <ProductGrid products={items} />
      </div>
    </div>
  )
}
