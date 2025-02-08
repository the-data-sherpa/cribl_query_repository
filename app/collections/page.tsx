'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Collection } from '@/lib/types'
import { getUserCollections, createCollection } from '@/lib/db'
import Link from 'next/link'

export default function Collections() {
  const { user } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDesc, setNewCollectionDesc] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCollections()
  }, [])

  async function loadCollections() {
    try {
      const data = await getUserCollections()
      setCollections(data)
    } catch (error) {
      setError('Failed to load collections')
    }
  }

  async function handleCreateCollection(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createCollection(newCollectionName, newCollectionDesc)
      setNewCollectionName('')
      setNewCollectionDesc('')
      loadCollections()
    } catch (error) {
      setError('Failed to create collection')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center">
          Please sign in to view your collections
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Collections</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateCollection} className="mb-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Name</label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Description</label>
              <textarea
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Collection
            </button>
          </div>
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
              {collection.description && (
                <p className="text-gray-400">{collection.description}</p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                Created {new Date(collection.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 