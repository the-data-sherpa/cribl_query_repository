# Cribl Query Repository

A web application for storing, searching, and sharing Cribl Stream and Search queries.

## Current Features

1. **Query Management**
   - Create new queries with title, description, content, and tags.
   - View individual queries with syntax highlighting.
   - List all queries with pagination.
   - Copy queries to clipboard with in-code copy button.

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
   - Dropdown actions menu for query operations.

5. **Database Integration**
   - Supabase integration for data storage and retrieval.

6. **Authentication**
   - User sign-up and sign-in functionality.
   - Protected routes and authenticated API calls.

7. **Collections**
   - Create personal query collections.
   - Add queries to collections.
   - View and manage collections.

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
   - Click on "New query" and paste the following SQL to create the necessary tables:

   ```sql
   -- Create the queries table
   CREATE TABLE public.queries (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     description TEXT,
     tags TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   -- Create collections table
   CREATE TABLE collections (
     id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
     name text NOT NULL,
     description text,
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Create collection_queries junction table
   CREATE TABLE collection_queries (
     collection_id uuid REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
     query_id integer REFERENCES queries(id) ON DELETE CASCADE NOT NULL,
     added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     PRIMARY KEY (collection_id, query_id)
   );

   -- Create favorites table
   CREATE TABLE favorites (
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     query_id integer REFERENCES queries(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
     PRIMARY KEY (user_id, query_id)
   );

   -- Create indexes
   CREATE INDEX idx_queries_title ON public.queries USING GIN (to_tsvector('english', title));
   CREATE INDEX idx_queries_content ON public.queries USING GIN (to_tsvector('english', content));
   CREATE INDEX idx_queries_tags ON public.queries USING GIN (tags);

   -- Enable Row Level Security
   ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
   ALTER TABLE collection_queries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Enable insert for authenticated users only" ON collections
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Enable select for authenticated users" ON collections
     FOR SELECT USING (auth.uid() = user_id);

   -- Add other necessary policies as needed
   ```

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
3. [x] Implement basic user authentication and personal collections.
4. [x] Add a "Copy to Clipboard" button for query content.
5. [ ] Implement a version history feature for queries.
6. [ ] Add a commenting system for queries.
7. [ ] Implement a rating system for queries.
8. [ ] Create an export/import feature for query collections.
9. [ ] Add collection sharing functionality.
10. [ ] Implement query favorites management.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
