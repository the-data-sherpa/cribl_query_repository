/**
 * Database interaction functions for the Cribl Query Repository
 */

import { supabase } from './supabase'
import { Collection, CollectionQuery, Favorite, Query } from './types'

/**
 * Creates a new collection for the authenticated user
 * @throws {Error} If user is not authenticated or database operation fails
 */
export async function createCollection(name: string, description?: string) {
  // Validate inputs
  if (!name?.trim()) throw new Error('Collection name is required')
  if (name.length > 100) throw new Error('Collection name must be less than 100 characters')
  if (description && description.length > 500) {
    throw new Error('Description must be less than 500 characters')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  try {
    const { data, error } = await supabase
      .from('collections')
      .insert([{ 
        name: name.trim(), 
        description: description?.trim(),
        user_id: user.id
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to create collection:', error)
    throw new Error('Failed to create collection')
  }
}

/**
 * Adds a query to a collection
 * @throws {Error} If database operation fails
 */
export async function addQueryToCollection(queryId: number, collectionId: string) {
  if (!queryId) throw new Error('Query ID is required')
  if (!collectionId) throw new Error('Collection ID is required')

  try {
    const { error } = await supabase
      .from('collection_queries')
      .insert([{ collection_id: collectionId, query_id: queryId }])

    if (error) {
      if (error.code === '23505') {
        throw new Error('Query is already in this collection')
      }
      throw error
    }
  } catch (error) {
    console.error('Failed to add query to collection:', error)
    throw error instanceof Error ? error : new Error('Failed to add query to collection')
  }
}

export async function removeQueryFromCollection(collectionId: string, queryId: string) {
  const { error } = await supabase
    .from('collection_queries')
    .delete()
    .match({ collection_id: collectionId, query_id: queryId })

  if (error) throw error
}

export async function toggleFavorite(queryId: string) {
  const { data: existing, error: checkError } = await supabase
    .from('favorites')
    .select()
    .match({ query_id: queryId })
    .single()

  if (checkError && checkError.code !== 'PGRST116') throw checkError

  if (existing) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ query_id: queryId })

    if (error) throw error
    return false // Not favorited
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert([{ query_id: queryId }])

    if (error) throw error
    return true // Favorited
  }
}

export async function getUserCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Gets queries for a collection with user information
 */
export async function getCollectionQueries(collectionId: string) {
  const { data, error } = await supabase
    .from('collection_queries')
    .select(`
      query_id,
      queries (
        *,
        user:user_id (
          email
        )
      )
    `)
    .eq('collection_id', collectionId)

  if (error) throw error
  return data
}

export async function getUserFavorites() {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      query_id,
      queries (*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Creates a new query
 * @throws {Error} If user is not authenticated or validation fails
 */
export async function createQuery(data: {
  title: string
  content: string
  description?: string
  tags?: string[]
}) {
  // Validate inputs
  if (!data.title?.trim()) throw new Error('Title is required')
  if (!data.content?.trim()) throw new Error('Content is required')
  if (data.title.length > 200) throw new Error('Title must be less than 200 characters')
  if (data.description && data.description.length > 1000) {
    throw new Error('Description must be less than 1000 characters')
  }
  if (data.tags && !Array.isArray(data.tags)) throw new Error('Tags must be an array')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  try {
    const { data: query, error } = await supabase
      .from('queries')
      .insert([{
        ...data,
        title: data.title.trim(),
        content: data.content.trim(),
        description: data.description?.trim(),
        user_id: user.id
      }])
      .select('*, user:user_id(email)')
      .single()

    if (error) throw error
    return query
  } catch (error) {
    console.error('Failed to create query:', error)
    throw new Error('Failed to create query')
  }
}

/**
 * Gets a single query by ID with user information
 */
export async function getQuery(id: number) {
  const { data, error } = await supabase
    .from('queries')
    .select(`
      *,
      user:user_id (
        email
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Gets all queries with user information
 */
export async function getQueries() {
  const { data, error } = await supabase
    .from('queries')
    .select(`
      *,
      user:user_id (
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
} 