import { useState, type FormEvent } from 'react'
import { subscribeNewsletter } from '@/lib/api'
import { useI18n } from '@/lib/i18n'

export function Newsletter() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'dup' | 'err'>('idle')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('err')
      return
    }
    try {
      const res = await subscribeNewsletter(email)
      setStatus(res.duplicate ? 'dup' : 'ok')
    } catch {
      setStatus('err')
    }
  }

  return (
    <div>
      <p className="mb-5 text-[11px] tracking-nav uppercase">{t('footer.newsletter')}</p>
      <p className="font-serif text-2xl font-light">{t('footer.newsletterTitle')}</p>
      <p className="mt-2 text-sm text-muted">{t('footer.newsletterText')}</p>
      <form onSubmit={onSubmit} className="mt-6 flex border-b border-ink">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('account.email')}
          className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted"
          aria-label={t('account.email')}
        />
        <button type="submit" className="text-[11px] tracking-[0.18em] uppercase">
          {t('footer.subscribe')}
        </button>
      </form>
      {status === 'ok' ? <p className="mt-3 text-xs text-muted">{t('footer.subscribed')}</p> : null}
      {status === 'dup' ? <p className="mt-3 text-xs text-muted">{t('footer.duplicate')}</p> : null}
      {status === 'err' ? <p className="mt-3 text-xs text-muted">{t('footer.invalidEmail')}</p> : null}
    </div>
  )
}
