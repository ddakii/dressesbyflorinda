import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WishlistButton } from '@/components/WishlistButton'
import { useI18n } from '@/lib/i18n'
import { useCartStore, useUiStore } from '@/lib/stores'
import { formatPrice, loc, productInStock, type Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useI18n()
  const [hover, setHover] = useState(false)
  const [quick, setQuick] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const setCartOpen = useUiStore((s) => s.setCartOpen)
  const showToast = useUiStore((s) => s.showToast)
  const inStock = productInStock(product)
  const primary = product.images[0]
  const secondary = product.images[1] ?? product.images[0]
  const colors = [...new Map(product.variants.map((v) => [v.color, v])).values()]
  const displayPrice = product.salePrice ?? product.price
  const sizes = [...new Set(product.variants.map((v) => v.size))]

  return (
    <article
      className="group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setQuick(false)
      }}
    >
      <div className="relative overflow-hidden bg-beige">
        <Link to={`/shop/${product.slug}`} className="block aspect-[3/4]">
          <img
            src={primary.url}
            alt={loc(primary.alt, locale)}
            className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
            loading="lazy"
            decoding="async"
          />
          {hover && secondary && secondary.url !== primary.url ? (
            <img
              src={secondary.url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
              decoding="async"
            />
          ) : null}
        </Link>
        <div className="absolute right-2 top-2 z-10">
          <WishlistButton productId={product.id} />
        </div>
        {!inStock ? (
          <p className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] uppercase text-ivory">
            {t('shop.outOfStock')}
          </p>
        ) : (
          <div className="absolute inset-x-0 bottom-0 hidden p-3 md:block">
            <div
              className={`bg-ivory/95 p-3 transition-all duration-500 ${hover ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
            >
              {!quick ? (
                <button
                  type="button"
                  className="w-full text-[10px] tracking-[0.2em] uppercase"
                  onClick={() => setQuick(true)}
                >
                  {t('product.addToBag')}
                </button>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {sizes.map((size) => {
                    const variant = product.variants.find((v) => v.size === size && v.stock > 0)
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!variant}
                        className="min-w-8 text-[10px] tracking-[0.16em] uppercase disabled:text-taupe"
                        onClick={() => {
                          if (!variant) return
                          addItem({ productId: product.id, variantId: variant.id, quantity: 1 })
                          showToast(t('product.addedToBag'))
                          setCartOpen(true)
                        }}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="pt-4">
        <Link to={`/shop/${product.slug}`} className="font-serif text-lg font-light tracking-wide">
          {loc(product.name, locale)}
        </Link>
        <div className="mt-1 flex items-center gap-3 text-sm">
          {product.salePrice ? (
            <>
              <span>{formatPrice(displayPrice, locale)}</span>
              <span className="text-muted line-through">{formatPrice(product.price, locale)}</span>
            </>
          ) : (
            <span>{formatPrice(product.price, locale)}</span>
          )}
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden>
          {colors.map((color) => (
            <span
              key={color.color}
              className="h-2.5 w-2.5 rounded-full border border-line"
              style={{ background: color.colorHex }}
              title={color.color}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[3/4]" />
      <div className="skeleton mt-4 h-5 w-2/3" />
      <div className="skeleton mt-2 h-4 w-16" />
    </div>
  )
}
