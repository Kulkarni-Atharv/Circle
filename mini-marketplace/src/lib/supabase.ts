import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types'

/**
 * Supabase client configuration
 * 
 * This module initializes and exports the Supabase client for use throughout
 * the application. It provides type-safe access to the database, authentication,
 * and storage services.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'


/**
 * Supabase client instance with type-safe database schema
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

/**
 * Upload a file to Supabase Storage
 * 
 * @param bucket - Storage bucket name
 * @param path - File path within the bucket
 * @param file - File to upload
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
    bucket: string,
    path: string,
    file: File
): Promise<string> {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (error) {
        throw new Error(`Failed to upload file: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

    return publicUrl
}

/**
 * Delete a file from Supabase Storage
 * 
 * @param bucket - Storage bucket name
 * @param path - File path within the bucket
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
        throw new Error(`Failed to delete file: ${error.message}`)
    }
}

/**
 * Get the current authenticated user
 * 
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error('Error getting current user:', error)
        return null
    }

    return user
}
