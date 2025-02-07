import { getQuery } from "@/app/actions"
import EditQueryForm from "./EditQueryForm"
import Link from "next/link"

/**
 * Edit query page component
 * Uses async/await for params to comply with Next.js 15 requirements
 */
export default async function EditQueryPage({
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
      {/* Navigation */}
      <div className="mb-6">
        <Link href={`/query/${id}`} className="text-blue-400 hover:underline">
          &larr; Back to Query
        </Link>
      </div>
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">Edit Query</h1>
      {/* Edit form */}
      <EditQueryForm query={query} />
    </div>
  )
}

