/**
 * LoginForm component
 * 
 * Form for user authentication with email and password.
 * Includes form validation using Zod schema.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginFormData } from '@/schemas/authSchema'

export function LoginForm() {
    const navigate = useNavigate()
    const { signIn } = useAuth()
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
    const [loading, setLoading] = useState(false)

    /**
     * Handle input change
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error for this field
        if (errors[name as keyof LoginFormData]) {
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
        const result = loginSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
            result.error.errors.forEach((error) => {
                const field = error.path[0] as keyof LoginFormData
                fieldErrors[field] = error.message
            })
            setErrors(fieldErrors)
            return
        }

        setLoading(true)
        try {
            await signIn(formData.email, formData.password)
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

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
            </Button>
        </form>
    )
}
