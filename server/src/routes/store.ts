import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../prisma.js'
import { mapCategory, mapCollection, mapProduct } from '../utils/map.js'
import { checkoutSchema, contactSchema, loginSchema, newsletterSchema, registerSchema } from '../validators/index.js'
import { optionalAuth, requireAuth, setAuthCookie, signToken } from '../middleware/auth.js'
import { createPaymentSession } from '../services/payment.js'
import { quoteOrder } from '../services/pricing.js'

export const storeRouter = Router()

storeRouter.use(optionalAuth)

storeRouter.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({
    where: { archived: false },
    include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
    orderBy: { createdAt: 'desc' },
  })
  let list = products.map(mapProduct)
  const { category, collection, q } = req.query
  if (typeof category === 'string') {
    const cat = await prisma.category.findUnique({ where: { slug: category } })
    if (cat) list = list.filter((p) => p.categoryId === cat.id)
    if (category === 'new-arrivals') list = list.filter((p) => p.newArrival)
    if (category === 'best-sellers') list = list.filter((p) => p.featured)
  }
  if (typeof collection === 'string') {
    const col = await prisma.collection.findUnique({ where: { slug: collection } })
    if (col) list = list.filter((p) => p.collectionId === col.id)
  }
  if (typeof q === 'string' && q) {
    const query = q.toLowerCase()
    list = list.filter((p) => `${p.name.en} ${p.name.sq} ${p.slug}`.toLowerCase().includes(query))
  }
  res.json({ products: list })
})

storeRouter.get('/products/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { images: { orderBy: { sortOrder: 'asc' } }, variants: true },
  })
  if (!product || product.archived) return res.status(404).json({ error: 'not_found' })
  res.json({ product: mapProduct(product) })
})

storeRouter.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  res.json({ categories: categories.map(mapCategory) })
})

storeRouter.get('/collections', async (_req, res) => {
  const collections = await prisma.collection.findMany()
  res.json({ collections: collections.map(mapCollection) })
})

storeRouter.get('/collections/:slug', async (req, res) => {
  const collection = await prisma.collection.findUnique({ where: { slug: req.params.slug } })
  if (!collection) return res.status(404).json({ error: 'not_found' })
  const products = await prisma.product.findMany({
    where: { collectionId: collection.id, archived: false },
    include: { images: true, variants: true },
  })
  res.json({ collection: mapCollection(collection), products: products.map(mapProduct) })
})

storeRouter.get('/content', async (_req, res) => {
  const blocks = await prisma.contentBlock.findMany()
  const content = Object.fromEntries(blocks.map((b) => [b.id, { en: b.valueEn, sq: b.valueSq }]))
  res.json(content)
})

storeRouter.post('/newsletter/subscribe', async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid_email' })
  const email = parsed.data.email.toLowerCase()
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
  if (existing) return res.json({ ok: true, duplicate: true })
  await prisma.newsletterSubscriber.create({ data: { email } })
  res.json({ ok: true, duplicate: false })
})

storeRouter.post('/contact', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid' })
  await prisma.contactMessage.create({ data: parsed.data })
  res.json({ ok: true })
})

storeRouter.post('/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid' })
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  if (existing) return res.status(409).json({ error: 'exists' })
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    },
  })
  const token = signToken({ id: user.id, email: user.email, role: 'customer' })
  setAuthCookie(res, token)
  res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } })
})

storeRouter.post('/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid' })
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  const token = signToken({ id: user.id, email: user.email, role: user.role as 'customer' | 'admin' })
  setAuthCookie(res, token)
  res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } })
})

storeRouter.post('/auth/logout', (req, res) => {
  res.clearCookie('florinda_token')
  res.json({ ok: true })
})

storeRouter.get('/auth/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  if (!user) return res.status(401).json({ error: 'unauthorized' })
  res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } })
})

storeRouter.put('/wishlist', requireAuth, async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids.filter((id: unknown) => typeof id === 'string') : []
  const wishlist = await prisma.wishlist.upsert({
    where: { userId: req.user!.id },
    update: {},
    create: { userId: req.user!.id },
  })
  await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } })
  if (ids.length) {
    await prisma.wishlistItem.createMany({
      data: ids.map((productId: string) => ({ wishlistId: wishlist.id, productId })),
    })
  }
  res.json({ ids })
})

storeRouter.post('/checkout/create-session', async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid' })
  if (parsed.data.paymentMethod === 'card' && !process.env.PAYMENT_SECRET_KEY) {
    return res.status(400).json({ error: 'card_unavailable' })
  }

  const quote = await quoteOrder(parsed.data.items, parsed.data.couponCode)
  const address = await prisma.address.create({
    data: {
      userId: req.user?.id,
      firstName: parsed.data.customer.firstName,
      lastName: parsed.data.customer.lastName,
      email: parsed.data.customer.email,
      phone: parsed.data.customer.phone,
      ...parsed.data.shipping,
    },
  })

  const number = `DBF-${Date.now().toString().slice(-8)}`
  const order = await prisma.$transaction(async (tx) => {
    for (const line of quote.lines) {
      await tx.productVariant.update({
        where: { id: line.variant.id },
        data: { stock: { decrement: line.quantity } },
      })
    }
    return tx.order.create({
      data: {
        number,
        userId: req.user?.id,
        addressId: address.id,
        email: parsed.data.customer.email,
        status: 'pending',
        paymentStatus: parsed.data.paymentMethod === 'cod' ? 'pending' : 'pending',
        paymentMethod: parsed.data.paymentMethod,
        subtotal: quote.subtotal,
        shipping: quote.shipping,
        discount: quote.discount,
        total: quote.total,
        couponId: quote.couponId,
        items: {
          create: quote.lines.map((line) => ({
            productId: line.product.id,
            variantId: line.variant.id,
            name: line.product.nameEn,
            size: line.variant.size,
            color: line.variant.color,
            image: line.product.images[0]?.url ?? '',
            quantity: line.quantity,
            price: line.price,
          })),
        },
      },
      include: { items: true, address: true },
    })
  })

  const session = await createPaymentSession({
    orderId: order.id,
    orderNumber: order.number,
    total: order.total,
    email: order.email,
    method: parsed.data.paymentMethod,
  })

  res.json({
    ...session,
    order: {
      id: order.id,
      number: order.number,
      total: order.total,
      shipping: order.shipping,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      items: order.items,
      address: order.address,
      createdAt: order.createdAt,
    },
  })
})

storeRouter.get('/orders', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: { items: true, address: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ orders })
})

storeRouter.get('/orders/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true, address: true },
  })
  if (!order) return res.status(404).json({ error: 'not_found' })
  if (order.userId && req.user?.id !== order.userId && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' })
  }
  res.json({ order })
})
