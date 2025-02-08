import Link from "next/link"
import { getRecentQueries, getAllTags, searchQueries } from "./actions"
import SearchForm from "./SearchForm"
import TagFilter from "./TagFilter"
import Pagination from "./Pagination"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const currentPage = resolvedParams.page ? Number.parseInt(resolvedParams.page as string) : 1
  const pageSize = 10
  const selectedTags = resolvedParams.tags ? (resolvedParams.tags as string).split(",") : []
  const searchTerm = resolvedParams.q as string | undefined

  const { data: queries, count } = searchTerm
    ? await searchQueries(searchTerm, currentPage, pageSize, selectedTags)
    : await getRecentQueries(currentPage, pageSize, selectedTags)

  const allTags = await getAllTags()
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <SearchForm initialSearchTerm={searchTerm || ""} />
          <TagFilter allTags={allTags} />
          <div className="flex justify-between items-center">
            <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Submit New Query
            </Link>
          </div>
          <div className="grid gap-4">
            {queries.map((query) => (
              <Link
                key={query.id}
                href={`/query/${query.id}`}
                className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <h2 className="text-xl font-semibold">{query.title}</h2>
                {query.description && (
                  <p className="text-gray-400 mt-2">{query.description}</p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-400 text-sm">
                    Created by {query.user?.email}
                  </p>
                </div>
                {query.tags && query.tags.length > 0 && (
                  <div className="mt-2">
                    {query.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className={`inline-block rounded-full px-2 py-1 text-xs mr-2 mb-2 ${
                          selectedTags.includes(tag) ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          {queries.length === 0 && (
            <div className="text-center text-gray-400 py-8">No queries found matching your criteria</div>
          )}
          {queries.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
        </div>
      </main>
    </div>
  )
}

