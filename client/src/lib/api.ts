import { categories, collections, products, siteContent } from '@/data/catalog'
import type { Category, Collection, Product, User } from '@/types'

const API = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string }
      throw Object.assign(new Error(body.error || 'request_failed'), {
        status: res.status,
        code: body.code,
      })
    }
    return (await res.json()) as T
  } catch (error) {
    if (error instanceof TypeError) return null
    throw error
  }
}

export async function fetchProducts(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  const data = await request<{ products: Product[] }>(`/products${query}`)
  return data?.products ?? products.filter((p) => !p.archived)
}

export async function fetchProduct(slug: string) {
  const data = await request<{ product: Product }>(`/products/${slug}`)
  return data?.product ?? products.find((p) => p.slug === slug && !p.archived) ?? null
}

export async function fetchCategories() {
  const data = await request<{ categories: Category[] }>('/categories')
  return data?.categories ?? categories
}

export async function fetchCollections() {
  const data = await request<{ collections: Collection[] }>('/collections')
  return data?.collections ?? collections
}

export async function fetchCollection(slug: string) {
  const data = await request<{ collection: Collection; products: Product[] }>(`/collections/${slug}`)
  if (data) return data
  const collection = collections.find((c) => c.slug === slug)
  if (!collection) return null
  return {
    collection,
    products: products.filter((p) => p.collectionId === collection.id && !p.archived),
  }
}

export async function fetchContent() {
  const data = await request<typeof siteContent>('/content')
  return data ?? siteContent
}

export async function subscribeNewsletter(email: string) {
  const data = await request<{ ok: boolean; duplicate?: boolean }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  if (!data) {
    const key = 'florinda.newsletter'
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]') as string[]
    if (existing.includes(email.toLowerCase())) return { ok: true, duplicate: true }
    existing.push(email.toLowerCase())
    window.localStorage.setItem(key, JSON.stringify(existing))
    return { ok: true, duplicate: false }
  }
  return data
}

export async function sendContact(payload: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const data = await request<{ ok: boolean }>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data ?? { ok: true }
}

export async function login(email: string, password: string) {
  return request<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function registerAccount(payload: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  return request<{ user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logout() {
  await request('/auth/logout', { method: 'POST' })
}

export async function fetchMe() {
  return request<{ user: User }>('/auth/me')
}

export async function syncWishlist(ids: string[]) {
  return request<{ ids: string[] }>('/wishlist', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  })
}

export type CreatedOrder = {
  id: string
  number: string
  total: number
  shipping: number
  status: string
  paymentStatus: string
  paymentMethod: string
  items: Array<{
    name: string
    quantity: number
    price: number
    size: string
    color: string
    image: string
  }>
  address: {
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
  createdAt: string
}

export async function createCheckoutSession(payload: {
  items: { variantId: string; quantity: number }[]
  paymentMethod: 'cod' | 'bank' | 'card'
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shipping: {
    country: string
    city: string
    address: string
    apartment?: string
    postalCode: string
  }
}) {
  const data = await request<{
    provider: 'none' | 'stripe'
    mode: 'manual' | 'redirect'
    url?: string
    order?: CreatedOrder
  }>('/checkout/create-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data
}

export async function fetchOrder(id: string) {
  return request<{ order: CreatedOrder }>(`/orders/${id}`)
}

export async function fetchMyOrders() {
  return request<{ orders: CreatedOrder[] }>('/orders')
}

export async function adminRequest<T>(path: string, init?: RequestInit) {
  return request<T>(`/admin${path}`, init)
}
