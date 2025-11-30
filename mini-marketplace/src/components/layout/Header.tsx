/**
 * Header component
 * 
 * Navigation header with logo, navigation links, and user menu.
 * Shows different options based on authentication state.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Plus, LogOut, User, Home as HomeIcon, ShoppingCart, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
    const { user, profile, signOut } = useAuth()
    const { cartCount } = useCart()
    const { wishlistCount } = useWishlist()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2"
                    >
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Mini-Marketplace
                        </span>
                    </motion.div>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {/* Home Link */}
                            <Link to="/" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
                                <HomeIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>

                            {/* Wishlist Link */}
                            <Link to="/wishlist" className="relative flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">Wishlist</span>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart Link */}
                            <Link to="/cart" className="relative flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
                                <ShoppingCart className="h-4 w-4" />
                                <span className="hidden sm:inline">Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Sell Button */}
                            <Button asChild>
                                <Link to="/sell" className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Sell
                                </Link>
                            </Button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 border-l pl-4">
                                <div className="hidden sm:flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{profile?.name}</span>
                                </div>
                                <Button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Home Link */}
                            <Link to="/" className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
                                <HomeIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>

                            <Button asChild>
                                <Link to="/login" className="text-sm hover:bg-accent hover:text-accent-foreground">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/signup" className="text-sm">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
