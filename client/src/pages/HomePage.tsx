import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/ProductCard'
import { Seo } from '@/components/Seo'
import { products } from '@/data/catalog'
import { useI18n } from '@/lib/i18n'

export function HomePage() {
  const { t } = useI18n()
  const arrivals = products.filter((p) => p.newArrival).slice(0, 4)

  return (
    <>
      <Seo
        title="Dresses by Florinda | Luxury Women's Dresses"
        description="A luxury women's fashion house. Evening, occasion and bridal silhouettes."
        image="/images/look-16.jpg"
      />

      <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#4a1418]">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[1fr_1.12fr_1fr]">
          <img
            src="/images/look-15.jpg"
            alt=""
            decoding="async"
            className="hidden h-full w-full object-cover object-[center_16%] md:block"
          />
          <img
            src="/images/look-16.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[center_28%] md:object-[center_38%]"
          />
          <img
            src="/images/look-07.jpg"
            alt=""
            decoding="async"
            className="hidden h-full w-full object-cover object-[center_42%] md:block"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/15" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-16 text-center text-ivory md:pb-20">
          <p className="animate-fade-up text-[11px] tracking-[0.32em] uppercase">{t('home.heroEyebrow')}</p>
          <h1 className="animate-fade-up delay-200 mt-4 font-serif text-5xl font-light italic md:text-7xl">
            {t('home.heroTitle')}
          </h1>
          <Link
            to="/collections/new-season"
            className="animate-fade-up delay-500 mt-8 text-[11px] tracking-[0.24em] uppercase"
          >
            {t('home.heroCta')} →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-20 md:px-8 md:py-28">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted">{t('home.featuredEyebrow')}</p>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl font-light md:text-5xl">
          {t('home.featuredTitle')}
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-muted">{t('home.featuredText')}</p>

        <div className="mt-14 grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
          <EditorialTile
            to="/shop?category=evening"
            image="/images/look-16.jpg"
            title={t('mega.evening')}
            cta={t('home.explore')}
            large
          />
          <EditorialTile
            to="/shop?category=occasion"
            image="/images/look-19.jpg"
            title={t('mega.occasion')}
            cta={t('home.explore')}
          />
          <EditorialTile
            to="/shop?category=new-arrivals"
            image="/images/look-12.jpg"
            title={t('nav.newArrivals')}
            cta={t('home.explore')}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-24 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-4xl font-light">{t('home.newArrivals')}</h2>
            <p className="mt-2 text-sm text-muted">{t('home.newArrivalsText')}</p>
          </div>
          <Link to="/shop" className="hidden text-[11px] tracking-[0.2em] uppercase md:inline">
            {t('home.viewAll')} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link to="/shop" className="mt-10 block text-center text-[11px] tracking-[0.2em] uppercase md:hidden">
          {t('home.viewAll')} →
        </Link>
      </section>

      <section className="grid md:grid-cols-2">
        <img src="/images/look-23.jpg" alt="" loading="lazy" decoding="async" className="h-full min-h-[420px] w-full object-cover object-[center_20%]" />
        <div className="flex flex-col justify-center bg-beige px-8 py-16 md:px-16">
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted">{t('home.atelierEyebrow')}</p>
          <h2 className="mt-4 font-serif text-4xl font-light">{t('home.atelierTitle')}</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">{t('home.atelierText')}</p>
          <Link to="/about" className="mt-8 text-[11px] tracking-[0.2em] uppercase">
            {t('home.atelierCta')} →
          </Link>
        </div>
      </section>
    </>
  )
}

function EditorialTile({
  to,
  image,
  title,
  cta,
  large,
}: {
  to: string
  image: string
  title: string
  cta: string
  large?: boolean
}) {
  return (
    <Link to={to} className={`group relative overflow-hidden ${large ? 'md:row-span-2 min-h-[420px] md:min-h-0' : 'min-h-[240px]'}`}>
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_18%] md:transition-transform md:duration-700 md:group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-ink/20" />
      <div className="absolute bottom-6 left-6 text-ivory">
        <p className="font-serif text-3xl font-light">{title}</p>
        <p className="mt-2 text-[11px] tracking-[0.2em] uppercase">
          {cta} →
        </p>
      </div>
    </Link>
  )
}
