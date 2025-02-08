import { VERSION } from '@/lib/version'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <p>Cribl Query Repository v{VERSION}</p>
        <p className="mt-1">
          <a
            href="https://github.com/the-data-sherpa/cribl_query_repository"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
} 