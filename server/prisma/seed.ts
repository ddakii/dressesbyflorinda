import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const force = process.argv.includes('--force')
  const existing = await prisma.product.count()
  if (existing > 0 && !force) {
    console.log('Catalog already seeded; skipping')
    return
  }

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.user.deleteMany()
  await prisma.newsletterSubscriber.deleteMany()

  const evening = await prisma.category.create({
    data: { id: 'cat-evening', slug: 'evening', nameEn: 'Evening Dresses', nameSq: 'Fustane Mbrëmjeje',     image: '/images/look-16.jpg', sortOrder: 1 },
  })
  const occasion = await prisma.category.create({
    data: { id: 'cat-occasion', slug: 'occasion', nameEn: 'Occasion Dresses', nameSq: 'Fustane për Raste', image: '/images/look-19.jpg', sortOrder: 2 },
  })
  const cocktail = await prisma.category.create({
    data: { id: 'cat-cocktail', slug: 'cocktail', nameEn: 'Cocktail Dresses', nameSq: 'Fustane Cocktail', image: '/images/look-12.jpg', sortOrder: 3 },
  })
  const bridal = await prisma.category.create({
    data: { id: 'cat-bridal', slug: 'bridal', nameEn: 'Bridal / Special Occasion', nameSq: 'Nuse / Raste të Veçanta', image: '/images/look-27.jpg', sortOrder: 4 },
  })
  await prisma.category.create({
    data: { id: 'cat-new', slug: 'new-arrivals', nameEn: 'New Arrivals', nameSq: 'Të Rejat', image: '/images/look-14.jpg', sortOrder: 5 },
  })
  await prisma.category.create({
    data: { id: 'cat-bestsellers', slug: 'best-sellers', nameEn: 'Best Sellers', nameSq: 'Më të Kërkuarat', image: '/images/look-25.jpg', sortOrder: 6 },
  })

  const eveningEdit = await prisma.collection.create({
    data: { id: 'col-evening', slug: 'evening-edit', nameEn: 'The Evening Edit', nameSq: 'Përzgjedhja e Mbrëmjes', descriptionEn: 'Voluminous gowns and precise evening lines.', descriptionSq: 'Fustane voluminoze dhe linja të sakta mbrëmjeje.', heroImage: '/images/look-16.jpg' },
  })
  const signature = await prisma.collection.create({
    data: { id: 'col-signature', slug: 'signature', nameEn: 'Signature', nameSq: 'Nënshkrimi', descriptionEn: 'The house codes.', descriptionSq: 'Gjuha e shtëpisë.', heroImage: '/images/look-14.jpg' },
  })
  const season = await prisma.collection.create({
    data: { id: 'col-season', slug: 'new-season', nameEn: 'New Season', nameSq: 'Sezoni i Ri', descriptionEn: 'Fresh arrivals.', descriptionSq: 'Modele të reja.', heroImage: '/images/look-12.jpg' },
  })

  const sizes = ['XS', 'S', 'M', 'L', 'XL'] as const
  const stock: Record<string, number> = { XS: 4, S: 8, M: 6, L: 2, XL: 0 }

  async function createPiece(input: {
    id: string
    slug: string
    sku: string
    nameEn: string
    nameSq: string
    descriptionEn: string
    price: number
    salePrice?: number
    categoryId: string
    collectionId: string
    featured?: boolean
    newArrival?: boolean
    images: string[]
    colors: { name: string; hex: string }[]
    stockMap?: Record<string, number>
  }) {
    const prefix = input.slug.split('-')[0]
    await prisma.product.create({
      data: {
        id: input.id,
        slug: input.slug,
        sku: input.sku,
        nameEn: input.nameEn,
        nameSq: input.nameSq,
        descriptionEn: input.descriptionEn,
        descriptionSq: input.descriptionEn,
        detailsEn: 'Dry clean only. Store hanging, away from direct light.',
        detailsSq: 'Vetëm pastrim kimik. Ruajeni të varur, larg dritës së drejtpërdrejtë.',
        sizeFitEn: 'True to size. Model wears size S.',
        sizeFitSq: 'Sipas madhësisë. Modelja mban madhësinë S.',
        price: input.price,
        salePrice: input.salePrice,
        categoryId: input.categoryId,
        collectionId: input.collectionId,
        featured: Boolean(input.featured),
        newArrival: Boolean(input.newArrival),
        images: {
          create: input.images.map((url, i) => ({
            url,
            altEn: input.nameEn,
            altSq: input.nameSq,
            sortOrder: i,
          })),
        },
        variants: {
          create: input.colors.flatMap((color) =>
            sizes.map((size) => ({
              id: `${prefix}-${color.name.toLowerCase().replace(/\s+/g, '')}-${size.toLowerCase()}`,
              size,
              color: color.name,
              colorHex: color.hex,
              sku: `${prefix}-${color.name.slice(0, 3).toUpperCase()}-${size}`,
              stock: (input.stockMap ?? stock)[size] ?? 4,
            })),
          ),
        },
      },
    })
  }

  await createPiece({
    id: 'p-luna', slug: 'luna-silk-dress', sku: 'DBF-LUNA', nameEn: 'Luna Silk Dress', nameSq: 'Fustani Luna Silk',
    descriptionEn: 'An elegant silhouette crafted for sophisticated evenings.', price: 24900,
    categoryId: occasion.id, collectionId: season.id, featured: true, newArrival: true,
    images: ['/images/look-19.jpg', '/images/look-21.jpg', '/images/look-01.jpg'],
    colors: [{ name: 'Champagne', hex: '#C4B7A0' }, { name: 'Ivory', hex: '#F4F0E8' }],
  })
  await createPiece({
    id: 'p-celeste', slug: 'celeste-evening-gown', sku: 'DBF-CELESTE', nameEn: 'Celeste Evening Gown', nameSq: 'Fustani i Mbrëmjes Celeste',
    descriptionEn: 'A voluminous ivory gown with floral texture.', price: 38900,
    categoryId: evening.id, collectionId: eveningEdit.id, featured: true,
    images: ['/images/look-16.jpg', '/images/look-15.jpg', '/images/look-02.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }],
    stockMap: { XS: 2, S: 5, M: 5, L: 3, XL: 1 },
  })
  await createPiece({
    id: 'p-amelia', slug: 'amelia-satin-dress', sku: 'DBF-AMELIA', nameEn: 'Amelia Satin Dress', nameSq: 'Fustani Amelia Satin',
    descriptionEn: 'A rose-gold cocktail dress with a matching cape.', price: 27900,
    categoryId: cocktail.id, collectionId: season.id, featured: true, newArrival: true,
    images: ['/images/look-12.jpg', '/images/look-14.jpg', '/images/look-03.jpg'],
    colors: [{ name: 'Rose Gold', hex: '#C9A48A' }],
  })
  await createPiece({
    id: 'p-elara', slug: 'elara-velvet-dress', sku: 'DBF-ELARA', nameEn: 'Elara Velvet Dress', nameSq: 'Fustani Elara Velvet',
    descriptionEn: 'A pale, pleated cape dress with a quiet drama.', price: 31900,
    categoryId: occasion.id, collectionId: signature.id, newArrival: true,
    images: ['/images/look-14.jpg', '/images/look-12.jpg', '/images/look-04.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }, { name: 'Blush', hex: '#E8D5CC' }],
  })
  await createPiece({
    id: 'p-sienna', slug: 'sienna-draped-dress', sku: 'DBF-SIENNA', nameEn: 'Sienna Draped Dress', nameSq: 'Fustani Sienna Draped',
    descriptionEn: 'An ivory gown with pearl and floral embroidery.', price: 22900,
    categoryId: bridal.id, collectionId: season.id, newArrival: true,
    images: ['/images/look-13.jpg', '/images/look-22.jpg', '/images/look-05.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }],
    stockMap: { XS: 5, S: 8, M: 6, L: 4, XL: 2 },
  })
  await createPiece({
    id: 'p-isabelle', slug: 'isabelle-signature-dress', sku: 'DBF-ISABELLE', nameEn: 'Isabelle Signature Dress', nameSq: 'Fustani Isabelle Signature',
    descriptionEn: 'A grand white ball gown with floral lace.', price: 34900,
    categoryId: bridal.id, collectionId: signature.id, featured: true,
    images: ['/images/look-27.jpg', '/images/look-18.jpg', '/images/look-24.jpg', '/images/look-26.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }, { name: 'White', hex: '#FFFFFF' }],
    stockMap: { XS: 1, S: 3, M: 4, L: 2, XL: 0 },
  })
  await createPiece({
    id: 'p-valentina', slug: 'valentina-lace-gown', sku: 'DBF-VALENTINA', nameEn: 'Valentina Lace Gown', nameSq: 'Fustani Valentina Lace',
    descriptionEn: 'Long sleeves, a cinched waist and all-over lace.', price: 42900,
    categoryId: evening.id, collectionId: eveningEdit.id,
    images: ['/images/look-16.jpg', '/images/look-20.jpg', '/images/look-06.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }],
  })
  await createPiece({
    id: 'p-aurora', slug: 'aurora-crystal-gown', sku: 'DBF-AURORA', nameEn: 'Aurora Crystal Gown', nameSq: 'Fustani Aurora Crystal',
    descriptionEn: 'A strapless white gown with crystal scallops.', price: 45900,
    categoryId: evening.id, collectionId: eveningEdit.id, featured: true,
    images: ['/images/look-25.jpg', '/images/look-15.jpg', '/images/look-07.jpg'],
    colors: [{ name: 'White', hex: '#FFFFFF' }],
    stockMap: { XS: 1, S: 3, M: 3, L: 1, XL: 0 },
  })
  await createPiece({
    id: 'p-camille', slug: 'camille-bridal-gown', sku: 'DBF-CAMILLE', nameEn: 'Camille Bridal Gown', nameSq: 'Fustani i Nuses Camille',
    descriptionEn: 'A fitted lace bridal gown with a long train.', price: 52000,
    categoryId: bridal.id, collectionId: signature.id,
    images: ['/images/look-13.jpg', '/images/look-22.jpg', '/images/look-08.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }, { name: 'White', hex: '#FFFFFF' }],
  })
  await createPiece({
    id: 'p-noor', slug: 'noor-pearl-dress', sku: 'DBF-NOOR', nameEn: 'Noor Pearl Dress', nameSq: 'Fustani Noor Pearl',
    descriptionEn: 'A strapless ivory gown with pearl and crystal work.', price: 39900, salePrice: 34900,
    categoryId: evening.id, collectionId: eveningEdit.id,
    images: ['/images/look-25.jpg', '/images/look-22.jpg', '/images/look-09.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }],
  })
  await createPiece({
    id: 'p-seraphine', slug: 'seraphine-cape-dress', sku: 'DBF-SERAPHINE', nameEn: 'Seraphine Cape Dress', nameSq: 'Fustani Seraphine Cape',
    descriptionEn: 'A champagne cape that falls like light through a paneled hall.', price: 36900,
    categoryId: evening.id, collectionId: signature.id, featured: true, newArrival: true,
    images: ['/images/look-14.jpg', '/images/look-12.jpg', '/images/look-10.jpg'],
    colors: [{ name: 'Champagne', hex: '#C4B7A0' }],
    stockMap: { XS: 3, S: 6, M: 5, L: 3, XL: 1 },
  })
  await createPiece({
    id: 'p-odette', slug: 'odette-ball-gown', sku: 'DBF-ODETTE', nameEn: 'Odette Ball Gown', nameSq: 'Fustani Odette Ball Gown',
    descriptionEn: 'An ivory ball gown with a plunging neckline.', price: 41900,
    categoryId: evening.id, collectionId: eveningEdit.id,
    images: ['/images/look-17.jpg', '/images/look-16.jpg', '/images/look-11.jpg'],
    colors: [{ name: 'Ivory', hex: '#F4F0E8' }],
  })
  await createPiece({
    id: 'p-marina', slug: 'marina-beaded-dress', sku: 'DBF-MARINA', nameEn: 'Marina Beaded Dress', nameSq: 'Fustani Marina Beaded',
    descriptionEn: 'A cobalt halter gown with silver crystal geometry.', price: 33900,
    categoryId: evening.id, collectionId: season.id, featured: true, newArrival: true,
    images: ['/images/look-23.jpg', '/images/look-20.jpg'],
    colors: [{ name: 'Cobalt', hex: '#1E3A8A' }],
    stockMap: { XS: 3, S: 5, M: 4, L: 2, XL: 1 },
  })

  await prisma.user.create({
    data: {
      email: 'admin@dressesbyflorinda.com',
      passwordHash: await bcrypt.hash('FlorindaAdmin2026!', 12),
      firstName: 'Florinda',
      lastName: 'Studio',
      role: 'admin',
    },
  })

  await prisma.coupon.create({
    data: { code: 'ATELIER10', type: 'percent', amount: 10 },
  })

  console.log('Seeded Dresses by Florinda')
}

main().finally(async () => {
  await prisma.$disconnect()
})
