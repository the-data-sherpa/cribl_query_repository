# Cribl Query Repository

A web application for storing, searching, and sharing Cribl Stream and Search queries.

## Current Features

1. **Query Management**
   - Create new queries with title, description, content, and tags
   - View individual queries with syntax highlighting
   - List all queries with pagination

2. **Search Functionality**
   - Search queries by title

3. **Tag System**
   - Add tags to queries
   - Filter queries by tags
   - Display tags for each query

4. **User Interface**
   - Responsive dark-themed design
   - Syntax highlighting for query content
   - Pagination for query lists

5. **Database Integration**
   - Supabase integration for data storage and retrieval

## Getting Started

1. Clone the repository:
   \`\`\`
   git clone https://github.com/your-username/cribl-query-repository.git
   cd cribl-query-repository
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up Supabase:
   a. Go to [Supabase](https://supabase.com/) and create a new account or log in.
   b. Create a new project in Supabase.
   c. Once your project is ready, go to the project dashboard.
   d. In the left sidebar, click on "SQL Editor".
   e. Click on "New query" and paste the following SQL to create the necessary table:

   \`\`\`sql
   CREATE TABLE public.queries (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     description TEXT,
     tags TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX idx_queries_title ON public.queries USING GIN (to_tsvector('english', title));
   CREATE INDEX idx_queries_content ON public.queries USING GIN (to_tsvector('english', content));
   CREATE INDEX idx_queries_tags ON public.queries USING GIN (tags);

   -- Enable Row Level Security
   ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

   -- Create a policy that allows all operations for now (you can refine this later)
   CREATE POLICY "Allow all operations on queries" ON public.queries FOR ALL USING (true);
   \`\`\`

   f. Click "Run" to execute the SQL and create the table.

4. Set up environment variables:
   a. In the Supabase project dashboard, go to "Settings" > "API" in the left sidebar.
   b. Find your project URL and anon public key.
   c. Create a \`.env.local\` file in the root of your project and add the following:

   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
   \`\`\`

   Replace \`your_project_url\` and \`your_anon_public_key\` with the values from your Supabase project.

5. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

6. Open \`http://localhost:3000\` in your browser to see the application.

## TODO List

1. [x] Implement search functionality within query descriptions and content
2. [x] Add an edit feature for existing queries
3. [ ] Implement user authentication for personal collections or favorites
4. [ ] Add a "Copy to Clipboard" button for query content
5. [ ] Implement a version history feature for queries
6. [ ] Add a commenting system for queries
7. [ ] Implement a rating system for queries
8. [ ] Create an export/import feature for query collections

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
