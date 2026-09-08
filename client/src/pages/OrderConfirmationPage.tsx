import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Seo } from '@/components/Seo'
import { fetchOrder, type CreatedOrder } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { formatPrice } from '@/types'

export function OrderConfirmationPage() {
  const { id } = useParams()
  const { locale, t } = useI18n()
  const [order, setOrder] = useState<CreatedOrder | null>(null)

  useEffect(() => {
    const cached = window.sessionStorage.getItem('florinda.lastOrder')
    if (cached) {
      const parsed = JSON.parse(cached) as CreatedOrder
      if (!id || parsed.id === id) setOrder(parsed)
    }
    if (id && !id.startsWith('local-')) {
      void fetchOrder(id).then((data) => {
        if (data?.order) setOrder(data.order)
      })
    }
  }, [id])

  if (!order) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="font-serif text-3xl font-light">{t('errors.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Seo title={`${t('order.confirmed')} | Dresses by Florinda`} description={t('order.thanks')} />
      <p className="text-[11px] tracking-[0.28em] uppercase text-muted">{t('order.confirmed')}</p>
      <h1 className="mt-4 font-serif text-5xl font-light">{t('order.thanks')}</h1>
      <p className="mt-6 text-sm text-muted">
        {t('order.number')}: {order.number}
      </p>
      <ul className="mt-10 space-y-4 text-left">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-4 text-sm">
            <span>{item.name} · {item.size} × {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity, locale)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm">
        {t('order.total')}: {formatPrice(order.total, locale)}
      </p>
      <p className="mt-4 text-sm text-muted">
        {t('order.address')}: {order.address.address}, {order.address.city}
      </p>
      <p className="mt-2 text-sm text-muted">
        {t('order.delivery')}: {t('order.deliveryValue')}
      </p>
      <p className="mt-2 text-sm text-muted">{t('order.paymentPending')}</p>
      <Link to="/shop" className="mt-10 inline-block">
        <Button variant="secondary">{t('order.continue')} →</Button>
      </Link>
    </div>
  )
}
