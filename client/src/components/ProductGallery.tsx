import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { loc, type ProductImage } from '@/types'

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const { locale, t } = useI18n()
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const current = images[index] ?? images[0]

  if (!current) return <div className="skeleton aspect-[3/4] w-full" />

  return (
    <div className="lg:grid lg:grid-cols-[80px_1fr] lg:gap-4">
      <div className="hidden flex-col gap-3 lg:flex">
        {images.map((image, i) => (
          <button
            key={image.url + i}
            type="button"
            onClick={() => setIndex(i)}
            className={`overflow-hidden border ${i === index ? 'border-ink' : 'border-transparent'}`}
            aria-label={`${t('product.zoom')} ${i + 1}`}
          >
            <img src={image.url} alt="" loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover object-[center_18%]" />
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar lg:block">
          {images.map((image, i) => (
            <button
              key={image.url + i}
              type="button"
              className="min-w-full snap-center lg:min-w-0"
              onClick={() => {
                setIndex(i)
                setOpen(true)
              }}
            >
              <img
                src={image.url}
                alt={loc(image.alt, locale)}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`aspect-[3/4] w-full object-cover object-[center_18%] ${i === index ? 'lg:block' : 'lg:hidden'}`}
              />
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-2 lg:hidden">
          {images.map((_, i) => (
            <span key={i} className={`h-1 w-6 ${i === index ? 'bg-ink' : 'bg-taupe'}`} />
          ))}
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-ink/95">
          <button
            type="button"
            className="absolute right-5 top-5 text-ivory"
            onClick={() => setOpen(false)}
            aria-label={t('product.closeGallery')}
          >
            <X />
          </button>
          <img
            src={current.url}
            alt={loc(current.alt, locale)}
            className="h-full w-full object-contain"
          />
        </div>
      ) : null}
    </div>
  )
}
