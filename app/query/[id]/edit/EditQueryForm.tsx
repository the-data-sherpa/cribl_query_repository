"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateQuery } from "@/app/actions"

interface Query {
  id: number
  title: string
  content: string
  description: string
  tags: string[]
}

export default function EditQueryForm({ query }: { query: Query }) {
  const [title, setTitle] = useState(query.title)
  const [content, setContent] = useState(query.content)
  const [description, setDescription] = useState(query.description)
  const [tags, setTags] = useState(query.tags.join(", "))
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateQuery(
        query.id,
        title,
        content,
        description,
        tags.split(",").map((tag) => tag.trim()),
      )
      router.push(`/query/${query.id}`)
      router.refresh()
    } catch (error) {
      console.error("Failed to update query:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-20"
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2">
          Query Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-40"
          required
        />
      </div>
      <div>
        <label htmlFor="tags" className="block mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Query
        </button>
        <button
          type="button"
          onClick={() => router.push(`/query/${query.id}`)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

