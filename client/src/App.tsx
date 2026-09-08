import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { I18nProvider } from '@/lib/i18n'
import { AboutPage } from '@/pages/AboutPage'
import { AccountPage } from '@/pages/AccountPage'
import { AdminPage } from '@/pages/AdminPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CollectionDetailPage, CollectionsPage } from '@/pages/CollectionsPage'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import {
  FaqPage,
  NotFoundPage,
  PrivacyPage,
  ReturnsPage,
  ShippingPage,
  SizeGuidePage,
  TermsPage,
} from '@/pages/LegalPages'
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage'
import { ProductPage } from '@/pages/ProductPage'
import { SearchPage } from '@/pages/SearchPage'
import { ShopPage } from '@/pages/ShopPage'
import { WishlistPage } from '@/pages/WishlistPage'

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminPage />} />
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="shop/:slug" element={<ProductPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="collections/:slug" element={<CollectionDetailPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order/:id" element={<OrderConfirmationPage />} />
              <Route path="size-guide" element={<SizeGuidePage />} />
              <Route path="shipping" element={<ShippingPage />} />
              <Route path="returns" element={<ReturnsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </ErrorBoundary>
  )
}
