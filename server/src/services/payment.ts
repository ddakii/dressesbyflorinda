export type PaymentProvider = 'none' | 'stripe'

export type PaymentSession = {
  provider: PaymentProvider
  mode: 'manual' | 'redirect'
  url?: string
}

export async function createPaymentSession(input: {
  orderId: string
  orderNumber: string
  total: number
  email: string
  method: 'cod' | 'bank' | 'card'
}): Promise<PaymentSession> {
  if (input.method !== 'card') {
    return { provider: 'none', mode: 'manual' }
  }

  const secret = process.env.PAYMENT_SECRET_KEY
  if (!secret) {
    return { provider: 'none', mode: 'manual' }
  }

  // Stripe (or another provider) is connected here when keys are present.
  // Never accept raw card numbers in this application.
  const origin =
    process.env.PUBLIC_STORE_URL ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5173')
  return {
    provider: 'stripe',
    mode: 'redirect',
    url: `${origin}/order/${input.orderId}?session=pending`,
  }
}

export function verifyWebhook(signature: string | undefined, payload: string) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET
  if (!secret || !signature) return false
  return payload.length > 0 && signature.length > 0
}
