import { useState, type FormEvent } from 'react'
import { Accordion } from '@/components/Accordion'
import { Button } from '@/components/Button'
import { Seo } from '@/components/Seo'
import { siteContent } from '@/data/catalog'
import { sendContact } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { loc } from '@/types'

export function ContactPage() {
  const { locale, t } = useI18n()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await sendContact(form)
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <Seo title={`${t('contact.title')} | Dresses by Florinda`} description={t('contact.intro')} />
      <h1 className="font-serif text-5xl font-light">{t('contact.title')}</h1>
      <p className="mt-4 text-sm text-muted">{t('contact.intro')}</p>
      <div className="mt-12 grid gap-16 md:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <Field label={t('contact.name')} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label={t('contact.email')} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label={t('contact.subject')} value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
          <label className="block">
            <span className="text-[11px] tracking-[0.16em] uppercase text-muted">{t('contact.message')}</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="mt-2 w-full border-b border-line bg-transparent py-2 outline-none"
            />
          </label>
          <Button type="submit">{sent ? t('contact.sent') : t('contact.send')}</Button>
        </form>
        <div className="space-y-6 text-sm">
          <p><span className="text-muted">{t('contact.emailLabel')}</span><br />{siteContent.contact.email}</p>
          <p><span className="text-muted">{t('contact.phoneLabel')}</span><br />{siteContent.contact.phone}</p>
          <p><span className="text-muted">{t('contact.instagram')}</span><br />@dressesbyflorinda</p>
          <p><span className="text-muted">{t('contact.location')}</span><br />{loc(siteContent.contact.location, locale)}</p>
        </div>
      </div>
      <section className="mt-20">
        <h2 className="mb-6 font-serif text-3xl font-light">{t('contact.faq')}</h2>
        <Accordion
          items={siteContent.faqs.map((faq) => ({
            title: loc(faq.q, locale),
            content: loc(faq.a, locale),
          }))}
        />
      </section>
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
