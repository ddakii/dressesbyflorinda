import { Link } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Newsletter } from '@/components/Newsletter'
import { useI18n } from '@/lib/i18n'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-line bg-ivory">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:py-24">
        <div>
          <p className="mb-5 text-[11px] tracking-nav uppercase">{t('footer.shop')}</p>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link to="/shop?category=new-arrivals">{t('nav.newArrivals')}</Link></li>
            <li><Link to="/shop">{t('nav.dresses')}</Link></li>
            <li><Link to="/collections">{t('nav.collections')}</Link></li>
            <li><Link to="/shop?category=best-sellers">{t('shop.featured')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-5 text-[11px] tracking-nav uppercase">{t('footer.about')}</p>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link to="/about">{t('footer.ourStory')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
            <li><Link to="/size-guide">{t('footer.sizeGuide')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-5 text-[11px] tracking-nav uppercase">{t('footer.care')}</p>
          <ul className="space-y-3 text-sm text-muted">
            <li><Link to="/shipping">{t('footer.shipping')}</Link></li>
            <li><Link to="/returns">{t('footer.returns')}</Link></li>
            <li><Link to="/faq">{t('footer.faq')}</Link></li>
            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link to="/terms">{t('footer.terms')}</Link></li>
          </ul>
        </div>
        <Newsletter />
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 border-t border-line px-4 py-6 text-[11px] tracking-[0.14em] text-muted md:flex-row md:items-center md:px-8">
        <p>{t('footer.rights')}</p>
        <div className="flex items-center gap-6">
          <a href="https://instagram.com/dressesbyflorinda">Instagram</a>
          <a href="https://facebook.com">Facebook</a>
          <a href="https://tiktok.com">TikTok</a>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}
