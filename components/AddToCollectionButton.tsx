'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getUserCollections, addQueryToCollection } from '@/lib/db'
import { Collection } from '@/lib/types'

export default function AddToCollectionButton({ queryId, id }: { queryId: number, id?: string }) {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    try {
      setLoading(true)
      const data = await getUserCollections()
      setCollections(data)
      setShowModal(true)
    } catch (error) {
      setError('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddToCollection(collectionId: string) {
    try {
      setLoading(true)
      await addQueryToCollection(collectionId, queryId)
      setShowModal(false)
      // Optional: Show success message
    } catch (error) {
      setError('Failed to add query to collection')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <>
      <button
        id={id}
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add to Collection
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Add to Collection</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              {collections.length === 0 ? (
                <p className="text-gray-400">No collections found. Create one first!</p>
              ) : (
                collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleAddToCollection(collection.id)}
                    disabled={loading}
                    className="w-full text-left px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
                  >
                    {collection.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 