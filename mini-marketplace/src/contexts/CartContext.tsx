import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { useToast } from '@/hooks/useToast'
import { CartContextValue, CartItemWithProduct } from '@/types'

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const { toast } = useToast()

    // Fetch cart items when user changes
    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            setCartItems([])
            setLoading(false)
        }
    }, [user])

    const fetchCart = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('cart_items')
                .select('*, product:products(*)')
                .order('created_at', { ascending: false })

            if (error) throw error

            setCartItems(data as CartItemWithProduct[])
        } catch (error: any) {
            console.error('Error fetching cart:', error)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = async (productId: string, quantity: number = 1) => {
        if (!user) {
            toast({
                title: 'Please login',
                description: 'You need to be logged in to add items to cart',
                variant: 'destructive',
            })
            return
        }

        try {
            // Check if item already exists
            const existingItem = cartItems.find(item => item.product_id === productId)

            if (existingItem) {
                // Update quantity if already exists
                await updateQuantity(productId, existingItem.quantity + quantity)
                toast({
                    title: 'Cart updated',
                    description: 'Item quantity updated in cart',
                    variant: 'success',
                })
            } else {
                // Insert new item
                const { error } = await supabase.from('cart_items').insert({
                    user_id: user.id,
                    product_id: productId,
                    quantity,
                })

                if (error) throw error

                await fetchCart()
                toast({
                    title: 'Added to cart',
                    description: 'Item added to your shopping cart',
                    variant: 'success',
                })
            }
        } catch (error: any) {
            console.error('Error adding to cart:', error)
            toast({
                title: 'Error',
                description: 'Failed to add item to cart',
                variant: 'destructive',
            })
        }
    }

    const removeFromCart = async (productId: string) => {
        if (!user) return

        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId)

            if (error) throw error

            setCartItems(prev => prev.filter(item => item.product_id !== productId))
            toast({
                title: 'Removed from cart',
                description: 'Item removed from your shopping cart',
                variant: 'info',
            })
        } catch (error: any) {
            console.error('Error removing from cart:', error)
            toast({
                title: 'Error',
                description: 'Failed to remove item from cart',
                variant: 'destructive',
            })
        }
    }

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!user) return
        if (quantity < 1) return

        try {
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('user_id', user.id)
                .eq('product_id', productId)

            if (error) throw error

            setCartItems(prev =>
                prev.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity }
                        : item
                )
            )
        } catch (error: any) {
            console.error('Error updating quantity:', error)
            toast({
                title: 'Error',
                description: 'Failed to update quantity',
                variant: 'destructive',
            })
        }
    }

    const clearCart = async () => {
        if (!user) return

        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)

            if (error) throw error

            setCartItems([])
            toast({
                title: 'Cart cleared',
                description: 'All items removed from your cart',
                variant: 'info',
            })
        } catch (error: any) {
            console.error('Error clearing cart:', error)
            toast({
                title: 'Error',
                description: 'Failed to clear cart',
                variant: 'destructive',
            })
        }
    }

    const isInCart = (productId: string) => {
        return cartItems.some(item => item.product_id === productId)
    }

    const value = {
        cartItems,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        loading
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
