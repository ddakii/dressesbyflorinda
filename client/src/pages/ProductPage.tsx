import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Accordion } from '@/components/Accordion'
import { Button } from '@/components/Button'
import { ProductCard } from '@/components/ProductCard'
import { ProductGallery } from '@/components/ProductGallery'
import { Seo } from '@/components/Seo'
import { WishlistButton } from '@/components/WishlistButton'
import { products, siteContent } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { useCartStore, useUiStore } from '@/lib/stores'
import { formatPrice, loc, productInStock } from '@/types'

export function ProductPage() {
  const { slug } = useParams()
  const { locale, t } = useI18n()
  const product = products.find((p) => p.slug === slug && !p.archived)
  const addItem = useCartStore((s) => s.addItem)
  const setCartOpen = useUiStore((s) => s.setCartOpen)
  const [color, setColor] = useState(product?.variants[0]?.color ?? '')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  const colors = useMemo(
    () => (product ? [...new Map(product.variants.map((v) => [v.color, v])).values()] : []),
    [product],
  )
  const sizes = useMemo(
    () => (product ? [...new Set(product.variants.filter((v) => v.color === color).map((v) => v.size))] : []),
    [product, color],
  )
  const variant = product?.variants.find((v) => v.color === color && v.size === size)
  const related = products.filter((p) => p.id !== product?.id && p.categoryId === product?.categoryId).slice(0, 4)

  if (!product) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="font-serif text-4xl font-light">{t('errors.notFound')}</h1>
        <Link to="/shop" className="mt-6 inline-block text-[11px] tracking-[0.2em] uppercase">
          {t('home.viewAll')} →
        </Link>
      </div>
    )
  }

  const price = product.salePrice ?? product.price
  const available = productInStock(product)

  function add() {
    if (!product) return
    if (!color) {
      setError(t('product.selectColor'))
      return
    }
    if (!size || !variant) {
      setError(t('product.selectSize'))
      return
    }
    if (variant.stock < 1) {
      setError(t('product.unavailable'))
      return
    }
    setError('')
    addItem({ productId: product.id, variantId: variant.id, quantity: qty })
    setAdded(true)
    setCartOpen(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-16">
      <Seo
        title={loc(product.metaTitle, locale)}
        description={loc(product.metaDescription, locale)}
        canonical={`/shop/${product.slug}`}
        image={product.images[0]?.url}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: loc(product.name, locale),
          description: loc(product.description, locale),
          image: product.images.map((i) => i.url),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: (price / 100).toFixed(2),
            availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} />
        <div>
          <h1 className="font-serif text-4xl font-light md:text-5xl">{loc(product.name, locale)}</h1>
          <div className="mt-4 flex items-center gap-3 text-lg">
            <span>{formatPrice(price, locale)}</span>
            {product.salePrice ? (
              <span className="text-muted line-through">{formatPrice(product.price, locale)}</span>
            ) : null}
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">{loc(product.description, locale)}</p>

          {!available ? (
            <p className="mt-8 text-sm">{t('product.unavailable')}</p>
          ) : (
            <>
              <fieldset className="mt-10">
                <legend className="text-[11px] tracking-[0.2em] uppercase">{t('product.color')}</legend>
                <div className="mt-3 flex flex-wrap gap-4">
                  {colors.map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => {
                        setColor(c.color)
                        setSize('')
                      }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`h-4 w-4 rounded-full border ${color === c.color ? 'border-ink' : 'border-line'}`}
                        style={{ background: c.colorHex }}
                      />
                      {c.color}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="text-[11px] tracking-[0.2em] uppercase">{t('product.size')}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const v = product.variants.find((item) => item.color === color && item.size === s)
                    const disabled = !v || v.stock < 1
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSize(s)}
                        className={`min-w-12 border px-3 py-2 text-xs tracking-[0.14em] ${
                          size === s ? 'border-ink bg-ink text-ivory' : 'border-line'
                        } ${disabled ? 'opacity-30' : ''}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
                <Link to="/size-guide" className="mt-3 inline-block text-[11px] tracking-[0.16em] uppercase text-muted">
                  {t('product.sizeGuide')}
                </Link>
              </fieldset>

              <div className="mt-8">
                <p className="text-[11px] tracking-[0.2em] uppercase">{t('product.quantity')}</p>
                <div className="mt-3 inline-flex items-center gap-4 border border-line px-4 py-2">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(q + 1, variant?.stock ?? 8))}>+</button>
                </div>
              </div>

              {error ? <p className="mt-4 text-sm text-muted">{error}</p> : null}

              <div className="mt-8 flex items-center gap-3">
                <Button onClick={add} className="flex-1">
                  {added ? `✓ ${t('product.addedToBag')}` : t('product.addToBag')}
                </Button>
                <div className="border border-line">
                  <WishlistButton productId={product.id} />
                </div>
              </div>
            </>
          )}

          <div className="mt-12">
            <Accordion
              items={[
                { title: t('product.description'), content: loc(product.description, locale) },
                { title: t('product.details'), content: loc(product.details, locale) },
                { title: t('product.sizeFit'), content: loc(product.sizeFit, locale) },
                { title: t('product.shipping'), content: loc(siteContent.shipping, locale) },
              ]}
            />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-24">
          <h2 className="mb-10 font-serif text-3xl font-light">{t('product.youMayAlso')}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
