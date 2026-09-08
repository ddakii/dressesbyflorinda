export type Locale = 'en' | 'sq'

export type Localized = {
  en: string
  sq: string
}

export type Category = {
  id: string
  slug: string
  name: Localized
  description: Localized
  image: string
}

export type Collection = {
  id: string
  slug: string
  name: Localized
  description: Localized
  heroImage: string
}

export type ProductImage = {
  url: string
  alt: Localized
}

export type ProductVariant = {
  id: string
  size: string
  color: string
  colorHex: string
  sku: string
  stock: number
}

export type Product = {
  id: string
  slug: string
  sku: string
  name: Localized
  description: Localized
  details: Localized
  sizeFit: Localized
  price: number
  salePrice: number | null
  categoryId: string
  collectionId: string | null
  featured: boolean
  newArrival: boolean
  archived: boolean
  images: ProductImage[]
  variants: ProductVariant[]
  metaTitle: Localized
  metaDescription: Localized
}

export type CartItem = {
  productId: string
  variantId: string
  quantity: number
}

export type Address = {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  apartment?: string
  postalCode: string
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed'

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'customer' | 'admin'
}

export function loc(value: Localized, locale: Locale): string {
  return value[locale] || value.en
}

export function formatPrice(cents: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(locale === 'sq' ? 'sq-AL' : 'de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function productInStock(product: Product): boolean {
  return product.variants.some((variant) => variant.stock > 0)
}
