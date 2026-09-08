import type { Category, Collection, Product, ProductImage, ProductVariant } from '@prisma/client'

type ProductFull = Product & {
  images: ProductImage[]
  variants: ProductVariant[]
}

export function mapProduct(product: ProductFull) {
  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: { en: product.nameEn, sq: product.nameSq },
    description: { en: product.descriptionEn, sq: product.descriptionSq },
    details: { en: product.detailsEn, sq: product.detailsSq },
    sizeFit: { en: product.sizeFitEn, sq: product.sizeFitSq },
    price: product.price,
    salePrice: product.salePrice,
    categoryId: product.categoryId,
    collectionId: product.collectionId,
    featured: product.featured,
    newArrival: product.newArrival,
    archived: product.archived,
    images: product.images.map((image) => ({
      url: image.url,
      alt: { en: image.altEn, sq: image.altSq },
    })),
    variants: product.variants,
    metaTitle: {
      en: product.metaTitleEn ?? `${product.nameEn} | Dresses by Florinda`,
      sq: product.metaTitleSq ?? `${product.nameSq} | Dresses by Florinda`,
    },
    metaDescription: {
      en: product.metaDescriptionEn ?? product.descriptionEn,
      sq: product.metaDescriptionSq ?? product.descriptionSq,
    },
  }
}

export function mapCategory(category: Category) {
  return {
    id: category.id,
    slug: category.slug,
    name: { en: category.nameEn, sq: category.nameSq },
    description: { en: category.descriptionEn, sq: category.descriptionSq },
    image: category.image,
  }
}

export function mapCollection(collection: Collection) {
  return {
    id: collection.id,
    slug: collection.slug,
    name: { en: collection.nameEn, sq: collection.nameSq },
    description: { en: collection.descriptionEn, sq: collection.descriptionSq },
    heroImage: collection.heroImage,
  }
}
