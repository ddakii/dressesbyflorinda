import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/stores'
import { useI18n } from '@/lib/i18n'

type Props = {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className = '' }: Props) {
  const { t } = useI18n()
  const ids = useWishlistStore((s) => s.ids)
  const toggle = useWishlistStore((s) => s.toggle)
  const active = ids.includes(productId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-pressed={active}
      aria-label={active ? t('product.inWishlist') : t('product.wishlist')}
      className={`inline-flex h-9 w-9 items-center justify-center text-ink transition-transform duration-400 hover:scale-110 ${className}`}
    >
      <Heart
        size={17}
        strokeWidth={1.25}
        className={active ? 'fill-ink' : ''}
      />
    </button>
  )
}
