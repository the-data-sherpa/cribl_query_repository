# Cribl Query Repository

A web application for storing, searching, and sharing Cribl Stream and Search queries.

## Current Features

1. **Query Management**
   - Create new queries with title, description, content, and tags
   - View individual queries with syntax highlighting
   - List all queries with pagination
   - In-code copy button for easy copying
   - Track query ownership

2. **Search Functionality**
   - Search queries by title
   - Filter queries by tags
   - Tag-based filtering with multi-select

3. **Collections**
   - Create personal query collections
   - Add queries to collections
   - View and manage collections
   - Collection ownership tracking

4. **Authentication**
   - Email-based authentication (restricted to @cribl.io domain)
   - Protected routes
   - User session management
   - Secure sign-in/sign-out

5. **User Interface**
   - Responsive dark-themed design
   - Syntax highlighting for query content
   - Pagination for query lists
   - Dropdown actions menu
   - Version indicator in footer

## Database Setup

Run these SQL commands in your Supabase SQL editor to set up the necessary tables and policies:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the queries table
CREATE TABLE public.queries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
CREATE INDEX idx_queries_user_id ON public.queries(user_id);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Enable Row Level Security
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for queries
CREATE POLICY "Users can view all queries" 
  ON public.queries FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own queries" 
  ON public.queries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queries" 
  ON public.queries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own queries" 
  ON public.queries FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for collections
CREATE POLICY "Enable insert for authenticated users only" 
  ON collections FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for authenticated users" 
  ON collections FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own collections" 
  ON collections FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections" 
  ON collections FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for collection queries
CREATE POLICY "Users can add queries to own collections" 
  ON collection_queries FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM collections WHERE id = collection_id
    )
  );

CREATE POLICY "Users can view queries in own collections" 
  ON collection_queries FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM collections WHERE id = collection_id
    )
  );

CREATE POLICY "Users can remove queries from own collections" 
  ON collection_queries FOR DELETE 
  USING (
    auth.uid() IN (
      SELECT user_id FROM collections WHERE id = collection_id
    )
  );

-- Create RLS policies for favorites
CREATE POLICY "Users can favorite queries" 
  ON favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own favorites" 
  ON favorites FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unfavorite queries" 
  ON favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to validate email domain
CREATE OR REPLACE FUNCTION public.validate_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@cribl.io' THEN
    RAISE EXCEPTION 'Only @cribl.io email addresses are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for email validation
CREATE TRIGGER validate_email_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_email_domain();
```

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

1. [x] Implement search functionality within query descriptions and content
2. [x] Add an edit feature for existing queries
3. [x] Implement basic user authentication and personal collections
4. [x] Add a "Copy to Clipboard" button for query content
5. [x] Add email domain restriction (@cribl.io)
6. [x] Add query ownership tracking
7. [ ] Implement a version history feature for queries
8. [ ] Add a commenting system for queries
9. [ ] Implement a rating system for queries
10. [ ] Create an export/import feature for query collections
11. [ ] Add collection sharing functionality
12. [ ] Implement query favorites management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
