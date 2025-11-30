/**
 * Login page
 * 
 * User authentication page with login form.
 * Redirects to home if already authenticated.
 */

import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export function Login() {
    const { user } = useAuth()
    const navigate = useNavigate()

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    return (
        <Layout>
            <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-center">
                                Sign in to your account to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LoginForm />
                            <div className="mt-4 text-center text-sm">
                                <span className="text-muted-foreground">Don't have an account? </span>
                                <Link to="/signup" className="text-primary hover:underline font-medium">
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    )
}
