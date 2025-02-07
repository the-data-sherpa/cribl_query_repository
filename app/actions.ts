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

