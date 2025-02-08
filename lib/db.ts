import { supabase } from './supabase'
import { Collection, CollectionQuery, Favorite } from './types'

export async function createCollection(name: string, description?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('collections')
    .insert([{ 
      name, 
      description,
      user_id: user.id  // Explicitly set the user_id
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function addQueryToCollection(collectionId: string, queryId: number) {
  const { error } = await supabase
    .from('collection_queries')
    .insert([{ collection_id: collectionId, query_id: queryId }])

  if (error) throw error
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

export async function getCollectionQueries(collectionId: string) {
  const { data, error } = await supabase
    .from('collection_queries')
    .select(`
      query_id,
      queries (*)
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