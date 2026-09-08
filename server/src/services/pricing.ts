import { prisma } from '../prisma.js'

export async function quoteOrder(
  items: { variantId: string; quantity: number }[],
  couponCode?: string,
) {
  const lines = []
  for (const item of items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: { include: { images: true } } },
    })
    if (!variant || variant.product.archived) {
      throw Object.assign(new Error('unavailable'), { status: 400 })
    }
    if (variant.stock < item.quantity) {
      throw Object.assign(new Error('out_of_stock'), { status: 400 })
    }
    const unit = variant.product.salePrice ?? variant.product.price
    lines.push({
      variant,
      product: variant.product,
      quantity: item.quantity,
      price: unit,
      lineTotal: unit * item.quantity,
    })
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  let discount = 0
  let couponId: string | undefined
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
    if (coupon?.active && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      discount = coupon.type === 'percent' ? Math.round(subtotal * (coupon.amount / 100)) : coupon.amount
      couponId = coupon.id
    }
  }
  const shipping = subtotal - discount >= 40000 ? 0 : 1500
  const total = Math.max(0, subtotal - discount + shipping)
  return { lines, subtotal, discount, shipping, total, couponId }
}
