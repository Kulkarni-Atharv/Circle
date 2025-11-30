/**
 * ProductModal component
 * 
 * Modal dialog displaying complete product details including:
 * - Image carousel
 * - Product name, price, and description
 * - Seller information (name and phone)
 */

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ImageCarousel } from './ImageCarousel'
import { formatPrice } from '@/lib/utils'
import type { ProductWithSeller } from '@/types'
import { Phone, User, ShoppingCart, Heart, MessageSquare } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { BuyNowDialog } from './BuyNowDialog'

interface ProductModalProps {
    product: ProductWithSeller | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProductModal({ product, open, onOpenChange }: ProductModalProps) {
    const { addToCart } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const [buyNowOpen, setBuyNowOpen] = useState(false)

    if (!product) return null

    const isWishlisted = isInWishlist(product.id)

    const handleAddToCart = () => {
        addToCart(product.id)
    }

    const handleBuyNow = () => {
        setBuyNowOpen(true)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center justify-between pr-8">
                            <span>{product.name}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`rounded-full ${isWishlisted ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                                    }`}
                                onClick={() => toggleWishlist(product.id)}
                            >
                                <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Image carousel */}
                        <div>
                            <ImageCarousel images={product.images} alt={product.name} />
                        </div>

                        {/* Product details */}
                        <div className="space-y-6">
                            {/* Price and Actions */}
                            <div className="space-y-4">
                                <p className="text-3xl font-bold text-primary">
                                    {formatPrice(product.price)}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={handleAddToCart} variant="outline" className="w-full">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                    <Button onClick={handleBuyNow} className="w-full">
                                        Buy Now
                                    </Button>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            {/* Seller information */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-3">Seller Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{product.seller.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <a
                                            href={`tel:${product.seller.phone}`}
                                            className="text-primary hover:underline"
                                        >
                                            {product.seller.phone}
                                        </a>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full mt-2"
                                        onClick={handleBuyNow}
                                    >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Contact Seller
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <BuyNowDialog
                product={product}
                open={buyNowOpen}
                onOpenChange={setBuyNowOpen}
            />
        </>
    )
}
