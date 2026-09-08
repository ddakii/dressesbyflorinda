import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { siteContent } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'
import { loc } from '@/types'

export function AboutPage() {
  const { locale, t } = useI18n()
  const about = siteContent.about

  return (
    <div>
      <Seo title={`${t('about.title')} | Dresses by Florinda`} description={loc(about.intro, locale)} />
      <section className="relative h-[60vh] min-h-[420px]">
        <img src="/images/look-27.jpg" alt="" className="h-full w-full object-cover object-[center_18%]" />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-ivory">
          <p className="text-[11px] tracking-[0.28em] uppercase">{t('about.eyebrow')}</p>
          <h1 className="mt-4 font-serif text-5xl font-light md:text-6xl">{t('about.title')}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-base leading-8 text-muted">{loc(about.intro, locale)}</p>
      </section>
      <section className="grid md:grid-cols-2">
        <img src="/images/look-23.jpg" alt="" loading="lazy" decoding="async" className="h-full min-h-[380px] w-full object-cover object-[center_20%]" />
        <div className="flex flex-col justify-center px-8 py-16 md:px-16">
          <h2 className="font-serif text-3xl font-light">Florinda</h2>
          <p className="mt-5 text-sm leading-8 text-muted">{loc(about.florinda, locale)}</p>
        </div>
      </section>
      <section className="grid md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-8 py-16 md:order-1 md:px-16">
          <h2 className="font-serif text-3xl font-light">{locale === 'sq' ? 'Zejtaria' : 'Craft'}</h2>
          <p className="mt-5 text-sm leading-8 text-muted">{loc(about.craft, locale)}</p>
        </div>
        <img src="/images/look-18.jpg" alt="" loading="lazy" decoding="async" className="order-1 h-full min-h-[380px] w-full object-cover object-[center_18%] md:order-2" />
      </section>
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-serif text-3xl font-light italic">{loc(about.philosophy, locale)}</p>
        <Link to="/shop" className="mt-10 inline-block text-[11px] tracking-[0.2em] uppercase">
          {t('about.cta')} →
        </Link>
      </section>
    </div>
  )
}
