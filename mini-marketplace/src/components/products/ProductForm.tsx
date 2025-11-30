/**
 * ProductForm component
 * 
 * Form for creating a new product listing.
 * Handles:
 * - Product name, price, and description input
 * - Multiple image uploads with preview
 * - Form validation using Zod
 * - Image upload to Supabase Storage
 * - Product data submission to database
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { productSchema } from '@/schemas/productSchema'
import { supabase, uploadFile } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import { isValidImageFile, isValidFileSize } from '@/lib/utils'
import { X, Upload } from 'lucide-react'

export function ProductForm() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
    })
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    /**
     * Handle text input changes
     */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    /**
     * Handle image file selection
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        // Validate files
        const validFiles: File[] = []
        const newPreviews: string[] = []

        for (const file of files) {
            if (!isValidImageFile(file)) {
                toast({
                    title: 'Invalid file type',
                    description: `${file.name} is not a valid image file`,
                    variant: 'destructive',
                })
                continue
            }

            if (!isValidFileSize(file)) {
                toast({
                    title: 'File too large',
                    description: `${file.name} exceeds 5MB limit`,
                    variant: 'destructive',
                })
                continue
            }

            validFiles.push(file)
            newPreviews.push(URL.createObjectURL(file))
        }

        // Check total image count
        if (images.length + validFiles.length > 5) {
            toast({
                title: 'Too many images',
                description: 'Maximum 5 images allowed',
                variant: 'destructive',
            })
            return
        }

        setImages((prev) => [...prev, ...validFiles])
        setImagePreviews((prev) => [...prev, ...newPreviews])

        // Clear error
        if (errors.images) {
            setErrors((prev) => ({ ...prev, images: '' }))
        }
    }

    /**
     * Remove an image from the selection
     */
    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setImagePreviews((prev) => {
            // Revoke object URL to free memory
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Validate form data
        const result = productSchema.safeParse({
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            images,
        })

        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.errors.forEach((error) => {
                const field = error.path[0] as string
                fieldErrors[field] = error.message
            })
            setErrors(fieldErrors)
            return
        }

        if (!user) {
            toast({
                title: 'Error',
                description: 'You must be logged in to create a product',
                variant: 'destructive',
            })
            return
        }

        setLoading(true)

        try {
            // Generate product ID
            const productId = crypto.randomUUID()

            // Upload images to Supabase Storage
            const imageUrls: string[] = []
            for (let i = 0; i < images.length; i++) {
                const file = images[i]
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${i}.${fileExt}`
                const filePath = `${user.id}/${productId}/${fileName}`

                const url = await uploadFile('product-images', filePath, file)
                imageUrls.push(url)
            }

            // Insert product into database
            const { error: insertError } = await supabase.from('products').insert({
                user_id: user.id,
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                images: imageUrls,
            } as any)

            if (insertError) throw insertError

            toast({
                title: 'Success!',
                description: 'Product listed successfully',
                variant: 'success',
            })

            // Navigate to home page
            navigate('/')
        } catch (error: any) {
            console.error('Error creating product:', error)
            toast({
                title: 'Error',
                description: error.message || 'Failed to create product',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., iPhone 13 Pro"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                )}
            </div>

            {/* Product Price */}
            <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 75000"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                )}
            </div>

            {/* Product Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe your product in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                )}
            </div>

            {/* Product Images */}
            <div className="space-y-2">
                <Label htmlFor="images">Product Images (Max 5)</Label>

                {/* Image previews */}
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                            <Card key={index} className="relative overflow-hidden">
                                <CardContent className="p-0">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full aspect-square object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                                        disabled={loading}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Upload button */}
                {images.length < 5 && (
                    <div>
                        <label
                            htmlFor="images"
                            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary transition-colors"
                        >
                            <div className="text-center">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Click to upload images
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {images.length}/5 images selected
                                </p>
                            </div>
                        </label>
                        <input
                            id="images"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageChange}
                            disabled={loading}
                            className="hidden"
                        />
                    </div>
                )}

                {errors.images && (
                    <p className="text-sm text-destructive">{errors.images}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating Product...' : 'List Product'}
            </Button>
        </form>
    )
}
