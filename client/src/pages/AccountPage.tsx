import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Seo } from '@/components/Seo'
import { fetchMe, fetchMyOrders, login, logout, registerAccount, type CreatedOrder } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { useAuthStore } from '@/lib/stores'
import { formatPrice } from '@/types'

export function AccountPage() {
  const { t, locale } = useI18n()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<CreatedOrder[]>([])
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirm: '',
  })

  useEffect(() => {
    void fetchMe().then((data) => {
      if (data?.user) setUser(data.user)
    }).catch(() => undefined)
  }, [setUser])

  useEffect(() => {
    if (!user) return
    void fetchMyOrders().then((data) => {
      if (data?.orders) setOrders(data.orders)
    }).catch(() => undefined)
  }, [user])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        if (form.password !== form.confirm || form.password.length < 8) {
          setError(t('account.invalid'))
          return
        }
        const data = await registerAccount({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        })
        if (data?.user) setUser(data.user)
        else setError(t('errors.network'))
      } else {
        const data = await login(form.email, form.password)
        if (data?.user) setUser(data.user)
        else setError(t('errors.network'))
      }
    } catch (err) {
      const status = (err as { status?: number }).status
      setError(status === 409 ? t('account.exists') : t('account.unauthorized'))
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <Seo title={`${t('account.login')} | Dresses by Florinda`} description={t('account.guestNote')} />
        <h1 className="font-serif text-4xl font-light">
          {mode === 'login' ? t('account.login') : t('account.register')}
        </h1>
        <p className="mt-3 text-sm text-muted">{t('account.guestNote')}</p>
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          {mode === 'register' ? (
            <>
              <Input label={t('checkout.firstName')} value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
              <Input label={t('checkout.lastName')} value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
            </>
          ) : null}
          <Input label={t('account.email')} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label={t('account.password')} type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          {mode === 'register' ? (
            <Input label={t('account.confirm')} type="password" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} />
          ) : null}
          {error ? <p className="text-sm text-muted">{error}</p> : null}
          <Button type="submit" className="w-full">
            {mode === 'login' ? t('account.submitLogin') : t('account.submitRegister')}
          </Button>
        </form>
        <button
          type="button"
          className="mt-6 text-[11px] tracking-[0.16em] uppercase"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? t('account.noAccount') : t('account.hasAccount')}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Seo title={`${t('nav.account')} | Dresses by Florinda`} description={t('account.welcome')} />
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted">{t('account.welcome')}</p>
          <h1 className="mt-2 font-serif text-4xl font-light">{user.firstName} {user.lastName}</h1>
        </div>
        <button
          type="button"
          className="text-[11px] tracking-[0.16em] uppercase"
          onClick={async () => {
            await logout()
            setUser(null)
          }}
        >
          {t('account.logout')}
        </button>
      </div>
      <h2 className="mt-12 text-[11px] tracking-[0.2em] uppercase">{t('account.orders')}</h2>
      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{t('account.emptyOrders')}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between py-4 text-sm">
              <Link to={`/order/${order.id}`}>{order.number}</Link>
              <span>{formatPrice(order.total, locale)}</span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/wishlist" className="mt-10 inline-block text-[11px] tracking-[0.18em] uppercase">
        {t('account.wishlist')} →
      </Link>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
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
