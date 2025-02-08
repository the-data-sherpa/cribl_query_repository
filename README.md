# Cribl Query Repository

A web application for storing, searching, and sharing Cribl Stream and Search queries.

## Current Features

1. **Query Management**
   - Create new queries with title, description, content, and tags.
   - View individual queries with syntax highlighting.
   - List all queries with pagination.

2. **Search Functionality**
   - Search queries by title.

3. **Tag System**
   - Add tags to queries.
   - Filter queries by tags.
   - Display tags for each query.

4. **User Interface**
   - Responsive dark-themed design.
   - Syntax highlighting for query content.
   - Pagination for query lists.

5. **Database Integration**
   - Supabase integration for data storage and retrieval.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone git@github.com:the-data-sherpa/cribl_query_repository.git
   cd cribl_query_repository
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Go to [Supabase](https://supabase.com/) and create a new account or log in.  
   - Create a new project in Supabase.  
   - Once your project is ready, go to the project dashboard.  
   - In the left sidebar, click on "SQL Editor".  
   - Click on "New query" and paste the following SQL to create the necessary table:

   ```sql
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
   ```

   - Click "Run" to execute the SQL and create the table.

4. **Set up environment variables:**
   - In the Supabase project dashboard, go to "Settings" > "API" in the left sidebar.  
   - Find your project URL and anon public key.  
   - Create a `.env.local` file in the root of your project and add the following:

   ```plaintext
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
   ```

   Replace `your_project_url` and `your_anon_public_key` with the values from your Supabase project.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open** `http://localhost:3000` in your browser to see the application.

## TODO List

1. [x] Implement search functionality within query descriptions and content.
2. [x] Add an edit feature for existing queries.
3. [ ] Implement user authentication for personal collections or favorites.
4. [x] Add a "Copy to Clipboard" button for query content.
5. [ ] Implement a version history feature for queries.
6. [ ] Add a commenting system for queries.
7. [ ] Implement a rating system for queries.
8. [ ] Create an export/import feature for query collections.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
