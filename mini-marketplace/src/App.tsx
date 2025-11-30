/**
 * Main App component
 * 
 * Sets up routing, authentication context, and React Query.
 * Defines all application routes with protected route wrapper.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/toaster'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Sell } from './pages/Sell'
import { CartPage } from './pages/CartPage'
import { WishlistPage } from './pages/WishlistPage'

// Create React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <BrowserRouter>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<SignUp />} />

                                {/* Protected routes */}
                                <Route
                                    path="/sell"
                                    element={
                                        <ProtectedRoute>
                                            <Sell />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/cart"
                                    element={
                                        <ProtectedRoute>
                                            <CartPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/wishlist"
                                    element={
                                        <ProtectedRoute>
                                            <WishlistPage />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>

                            {/* Toast notifications */}
                            <Toaster />
                        </BrowserRouter>
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
