/**
 * SignUpForm component
 * 
 * Form for user registration with email, password, name, and phone.
 * Includes form validation using Zod schema.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpSchema, type SignUpFormData } from '@/schemas/authSchema'

export function SignUpForm() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({})
    const [loading, setLoading] = useState(false)

    /**
     * Handle input change
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error for this field
        if (errors[name as keyof SignUpFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Validate form data
        const result = signUpSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {}
            result.error.errors.forEach((error) => {
                const field = error.path[0] as keyof SignUpFormData
                fieldErrors[field] = error.message
            })
            setErrors(fieldErrors)
            return
        }

        setLoading(true)
        try {
            await signUp(formData.email, formData.password, formData.name, formData.phone)
            navigate('/')
        } catch (error) {
            // Error handled in AuthContext
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                />
                {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
        </form>
    )
}
