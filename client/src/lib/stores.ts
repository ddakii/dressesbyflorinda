import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { syncWishlist } from '@/lib/api'
import type { Address, CartItem, User } from '@/types'

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (variantId: string, quantity: number) => void
  removeItem: (variantId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      updateQty: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        })),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'florinda.cart' },
  ),
)

type WishlistState = {
  ids: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
  setIds: (ids: string[]) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const next = get().ids.includes(productId)
          ? get().ids.filter((id) => id !== productId)
          : [...get().ids, productId]
        set({ ids: next })
        void syncWishlist(next).catch(() => undefined)
      },
      has: (productId) => get().ids.includes(productId),
      setIds: (ids) => set({ ids }),
    }),
    { name: 'florinda.wishlist' },
  ),
)

type AuthState = {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

type UiState = {
  cartOpen: boolean
  searchOpen: boolean
  menuOpen: boolean
  toast: string | null
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
  showToast: (message: string) => void
}

export const useUiStore = create<UiState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toast: null,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  showToast: (toast) => {
    set({ toast })
    window.setTimeout(() => set({ toast: null }), 2800)
  },
}))

export type CheckoutDraft = Address & {
  paymentMethod: 'cod' | 'bank' | 'card'
}

export const emptyAddress: Address = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'Albania',
  city: '',
  address: '',
  apartment: '',
  postalCode: '',
}
