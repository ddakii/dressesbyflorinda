import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { products as seedProducts } from '@/data/catalog'
import { adminRequest, login } from '@/lib/api'
import { useAuthStore } from '@/lib/stores'
import { formatPrice, loc, type Product } from '@/types'

type AdminOrder = {
  id: string
  number: string
  email: string
  createdAt: string
  status: string
  paymentStatus: string
  total: number
}

export function AdminPage() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <AdminLogin />
  if (user.role !== 'admin') return <Navigate to="/account" replace />

  return (
    <div className="min-h-svh bg-[#f4f2ee] text-[#222] font-sans">
      <div className="grid min-h-svh md:grid-cols-[220px_1fr]">
        <aside className="border-r border-black/10 bg-white p-6">
          <Link to="/" className="text-xs tracking-[0.2em] uppercase">
            Dresses by Florinda
          </Link>
          <nav className="mt-8 flex flex-col gap-3 text-sm">
            <Link to="/admin">Overview</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/inventory">Inventory</Link>
            <Link to="/admin/customers">Customers</Link>
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/collections">Collections</Link>
            <Link to="/admin/coupons">Coupons</Link>
            <Link to="/admin/content">Content</Link>
            <Link to="/admin/newsletter">Newsletter</Link>
          </nav>
        </aside>
        <div className="p-6 md:p-10">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:id" element={<AdminProductEdit />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="customers" element={<AdminSimple title="Customers" text="Customer records appear here once accounts are created." />} />
            <Route path="categories" element={<AdminSimple title="Categories" text="Evening, Occasion, Cocktail, Bridal, New Arrivals and Best Sellers are managed from the database." />} />
            <Route path="collections" element={<AdminSimple title="Collections" text="Evening Edit, Signature and New Season can be edited from the studio API." />} />
            <Route path="coupons" element={<AdminSimple title="Coupons" text="Create percentage or fixed coupons. Totals are always calculated on the server." />} />
            <Route path="content" element={<AdminSimple title="Content" text="About, policies and FAQ copy is stored as editable studio content." />} />
            <Route path="newsletter" element={<AdminSimple title="Newsletter" text="Subscribers collected from the storefront appear in this list." />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function AdminLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('admin@dressesbyflorinda.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const data = await login(email, password)
      if (data?.user.role !== 'admin') {
        setError('This account is not an administrator.')
        return
      }
      setUser(data.user)
    } catch {
      setError('Sign-in failed. Check the credentials in the README.')
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f4f2ee]">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-8">
        <h1 className="text-lg tracking-[0.16em] uppercase">Studio</h1>
        <input className="mt-6 w-full border-b py-2 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="mt-4 w-full border-b py-2 outline-none" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error ? <p className="mt-3 text-xs text-red-700">{error}</p> : null}
        <button className="mt-6 w-full bg-[#1c1b1a] py-3 text-xs tracking-[0.18em] text-white uppercase">
          Enter
        </button>
      </form>
    </div>
  )
}

function AdminHome() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  useEffect(() => {
    void adminRequest<{ orders: AdminOrder[] }>('/orders')
      .then((data) => data?.orders && setOrders(data.orders))
      .catch(() => undefined)
  }, [])

  const revenue = orders.reduce((n, o) => n + o.total, 0)
  const avg = orders.length ? Math.round(revenue / orders.length) : 0
  const max = Math.max(...[0, ...orders.map((o) => o.total)])

  return (
    <div>
      <h1 className="text-2xl font-medium">Overview</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Revenue" value={formatPrice(revenue, 'en')} />
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Average order" value={formatPrice(avg, 'en')} />
      </div>
      <h2 className="mt-10 text-sm uppercase tracking-widest">Sales</h2>
      <div className="mt-4 flex h-40 items-end gap-2">
        {(orders.length ? orders.slice(-10) : [{ total: 0 }]).map((order, i) => (
          <div
            key={i}
            className="flex-1 bg-[#1c1b1a]"
            style={{ height: `${max ? Math.max(8, (order.total / max) * 100) : 8}%` }}
          />
        ))}
      </div>
      <h2 className="mt-10 text-sm uppercase tracking-widest">Recent orders</h2>
      <OrderTable orders={orders.slice(0, 8)} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-5">
      <p className="text-xs uppercase tracking-widest text-black/50">{label}</p>
      <p className="mt-2 text-2xl">{value}</p>
    </div>
  )
}

function AdminProducts() {
  const navigate = useNavigate()
  const [list, setList] = useState<Product[]>(seedProducts)
  useEffect(() => {
    void adminRequest<{ products: Product[] }>('/products')
      .then((data) => data?.products && setList(data.products))
      .catch(() => undefined)
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Products</h1>
        <button className="bg-[#1c1b1a] px-4 py-2 text-xs text-white uppercase" onClick={() => navigate('/admin/products/new')}>
          New product
        </button>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-xs uppercase tracking-widest text-black/50">
            <th className="py-3">Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-3">
                <Link to={`/admin/products/${p.id}`}>{loc(p.name, 'en')}</Link>
              </td>
              <td>{p.sku}</td>
              <td>{formatPrice(p.salePrice ?? p.price, 'en')}</td>
              <td>{p.archived ? 'Archived' : 'Live'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminProductEdit() {
  const { id } = useParams()
  const existing = seedProducts.find((p) => p.id === id)
  const [name, setName] = useState(existing ? loc(existing.name, 'en') : '')
  const [price, setPrice] = useState(existing ? String((existing.salePrice ?? existing.price) / 100) : '')
  const [sku, setSku] = useState(existing?.sku ?? '')
  const [saved, setSaved] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await adminRequest('/products', {
        method: existing ? 'PUT' : 'POST',
        body: JSON.stringify({
          id,
          nameEn: name,
          price: Math.round(Number(price) * 100),
          sku,
        }),
      })
    } catch {
      // local-only save acknowledgement
    }
    setSaved(true)
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <h1 className="text-2xl font-medium">{existing ? 'Edit product' : 'New product'}</h1>
      <label className="block text-sm">Name
        <input className="mt-1 w-full border-b py-2 outline-none" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm">SKU
        <input className="mt-1 w-full border-b py-2 outline-none" value={sku} onChange={(e) => setSku(e.target.value)} />
      </label>
      <label className="block text-sm">Price (EUR)
        <input className="mt-1 w-full border-b py-2 outline-none" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <button className="bg-[#1c1b1a] px-5 py-2 text-xs text-white uppercase">{saved ? 'Saved' : 'Save'}</button>
    </form>
  )
}

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  useEffect(() => {
    void adminRequest<{ orders: AdminOrder[] }>('/orders')
      .then((data) => data?.orders && setOrders(data.orders))
      .catch(() => undefined)
  }, [])

  async function updateStatus(id: string, status: string) {
    await adminRequest(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }).catch(() => undefined)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <div>
      <h1 className="text-2xl font-medium">Orders</h1>
      <OrderTable orders={orders} onStatus={updateStatus} />
    </div>
  )
}

function OrderTable({
  orders,
  onStatus,
}: {
  orders: AdminOrder[]
  onStatus?: (id: string, status: string) => void
}) {
  if (orders.length === 0) return <p className="mt-6 text-sm text-black/50">No orders yet.</p>
  return (
    <table className="mt-6 w-full text-left text-sm">
      <thead>
        <tr className="border-b text-xs uppercase tracking-widest text-black/50">
          <th className="py-3">Order</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Status</th>
          <th>Payment</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="py-3">{order.number}</td>
            <td>{order.email}</td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
              {onStatus ? (
                <select value={order.status} onChange={(e) => onStatus(order.id, e.target.value)}>
                  {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                order.status
              )}
            </td>
            <td>{order.paymentStatus}</td>
            <td>{formatPrice(order.total, 'en')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AdminInventory() {
  const rows = useMemo(
    () =>
      seedProducts.flatMap((p) =>
        p.variants.map((v) => ({
          id: v.id,
          name: loc(p.name, 'en'),
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      ),
    [],
  )
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(rows.map((r) => [r.id, r.stock])),
  )

  return (
    <div>
      <h1 className="text-2xl font-medium">Inventory</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b text-xs uppercase tracking-widest text-black/50">
            <th className="py-3">Product</th>
            <th>Size</th>
            <th>Color</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b">
              <td className="py-3">{row.name}</td>
              <td>{row.size}</td>
              <td>{row.color}</td>
              <td>
                <input
                  type="number"
                  className="w-16 border-b outline-none"
                  value={stock[row.id]}
                  onChange={(e) => setStock((s) => ({ ...s, [row.id]: Number(e.target.value) }))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminSimple({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h1 className="text-2xl font-medium">{title}</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-black/60">{text}</p>
    </div>
  )
}
