import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/Button'
import { products } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { useCartStore, useUiStore } from '@/lib/stores'
import { formatPrice, loc } from '@/types'

export function CartDrawer() {
  const { locale, t } = useI18n()
  const open = useUiStore((s) => s.cartOpen)
  const setOpen = useUiStore((s) => s.setCartOpen)
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      const variant = product?.variants.find((v) => v.id === item.variantId)
      if (!product || !variant) return null
      const price = product.salePrice ?? product.price
      return { item, product, variant, price }
    })
    .filter((line) => line !== null)

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.item.quantity, 0)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/30"
        aria-label={t('nav.close')}
        onClick={() => setOpen(false)}
      />
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-[12px] tracking-[0.22em] uppercase">{t('cart.title')}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label={t('nav.close')}>
            <X size={18} strokeWidth={1.25} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-3xl font-light">{t('cart.emptyTitle')}</p>
            <p className="mt-3 text-sm text-muted">{t('cart.empty')}</p>
            <Link to="/shop" className="mt-8" onClick={() => setOpen(false)}>
              <Button variant="secondary">{t('cart.explore')} →</Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-auto px-6 py-6">
              {lines.map(({ item, product, variant, price }) => (
                <li key={item.variantId} className="mb-8 flex gap-4">
                  <img
                    src={product.images[0]?.url}
                    alt=""
                    className="h-28 w-20 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-serif text-lg font-light">{loc(product.name, locale)}</p>
                    <p className="mt-1 text-xs text-muted">
                      {variant.size} · {variant.color}
                    </p>
                    <p className="mt-2 text-sm">{formatPrice(price, locale)}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-3 border border-line px-3 py-1 text-xs">
                        <button type="button" onClick={() => updateQty(item.variantId, item.quantity - 1)} aria-label="-">
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.variantId, Math.min(item.quantity + 1, variant.stock))}
                          aria-label="+"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[10px] tracking-[0.16em] uppercase text-muted"
                        onClick={() => removeItem(item.variantId)}
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-6">
              <div className="mb-2 flex justify-between text-sm">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              <p className="mb-6 text-xs text-muted">{t('cart.shippingNote')}</p>
              <Link to="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full">{t('cart.checkout')}</Button>
              </Link>
              <button
                type="button"
                className="mt-4 w-full text-[11px] tracking-[0.18em] uppercase"
                onClick={() => setOpen(false)}
              >
                {t('cart.continue')}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
