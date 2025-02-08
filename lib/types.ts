export interface Collection {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface CollectionQuery {
  collection_id: string
  query_id: number
  added_at: string
}

export interface Favorite {
  user_id: string
  query_id: number
  created_at: string
}

export interface Query {
  id: number
  title: string
  content: string
  description?: string
  tags?: string[]
  created_at: string
  updated_at: string
  user_id: string
  user: {
    email: string
  }
}