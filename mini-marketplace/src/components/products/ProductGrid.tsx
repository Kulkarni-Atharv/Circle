/**
 * ProductGrid component
 * 
 * Responsive grid layout for displaying product cards.
 * Handles loading states and empty states.
 */

import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types'

interface ProductGridProps {
    products: Product[]
    loading?: boolean
    onProductClick: (product: Product) => void
}

export function ProductGrid({ products, loading, onProductClick }: ProductGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="space-y-3">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-8 w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                    No products available yet. Be the first to list a product!
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onProductClick(product)}
                />
            ))}
        </div>
    )
}
