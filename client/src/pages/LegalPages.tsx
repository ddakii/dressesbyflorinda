import { Accordion } from '@/components/Accordion'
import { Seo } from '@/components/Seo'
import { siteContent } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { loc } from '@/types'

function Legal({ titleKey, body }: { titleKey: string; body: string }) {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Seo title={`${t(titleKey)} | Dresses by Florinda`} description={t('legal.editable')} />
      <h1 className="font-serif text-4xl font-light">{t(titleKey)}</h1>
      <p className="mt-8 text-sm leading-8 text-muted">{body}</p>
      <p className="mt-6 text-xs text-muted">{t('legal.editable')}</p>
    </div>
  )
}

export function ShippingPage() {
  const { locale } = useI18n()
  return <Legal titleKey="legal.shipping" body={loc(siteContent.shipping, locale)} />
}

export function ReturnsPage() {
  const { locale } = useI18n()
  return <Legal titleKey="legal.returns" body={loc(siteContent.returns, locale)} />
}

export function PrivacyPage() {
  const { locale } = useI18n()
  return <Legal titleKey="legal.privacy" body={loc(siteContent.privacy, locale)} />
}

export function TermsPage() {
  const { locale } = useI18n()
  return <Legal titleKey="legal.terms" body={loc(siteContent.terms, locale)} />
}

export function FaqPage() {
  const { locale, t } = useI18n()
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Seo title={`${t('footer.faq')} | Dresses by Florinda`} description={t('contact.intro')} />
      <h1 className="mb-10 font-serif text-4xl font-light">{t('footer.faq')}</h1>
      <Accordion
        items={siteContent.faqs.map((faq) => ({
          title: loc(faq.q, locale),
          content: loc(faq.a, locale),
        }))}
      />
    </div>
  )
}

export function SizeGuidePage() {
  const { t } = useI18n()
  const rows = [
    ['XS', '80', '62', '86'],
    ['S', '84', '66', '90'],
    ['M', '88', '70', '94'],
    ['L', '92', '74', '98'],
    ['XL', '96', '78', '102'],
  ]
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Seo title={`${t('legal.sizeGuide')} | Dresses by Florinda`} description={t('legal.sizeIntro')} />
      <h1 className="font-serif text-4xl font-light">{t('legal.sizeGuide')}</h1>
      <p className="mt-6 text-sm leading-7 text-muted">{t('legal.sizeIntro')}</p>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] tracking-[0.16em] uppercase text-muted">
            <th className="py-3">{t('product.size')}</th>
            <th>{t('legal.bust')}</th>
            <th>{t('legal.waist')}</th>
            <th>{t('legal.hip')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-line">
              {row.map((cell) => (
                <td key={cell} className="py-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="px-4 py-28 text-center">
      <h1 className="font-serif text-4xl font-light">{t('errors.notFound')}</h1>
      <a href="/" className="mt-6 inline-block text-[11px] tracking-[0.2em] uppercase">
        {t('common.backHome')} →
      </a>
    </div>
  )
}
