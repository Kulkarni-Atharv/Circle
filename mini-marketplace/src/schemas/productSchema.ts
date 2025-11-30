import { z } from 'zod'

/**
 * Validation schema for product creation
 */
export const productSchema = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    price: z.number().min(0.01, 'Price must be greater than 0'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    images: z.array(z.instanceof(File)).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
})

export type ProductFormData = z.infer<typeof productSchema>
