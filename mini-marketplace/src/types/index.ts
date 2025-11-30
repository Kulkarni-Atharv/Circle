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
                Relationships: [];
            };
            products: {
                Row: Product;
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Product, 'id' | 'user_id' | 'created_at'>>;
                Relationships: [
                    {
                        foreignKeyName: "products_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            cart_items: {
                Row: CartItem;
                Insert: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<CartItem, 'id' | 'user_id' | 'created_at'>>;
                Relationships: [
                    {
                        foreignKeyName: "cart_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "cart_items_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            wishlist_items: {
                Row: WishlistItem;
                Insert: Omit<WishlistItem, 'id' | 'created_at'>;
                Update: Partial<Omit<WishlistItem, 'id' | 'user_id' | 'created_at'>>;
                Relationships: [
                    {
                        foreignKeyName: "wishlist_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wishlist_items_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
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

