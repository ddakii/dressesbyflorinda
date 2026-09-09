import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const newsletterSchema = z.object({
  email: z.string().email(),
})

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

export const collectionSchema = z.object({
  nameEn: z.string().min(1),
  nameSq: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionSq: z.string().min(1),
  heroImage: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

export const checkoutSchema = z.object({
  items: z.array(z.object({
    variantId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
  paymentMethod: z.enum(['cod', 'bank', 'card']),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(3),
  }),
  shipping: z.object({
    country: z.string().min(1),
    city: z.string().min(1),
    address: z.string().min(1),
    apartment: z.string().optional(),
    postalCode: z.string().min(1),
  }),
  couponCode: z.string().optional(),
})
