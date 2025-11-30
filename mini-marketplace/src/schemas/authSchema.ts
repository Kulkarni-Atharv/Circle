import { z } from 'zod'

/**
 * Validation schema for user sign up
 */
export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

/**
 * Validation schema for user login
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
export type LoginFormData = z.infer<typeof loginSchema>
