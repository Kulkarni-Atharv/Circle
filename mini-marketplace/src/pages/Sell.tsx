/**
 * Sell page
 * 
 * Protected page for creating new product listings.
 * Only accessible to authenticated users.
 */

import { Layout } from '@/components/layout/Layout'
import { ProductForm } from '@/components/products/ProductForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export function Sell() {
    return (
        <Layout>
            <div className="container py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">List a Product</CardTitle>
                            <CardDescription>
                                Fill in the details below to list your product on the marketplace
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductForm />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    )
}
