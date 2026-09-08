import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AuthHydrate } from '@/components/AuthHydrate'
import { CartDrawer } from '@/components/CartDrawer'
import { CookieConsent } from '@/components/CookieConsent'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SearchOverlay } from '@/components/SearchOverlay'
import { Toast } from '@/components/Toast'

export function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  if (isAdmin) return <Outlet />

  return (
    <div className="min-h-svh bg-ivory text-ink">
      <AuthHydrate />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <CookieConsent />
      <Toast />
    </div>
  )
}
