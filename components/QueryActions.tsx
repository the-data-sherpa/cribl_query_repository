'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUserCollections, addQueryToCollection } from '@/lib/db'

interface Collection {
  id: string; // or number, depending on your data structure
  name: string;
}

export default function QueryActions({ queryId }: { queryId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCollections, setShowCollections] = useState(false)

  useEffect(() => {
    if (showCollections) {
      const fetchCollections = async () => {
        try {
          console.log('Fetching collections...')
          const userCollections = await getUserCollections()
          console.log('Received collections:', userCollections)
          setCollections(userCollections)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          setError(`Failed to fetch collections: ${errorMessage}`)
          console.error('Collection fetch error:', err)
        }
      }
      fetchCollections()
    }
  }, [showCollections])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.actions-dropdown')) {
        setIsOpen(false)
        setShowCollections(false)
      }
    }

    if (isOpen) {
      window.addEventListener('click', handleClickOutside)
    }

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const handleAddToCollection = async (collectionId: string) => {
    try {
      setLoading(true)
      setError('')
      await addQueryToCollection(queryId, collectionId)
      setShowCollections(false)
      setIsOpen(false)
    } catch (err) {
      setError('Failed to add query to collection')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative actions-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        Actions {loading && '...'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50">
          <div className="py-1">
            <Link
              href={`/query/${queryId}/edit`}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowCollections(true)}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Add to Collection
            </button>
          </div>

          {showCollections && (
            <div className="border-t border-gray-700">
              {collections.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-400">
                  <p>No collections found.</p>
                  <Link 
                    href="/collections"
                    className="text-blue-400 hover:underline block mt-2"
                  >
                    Create a Collection
                  </Link>
                  {error && (
                    <div className="mt-1 text-red-400">
                      Error: {error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-1">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => handleAddToCollection(collection.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="px-4 py-2 text-sm text-red-400 border-t border-gray-700">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 