import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { useToast } from '@/hooks/useToast'
import { WishlistContextValue, WishlistItemWithProduct } from '@/types'

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItemWithProduct[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const { toast } = useToast()

    // Fetch wishlist items when user changes
    useEffect(() => {
        if (user) {
            fetchWishlist()
        } else {
            setWishlistItems([])
            setLoading(false)
        }
    }, [user])

    const fetchWishlist = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('wishlist_items')
                .select('*, product:products(*)')
                .order('created_at', { ascending: false })

            if (error) throw error

            setWishlistItems(data as WishlistItemWithProduct[])
        } catch (error: any) {
            console.error('Error fetching wishlist:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleWishlist = async (productId: string) => {
        if (!user) {
            toast({
                title: 'Please login',
                description: 'You need to be logged in to use wishlist',
                variant: 'destructive',
            })
            return
        }

        try {
            const exists = wishlistItems.some(item => item.product_id === productId)

            if (exists) {
                // Remove from wishlist
                const { error } = await supabase
                    .from('wishlist_items')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', productId)

                if (error) throw error

                setWishlistItems(prev => prev.filter(item => item.product_id !== productId))
                toast({
                    title: 'Removed from wishlist',
                    description: 'Item removed from your wishlist',
                    variant: 'info',
                })
            } else {
                // Add to wishlist
                const { error } = await supabase.from('wishlist_items').insert({
                    user_id: user.id,
                    product_id: productId,
                })

                if (error) throw error

                await fetchWishlist()
                toast({
                    title: 'Added to wishlist',
                    description: 'Item added to your wishlist',
                    variant: 'success',
                })
            }
        } catch (error: any) {
            console.error('Error toggling wishlist:', error)
            toast({
                title: 'Error',
                description: 'Failed to update wishlist',
                variant: 'destructive',
            })
        }
    }

    const isInWishlist = (productId: string) => {
        return wishlistItems.some(item => item.product_id === productId)
    }

    const value = {
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        isInWishlist,
        loading
    }

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
