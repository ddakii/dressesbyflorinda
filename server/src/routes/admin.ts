import { Router } from 'express'
import { prisma } from '../prisma.js'
import { optionalAuth, requireAdmin } from '../middleware/auth.js'
import { mapProduct } from '../utils/map.js'
import { verifyWebhook } from '../services/payment.js'

export const adminRouter = Router()

adminRouter.use(optionalAuth, requireAdmin)

adminRouter.get('/products', async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { images: true, variants: true },
    orderBy: { updatedAt: 'desc' },
  })
  res.json({ products: products.map(mapProduct) })
})

adminRouter.post('/products', async (req, res) => {
  const product = await prisma.product.create({
    data: {
      nameEn: req.body.nameEn ?? 'Untitled',
      nameSq: req.body.nameSq ?? req.body.nameEn ?? 'Pa titull',
      slug: (req.body.slug ?? req.body.nameEn ?? 'piece').toLowerCase().replace(/\s+/g, '-'),
      descriptionEn: req.body.descriptionEn ?? '',
      descriptionSq: req.body.descriptionSq ?? '',
      detailsEn: req.body.detailsEn ?? '',
      detailsSq: req.body.detailsSq ?? '',
      sizeFitEn: req.body.sizeFitEn ?? '',
      sizeFitSq: req.body.sizeFitSq ?? '',
      price: Number(req.body.price ?? 0),
      salePrice: req.body.salePrice ?? null,
      sku: req.body.sku ?? `DBF-${Date.now()}`,
      categoryId: req.body.categoryId,
      collectionId: req.body.collectionId ?? null,
      featured: Boolean(req.body.featured),
      newArrival: Boolean(req.body.newArrival),
    },
  })
  res.json({ product })
})

adminRouter.put('/products', async (req, res) => {
  if (!req.body.id) return res.status(400).json({ error: 'missing_id' })
  const product = await prisma.product.update({
    where: { id: req.body.id },
    data: {
      nameEn: req.body.nameEn,
      price: req.body.price,
      sku: req.body.sku,
      archived: req.body.archived,
      featured: req.body.featured,
      newArrival: req.body.newArrival,
    },
  })
  res.json({ product })
})

adminRouter.delete('/products/:id', async (req, res) => {
  await prisma.product.update({ where: { id: req.params.id }, data: { archived: true } })
  res.json({ ok: true })
})

adminRouter.get('/orders', async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true, address: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json({
    orders: orders.map((order) => ({
      id: order.id,
      number: order.number,
      email: order.email,
      createdAt: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
    })),
  })
})

adminRouter.patch('/orders/:id', async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status, paymentStatus: req.body.paymentStatus },
  })
  res.json({ order })
})

adminRouter.get('/customers', async (_req, res) => {
  const customers = await prisma.user.findMany({
    where: { role: 'customer' },
    select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
  })
  res.json({ customers })
})

adminRouter.get('/newsletter', async (_req, res) => {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } })
  res.json({ subscribers })
})

adminRouter.get('/inventory', async (_req, res) => {
  const variants = await prisma.productVariant.findMany({ include: { product: true } })
  res.json({ variants })
})

adminRouter.patch('/inventory/:id', async (req, res) => {
  const variant = await prisma.productVariant.update({
    where: { id: req.params.id },
    data: { stock: Number(req.body.stock) },
  })
  res.json({ variant })
})

adminRouter.post('/coupons', async (req, res) => {
  const coupon = await prisma.coupon.create({
    data: {
      code: String(req.body.code).toUpperCase(),
      type: req.body.type === 'percent' ? 'percent' : 'fixed',
      amount: Number(req.body.amount),
    },
  })
  res.json({ coupon })
})

export const webhookRouter = Router()

webhookRouter.post('/checkout/webhook', (req, res) => {
  const ok = verifyWebhook(req.header('stripe-signature') ?? undefined, JSON.stringify(req.body))
  if (!ok && process.env.PAYMENT_WEBHOOK_SECRET) {
    return res.status(400).json({ error: 'invalid_signature' })
  }
  res.json({ received: true })
})
