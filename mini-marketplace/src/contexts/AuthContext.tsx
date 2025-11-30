/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Manages user session, profile data, and authentication operations.
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthContextValue, Profile, User } from '@/types'
import { useToast } from '@/hooks/useToast'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * AuthProvider component
 * Wraps the application to provide authentication context
 * 
 * @param children - Child components
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    /**
     * Fetch user profile from database
     */
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            setProfile(data)
        } catch (error) {
            console.error('Error fetching profile:', error)
        }
    }

    /**
     * Initialize authentication state
     */
    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }: any) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                })
                fetchProfile(session.user.id)
            }
            setLoading(false)
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                })
                fetchProfile(session.user.id)
            } else {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    /**
     * Sign up a new user
     * 
     * @param email - User email
     * @param password - User password
     * @param name - User full name
     * @param phone - User phone number
     */
    const signUp = async (
        email: string,
        password: string,
        name: string,
        phone: string
    ) => {
        try {
            // Create auth user with metadata (trigger will create profile automatically)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        phone,
                    }
                }
            })

            if (authError) throw authError

            if (!authData.user) {
                throw new Error('User creation failed')
            }

            toast({
                title: 'Success!',
                description: 'Account created successfully',
                variant: 'success',
            })
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create account',
                variant: 'destructive',
            })
            throw error
        }
    }

    /**
     * Sign in an existing user
     * 
     * @param email - User email
     * @param password - User password
     */
    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toast({
                title: 'Welcome back!',
                description: 'Signed in successfully',
                variant: 'success',
            })
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to sign in',
                variant: 'destructive',
            })
            throw error
        }
    }

    /**
     * Sign out the current user
     */
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            toast({
                title: 'Signed out',
                description: 'You have been signed out successfully',
            })
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to sign out',
                variant: 'destructive',
            })
            throw error
        }
    }

    const value: AuthContextValue = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to access authentication context
 * 
 * @returns Authentication context value
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
