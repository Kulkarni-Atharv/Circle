import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, loading } = useCart()

    const total = cartItems.reduce((acc, item) => {
        return acc + (item.product?.price || 0) * item.quantity
    }, 0)

    if (loading) {
        return (
            <div className="container py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-muted rounded"></div>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-32 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="container py-16 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-muted rounded-full">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Button asChild>
                    <Link to="/">Start Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <Button variant="outline" onClick={() => clearCart()} className="text-destructive hover:text-destructive">
                    Clear Cart
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-4 flex gap-4">
                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                                    {item.product?.images?.[0] && (
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-semibold">{item.product?.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {item.product?.description}
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            {formatPrice((item.product?.price || 0) * item.quantity)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => removeFromCart(item.product_id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                            </div>
                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>
                            <Button className="w-full" size="lg">
                                Proceed to Checkout
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                This is a demo checkout. No payment will be processed.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
