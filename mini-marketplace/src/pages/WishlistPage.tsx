import { Link } from 'react-router-dom'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function WishlistPage() {
    const { wishlistItems, toggleWishlist, loading } = useWishlist()
    const { addToCart } = useCart()

    if (loading) {
        return (
            <div className="container py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-muted rounded"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="container py-16 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-muted rounded-full">
                        <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-8">
                    Save items you love to your wishlist.
                </p>
                <Button asChild>
                    <Link to="/">Start Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden group">
                        <div className="aspect-square overflow-hidden bg-muted relative">
                            {item.product?.images?.[0] && (
                                <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                                />
                            )}
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => toggleWishlist(item.product_id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold truncate mb-1">{item.product?.name}</h3>
                            <p className="text-lg font-bold text-primary mb-4">
                                {formatPrice(item.product?.price || 0)}
                            </p>
                            <Button
                                className="w-full"
                                onClick={() => addToCart(item.product_id)}
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
