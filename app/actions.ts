"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createQuery(title: string, content: string, description: string, tags: string[]) {
  const { data, error } = await supabase.from("queries").insert({ title, content, description, tags }).select()

  if (error) throw error
  revalidatePath("/")
  return data[0]
}

export async function getQuery(id: number) {
  const { data, error } = await supabase.from("queries").select().eq("id", id).single()

  if (error) throw error
  return data
}

export async function updateQuery(id: number, title: string, content: string, description: string, tags: string[]) {
  const { data, error } = await supabase
    .from("queries")
    .update({ title, content, description, tags })
    .eq("id", id)
    .select()

  if (error) throw error
  revalidatePath("/")
  revalidatePath(`/query/${id}`)
  return data[0]
}

export async function deleteQuery(id: number) {
  const { error } = await supabase.from("queries").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/")
}

export async function getRecentQueries(page = 1, pageSize = 10, selectedTags: string[] = []) {
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  let query = supabase
    .from("queries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, end)

  if (selectedTags.length > 0) {
    query = query.overlaps("tags", selectedTags)
  }

  const { data, error, count } = await query

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function searchQueries(term: string, page = 1, pageSize = 10, selectedTags: string[] = []) {
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  let query = supabase
    .from("queries")
    .select("*", { count: "exact" })
    .or(`title.ilike.%${term}%,description.ilike.%${term}%,content.ilike.%${term}%`)
    .order("created_at", { ascending: false })
    .range(start, end)

  if (selectedTags.length > 0) {
    query = query.overlaps("tags", selectedTags)
  }

  const { data, error, count } = await query

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getAllTags() {
  const { data, error } = await supabase.from("queries").select("tags")

  if (error) throw error

  const allTags = data.flatMap((query) => query.tags || [])
  return [...new Set(allTags)]
}

export async function addQueryToCollection(queryId: number, collectionId: string) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session?.user) {
      throw new Error('You must be logged in to add queries to collections')
    }

    const { data, error } = await supabase
      .from("collection_queries")
      .insert({
        query_id: queryId,
        collection_id: collectionId,
        user_id: session.user.id
      })
      .select()

    if (error) {
      console.error('Insert error:', error)
      throw error
    }
    return data[0]
  } catch (error) {
    console.error('Failed to add query to collection:', error)
    throw error
  }
}

export async function getUserCollections() {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    console.log('Auth check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      authError
    })

    if (authError || !session?.user) {
      console.log('No session or auth error:', authError)
      return []
    }

    console.log('Fetching collections for user:', session.user.id)
    
    // First, let's check if the user has any collections at all
    const { data: allCollections, error: countError } = await supabase
      .from("collections")
      .select('*')
    
    console.log('All collections in DB:', allCollections)

    const { data, error } = await supabase
      .from("collections")
      .select(`
        id,
        name,
        description,
        created_at,
        user_id
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Found collections for user:', {
      userId: session.user.id,
      collections: data,
      collectionCount: data?.length
    })

    return data || []
  } catch (error) {
    console.error('Failed to fetch user collections:', error)
    throw error
  }
}

