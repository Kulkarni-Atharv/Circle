/**
 * Type definitions for the Mini-Marketplace application
 */

/**
 * Database types
 */
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: {
                    id: string;
                    name: string;
                    phone: string;
                    email: string;
                };
                Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
            };
            products: {
                Row: Product;
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Product, 'id' | 'user_id' | 'created_at'>>;
            };
        };
    };
}

/**
 * User profile stored in the profiles table
 */
export interface Profile {
    id: string;
    name: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
}

/**
 * Product listing in the marketplace
 */
export interface Product {
    id: string;
    user_id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    created_at: string;
    updated_at: string;
}

/**
 * Product with seller information (joined query result)
 */
export interface ProductWithSeller extends Product {
    seller: {
        name: string;
        phone: string;
    };
}

/**
 * Authentication context value
 */
export interface AuthContextValue {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

/**
 * Authenticated user from Supabase Auth
 */
export interface User {
    id: string;
    email: string;
}

/**
 * Form data for creating a new product
 */
export interface ProductFormData {
    name: string;
    price: number;
    description: string;
    images: File[];
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

/**
 * Cart item in the shopping cart
 */
export interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    product?: Product;
}

/**
 * Cart item with product details (joined query result)
 */
export interface CartItemWithProduct extends CartItem {
    product: Product;
}

/**
 * Wishlist item
 */
export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
    product?: Product;
}

/**
 * Wishlist item with product details (joined query result)
 */
export interface WishlistItemWithProduct extends WishlistItem {
    product: Product;
}

/**
 * Cart context value
 */
export interface CartContextValue {
    cartItems: CartItemWithProduct[];
    cartCount: number;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    isInCart: (productId: string) => boolean;
    loading: boolean;
}

/**
 * Wishlist context value
 */
export interface WishlistContextValue {
    wishlistItems: WishlistItemWithProduct[];
    wishlistCount: number;
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
}

