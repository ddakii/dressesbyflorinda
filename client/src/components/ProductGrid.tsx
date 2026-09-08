import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import type { Product } from '@/types'

export function ProductGrid({
  products,
  loading,
}: {
  products: Product[]
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
