import { getQuery } from "@/app/actions"
import Link from "next/link"
import QueryContent from "./QueryContent"
import QueryActions from '@/components/QueryActions'

/**
 * Individual query view page component
 * Uses async/await for params to comply with Next.js 15 requirements
 */
export default async function QueryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params before accessing its properties
  const resolvedParams = await params
  const id = Number.parseInt(resolvedParams.id, 10)
  const query = await getQuery(id)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{query.title}</h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-400 hover:underline">
              &larr; Back to Home
            </Link>
            <QueryActions queryId={id} />
          </div>
        </div>
        {/* Query description (if available) */}
        {query.description && <p className="text-gray-400 mb-4">{query.description}</p>}
        {/* Query content with syntax highlighting and copy button */}
        <QueryContent content={query.content} />
        {/* Query metadata */}
        <p className="mt-4 text-gray-400">Created at: {new Date(query.created_at).toLocaleString()}</p>
        {/* Query tags */}
        {query.tags && query.tags.length > 0 && (
          <div className="mt-4">
            {query.tags.map((tag: string, index: number) => (
              <span key={index} className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-xs mr-2">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
