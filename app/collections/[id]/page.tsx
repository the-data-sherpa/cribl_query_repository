'use client'

import { useState, useEffect, use } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Collection } from '@/lib/types'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Container from '@/components/Container'

interface Query {
  id: number
  title: string
  description?: string
  created_at: string
}

interface CollectionWithQueries extends Collection {
  queries: Query[]
}

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useAuth()
  const [collection, setCollection] = useState<CollectionWithQueries | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCollection() {
      try {
        // First get the collection details
        const { data: collectionData, error: collectionError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()

        if (collectionError) throw collectionError
        if (!collectionData) throw new Error('Collection not found')

        // Then get the queries in this collection
        const { data: queriesData, error: queriesError } = await supabase
          .from('collection_queries')
          .select(`
            query_id,
            queries (*)
          `)
          .eq('collection_id', resolvedParams.id)

        if (queriesError) throw queriesError

        setCollection({
          ...collectionData,
          queries: queriesData?.map(q => q.queries) || []
        })
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load collection')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadCollection()
    }
  }, [resolvedParams.id, user])

  if (!user) {
    return (
      <Container>
        <div className="text-center">
          Please sign in to view collections
        </div>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container>
        <div className="text-center">Loading...</div>
      </Container>
    )
  }

  if (error || !collection) {
    return (
      <Container>
        <div className="text-center text-red-400">
          {error || 'Collection not found'}
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="text-gray-400 mt-2">{collection.description}</p>
          )}
        </div>
        <Link
          href="/collections"
          className="text-gray-400 hover:text-white"
        >
          Back to Collections
        </Link>
      </div>

      <div className="space-y-4">
        {collection.queries.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No queries in this collection yet
          </div>
        ) : (
          collection.queries.map((query) => (
            <Link
              key={query.id}
              href={`/query/${query.id}`}
              className="block p-4 bg-gray-800 rounded hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold">{query.title}</h2>
              {query.description && (
                <p className="text-gray-400 mt-2">{query.description}</p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                Created {new Date(query.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </Container>
  )
} 