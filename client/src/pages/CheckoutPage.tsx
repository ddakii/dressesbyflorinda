import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Seo } from '@/components/Seo'
import { products } from '@/data/catalog'
import { createCheckoutSession } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { emptyAddress, useCartStore } from '@/lib/stores'
import { formatPrice, loc } from '@/types'

const steps = ['contact', 'shipping', 'payment', 'review'] as const

export function CheckoutPage() {
  const { locale, t } = useI18n()
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ ...emptyAddress, paymentMethod: 'cod' as 'cod' | 'bank' | 'card' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          const variant = product?.variants.find((v) => v.id === item.variantId)
          if (!product || !variant) return null
          return { item, product, variant, price: product.salePrice ?? product.price }
        })
        .filter((line) => line !== null),
    [items],
  )

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.item.quantity, 0)
  const shipping = subtotal >= 40000 ? 0 : 1500
  const total = subtotal + shipping
  const cardConfigured = Boolean(import.meta.env.VITE_PAYMENT_PUBLIC_KEY)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    if (step === 0) return form.firstName && form.lastName && form.email && form.phone
    if (step === 1) return form.country && form.city && form.address && form.postalCode
    return true
  }

  async function placeOrder() {
    setBusy(true)
    setError('')
    try {
      const session = await createCheckoutSession({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        paymentMethod: form.paymentMethod,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          country: form.country,
          city: form.city,
          address: form.address,
          apartment: form.apartment,
          postalCode: form.postalCode,
        },
      })

      if (!session) {
        const localOrder = {
          id: `local-${Date.now()}`,
          number: `DBF-${Date.now().toString().slice(-6)}`,
          total,
          shipping,
          status: 'pending',
          paymentStatus: form.paymentMethod === 'cod' ? 'pending' : 'pending',
          paymentMethod: form.paymentMethod,
          items: lines.map((line) => ({
            name: loc(line.product.name, locale),
            quantity: line.item.quantity,
            price: line.price,
            size: line.variant.size,
            color: line.variant.color,
            image: line.product.images[0]?.url ?? '',
          })),
          address: form,
          createdAt: new Date().toISOString(),
        }
        window.sessionStorage.setItem('florinda.lastOrder', JSON.stringify(localOrder))
        clear()
        navigate(`/order/${localOrder.id}`)
        return
      }

      if (session.mode === 'redirect' && session.url) {
        window.location.href = session.url
        return
      }

      if (session.order) {
        window.sessionStorage.setItem('florinda.lastOrder', JSON.stringify(session.order))
        clear()
        navigate(`/order/${session.order.id}`)
      }
    } catch {
      setError(t('checkout.failed'))
    } finally {
      setBusy(false)
    }
  }

  function onContinue(e: FormEvent) {
    e.preventDefault()
    if (!validate()) {
      setError(t('checkout.invalid'))
      return
    }
    setError('')
    if (step < 3) setStep((s) => s + 1)
    else void placeOrder()
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="font-serif text-3xl font-light">{t('checkout.emptyCart')}</p>
        <Link to="/shop" className="mt-6 inline-block text-[11px] tracking-[0.2em] uppercase">
          {t('cart.explore')} →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-12 md:px-8 lg:grid-cols-[1fr_380px]">
      <Seo title={`${t('checkout.title')} | Dresses by Florinda`} description={t('checkout.guest')} />
      <div>
        <h1 className="font-serif text-4xl font-light">{t('checkout.title')}</h1>
        <p className="mt-2 text-sm text-muted">{t('checkout.guest')}</p>
        <ol className="mt-8 flex flex-wrap gap-4 text-[11px] tracking-[0.16em] uppercase">
          {steps.map((s, i) => (
            <li key={s} className={i === step ? 'text-ink' : 'text-muted'}>
              {i + 1}. {t(`checkout.${s}`)}
            </li>
          ))}
        </ol>

        <form onSubmit={onContinue} className="mt-10 space-y-5">
          {step === 0 ? (
            <>
              <Field label={t('checkout.firstName')} value={form.firstName} onChange={(v) => set('firstName', v)} />
              <Field label={t('checkout.lastName')} value={form.lastName} onChange={(v) => set('lastName', v)} />
              <Field label={t('checkout.email')} type="email" value={form.email} onChange={(v) => set('email', v)} />
              <Field label={t('checkout.phone')} value={form.phone} onChange={(v) => set('phone', v)} />
            </>
          ) : null}
          {step === 1 ? (
            <>
              <Field label={t('checkout.country')} value={form.country} onChange={(v) => set('country', v)} />
              <Field label={t('checkout.city')} value={form.city} onChange={(v) => set('city', v)} />
              <Field label={t('checkout.address')} value={form.address} onChange={(v) => set('address', v)} />
              <Field label={t('checkout.apartment')} value={form.apartment ?? ''} onChange={(v) => set('apartment', v)} />
              <Field label={t('checkout.postalCode')} value={form.postalCode} onChange={(v) => set('postalCode', v)} />
            </>
          ) : null}
          {step === 2 ? (
            <fieldset className="space-y-4">
              <legend className="text-[11px] tracking-[0.2em] uppercase">{t('checkout.method')}</legend>
              <PayOption
                active={form.paymentMethod === 'cod'}
                title={t('checkout.cod')}
                hint={t('checkout.codHint')}
                onClick={() => set('paymentMethod', 'cod')}
              />
              <PayOption
                active={form.paymentMethod === 'bank'}
                title={t('checkout.bank')}
                hint={t('checkout.bankHint')}
                onClick={() => set('paymentMethod', 'bank')}
              />
              <PayOption
                active={form.paymentMethod === 'card'}
                title={t('checkout.card')}
                hint={cardConfigured ? t('checkout.cardReady') : t('checkout.cardUnavailable')}
                disabled={!cardConfigured}
                onClick={() => cardConfigured && set('paymentMethod', 'card')}
              />
            </fieldset>
          ) : null}
          {step === 3 ? (
            <div className="space-y-3 text-sm leading-7">
              <p>{form.firstName} {form.lastName}</p>
              <p>{form.email} · {form.phone}</p>
              <p>{form.address}{form.apartment ? `, ${form.apartment}` : ''}</p>
              <p>{form.postalCode} {form.city}, {form.country}</p>
              <p className="text-muted">{t(`checkout.${form.paymentMethod === 'cod' ? 'cod' : form.paymentMethod === 'bank' ? 'bank' : 'card'}`)}</p>
            </div>
          ) : null}

          {error ? <p className="text-sm text-muted">{error}</p> : null}

          <div className="flex items-center justify-between pt-4">
            {step > 0 ? (
              <button type="button" className="text-[11px] tracking-[0.18em] uppercase" onClick={() => setStep((s) => s - 1)}>
                {t('checkout.back')}
              </button>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={busy}>
              {step === 3 ? t('checkout.placeOrder') : t('checkout.continue')}
            </Button>
          </div>
        </form>
      </div>

      <aside className="h-fit border border-line p-6">
        <h2 className="text-[11px] tracking-[0.2em] uppercase">{t('checkout.summary')}</h2>
        <ul className="mt-6 space-y-4">
          {lines.map((line) => (
            <li key={line.item.variantId} className="flex gap-3 text-sm">
              <img src={line.product.images[0]?.url} alt="" className="h-20 w-14 object-cover" />
              <div className="flex-1">
                <p>{loc(line.product.name, locale)}</p>
                <p className="text-xs text-muted">{line.variant.size} · {line.item.quantity}</p>
              </div>
              <p>{formatPrice(line.price * line.item.quantity, locale)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <span>{t('cart.subtotal')}</span>
            <span>{formatPrice(subtotal, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('checkout.shippingCost')}</span>
            <span>{shipping === 0 ? t('checkout.free') : formatPrice(shipping, locale)}</span>
          </div>
          <div className="flex justify-between pt-2 font-medium">
            <span>{t('checkout.total')}</span>
            <span>{formatPrice(total, locale)}</span>
          </div>
        </div>
      </aside>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.16em] uppercase text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-line bg-transparent py-2 outline-none"
      />
    </label>
  )
}

function PayOption({
  active,
  title,
  hint,
  onClick,
  disabled,
}: {
  active: boolean
  title: string
  hint: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full border px-4 py-4 text-left ${active ? 'border-ink' : 'border-line'} ${disabled ? 'opacity-50' : ''}`}
    >
      <p className="text-sm">{title}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </button>
  )
}
