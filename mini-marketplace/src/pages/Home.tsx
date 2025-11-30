/**
 * Home page
 * 
 * Displays all products in a grid layout.
 * Fetches products using React Query and shows them with ProductGrid.
 * Opens ProductModal when a product is clicked.
 */

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Layout } from '@/components/layout/Layout'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductModal } from '@/components/products/ProductModal'
import type { Product, ProductWithSeller } from '@/types'
import { motion } from 'framer-motion'

export function Home() {
    const [selectedProduct, setSelectedProduct] = useState<ProductWithSeller | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    /**
     * Fetch all products with seller information
     */
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          profiles:user_id (
            name,
            phone
          )
        `)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Transform data to match ProductWithSeller type
            return data.map((product: any) => ({
                ...product,
                seller: {
                    name: product.profiles.name,
                    phone: product.profiles.phone,
                },
            })) as ProductWithSeller[]
        },
    })

    /**
     * Handle product card click
     */
    const handleProductClick = (product: Product) => {
        // Find the full product with seller info
        const fullProduct = products.find((p: ProductWithSeller) => p.id === product.id)
        if (fullProduct) {
            setSelectedProduct(fullProduct)
            setModalOpen(true)
        }
    }

    return (
        <Layout>
            <div className="container py-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Discover Amazing Products
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Browse through our marketplace and find great deals from sellers around you
                    </p>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <ProductGrid
                        products={products}
                        loading={isLoading}
                        onProductClick={handleProductClick}
                    />
                </motion.div>
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </Layout>
    )
}
