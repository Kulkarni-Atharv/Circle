/**
 * ProductCard component
 * 
 * Displays a product card with image, name, and price.
 * Includes hover animations and click handler to open product modal.
 */

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { Heart, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const { addToCart } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const isWishlisted = isInWishlist(product.id)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        addToCart(product.id)
    }

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleWishlist(product.id)
    }

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer group"
            onClick={onClick}
        >
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow relative">
                <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        loading="lazy"
                    />

                    {/* Wishlist Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all ${isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                            }`}
                        onClick={handleToggleWishlist}
                    >
                        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </Button>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-2xl font-bold text-primary">
                            {formatPrice(product.price)}
                        </p>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
