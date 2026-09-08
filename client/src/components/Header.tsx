import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useI18n } from '@/lib/i18n'
import { useCartStore, useUiStore, useWishlistStore } from '@/lib/stores'

export function Header() {
  const { t } = useI18n()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const menuOpen = useUiStore((s) => s.menuOpen)
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)
  const setCartOpen = useUiStore((s) => s.setCartOpen)
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const wishCount = useWishlistStore((s) => s.ids.length)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled((prev) => {
          const next = window.scrollY > 12
          return prev === next ? prev : next
        })
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setMega(false)
  }, [location.pathname, setMenuOpen])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-500 ${
        menuOpen
          ? 'border-line bg-ivory'
          : scrolled
            ? 'border-line bg-ivory'
            : 'border-transparent bg-ivory'
      }`}
    >
      <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[88px] md:px-8">
        <nav className="hidden items-center gap-8 lg:flex" aria-label={t('nav.shop')}>
          <div
            className="relative"
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
          >
            <Link
              to="/shop"
              className="text-[11px] tracking-nav uppercase"
              aria-expanded={mega}
              aria-haspopup="true"
            >
              {t('nav.collection')}
            </Link>
            {mega ? <MegaMenu onNavigate={() => setMega(false)} /> : null}
          </div>
          <Link to="/shop" className="text-[11px] tracking-nav uppercase">
            {t('nav.dresses')}
          </Link>
          <Link to="/shop?category=new-arrivals" className="text-[11px] tracking-nav uppercase">
            {t('nav.newArrivals')}
          </Link>
        </nav>

        <button
          type="button"
          className="justify-self-start lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label={t('nav.menu')}
        >
          <span className="mb-1.5 block h-px w-5 bg-ink" />
          <span className="block h-px w-5 bg-ink" />
        </button>

        <Link to="/" className="justify-self-center text-center leading-none">
          <span className="block font-serif text-[15px] font-light tracking-[0.28em] uppercase md:text-[17px]">
            {t('brandLine1')}
          </span>
          <span className="mt-1 block text-[9px] tracking-[0.32em] uppercase text-muted">
            {t('brandLine2')}
          </span>
        </Link>

        <div className="flex items-center justify-end gap-4 md:gap-5">
          <button
            type="button"
            className="hidden md:inline-flex"
            onClick={() => setSearchOpen(true)}
            aria-label={t('nav.search')}
          >
            <Search size={18} strokeWidth={1.25} />
          </button>
          <LanguageSwitcher className="hidden md:flex" />
          <Link to="/account" className="hidden md:inline-flex" aria-label={t('nav.account')}>
            <UserRound size={18} strokeWidth={1.25} />
          </Link>
          <Link to="/wishlist" className="relative hidden md:inline-flex" aria-label={t('nav.wishlist')}>
            <Heart size={18} strokeWidth={1.25} />
            {wishCount > 0 ? (
              <span className="absolute -right-2 -top-2 text-[9px]">{wishCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            className="relative"
            onClick={() => setCartOpen(true)}
            aria-label={t('nav.bag')}
          >
            <ShoppingBag size={18} strokeWidth={1.25} />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 text-[9px]">{cartCount}</span>
            ) : null}
          </button>
        </div>
      </div>

      {menuOpen ? <MobileMenu onClose={() => setMenuOpen(false)} /> : null}
    </header>
  )
}

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useI18n()
  return (
    <div className="absolute left-0 top-full z-50 w-[720px] border border-line bg-ivory p-10 shadow-none">
      <div className="grid grid-cols-3 gap-10">
        <div>
          <p className="mb-4 text-[10px] tracking-nav uppercase text-muted">{t('mega.dresses')}</p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shop?category=evening" onClick={onNavigate}>{t('mega.evening')}</Link></li>
            <li><Link to="/shop?category=occasion" onClick={onNavigate}>{t('mega.occasion')}</Link></li>
            <li><Link to="/shop?category=cocktail" onClick={onNavigate}>{t('mega.cocktail')}</Link></li>
            <li><Link to="/shop?category=new-arrivals" onClick={onNavigate}>{t('mega.newArrivals')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[10px] tracking-nav uppercase text-muted">{t('mega.collections')}</p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/collections/evening-edit" onClick={onNavigate}>{t('mega.eveningEdit')}</Link></li>
            <li><Link to="/collections/signature" onClick={onNavigate}>{t('mega.signature')}</Link></li>
            <li><Link to="/collections/new-season" onClick={onNavigate}>{t('mega.newSeason')}</Link></li>
          </ul>
        </div>
        <Link to="/collections/signature" onClick={onNavigate} className="block">
          <img src="/images/look-14.jpg" alt="" loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover object-[center_18%]" />
          <p className="mt-3 text-[10px] tracking-[0.18em] uppercase text-muted">{t('mega.editorial')}</p>
        </Link>
      </div>
    </div>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] isolate h-[100dvh] w-screen overflow-y-auto bg-ivory lg:hidden"
      style={{ backgroundColor: '#F8F5F0', isolation: 'isolate' }}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.menu')}
    >
      <div className="flex h-[72px] items-center justify-between bg-ivory px-4">
        <span className="font-serif tracking-[0.24em] uppercase">{t('brandLine1')}</span>
        <button type="button" onClick={onClose} aria-label={t('nav.close')}>
          <X size={20} strokeWidth={1.25} />
        </button>
      </div>
      <nav className="flex flex-col gap-6 px-6 pt-8 text-[13px] tracking-[0.22em] uppercase">
        <Link to="/shop" onClick={onClose}>{t('nav.shop')}</Link>
        <Link to="/shop?category=new-arrivals" onClick={onClose}>{t('nav.newArrivals')}</Link>
        <Link to="/collections" onClick={onClose}>{t('nav.collections')}</Link>
        <Link to="/about" onClick={onClose}>{t('nav.about')}</Link>
        <Link to="/contact" onClick={onClose}>{t('nav.contact')}</Link>
        <Link to="/account" onClick={onClose}>{t('nav.account')}</Link>
        <Link to="/wishlist" onClick={onClose}>{t('nav.wishlist')}</Link>
        <button type="button" className="text-left" onClick={() => { onClose(); useUiStore.getState().setSearchOpen(true) }}>
          {t('nav.search')}
        </button>
      </nav>
      <div className="absolute inset-x-0 bottom-8 flex items-center justify-between px-6">
        <LanguageSwitcher />
        <a href="https://instagram.com/dressesbyflorinda" className="text-[11px] tracking-[0.2em] uppercase">
          Instagram
        </a>
      </div>
    </div>,
    document.body,
  )
}
