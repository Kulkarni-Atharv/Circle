import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format price to currency string
 * 
 * @param price - Price in decimal format
 * @returns Formatted price string (e.g., "₹1,234.56")
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(price)
}

/**
 * Format date to readable string
 * 
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date))
}

/**
 * Generate a unique ID for client-side use
 * 
 * @returns Unique string ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Validate file type for image uploads
 * 
 * @param file - File to validate
 * @returns True if file is a valid image type
 */
export function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    return validTypes.includes(file.type)
}

/**
 * Validate file size (max 5MB)
 * 
 * @param file - File to validate
 * @returns True if file size is within limit
 */
export function isValidFileSize(file: File): boolean {
    const maxSize = 5 * 1024 * 1024 // 5MB
    return file.size <= maxSize
}
