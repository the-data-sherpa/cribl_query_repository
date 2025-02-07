-- Create the queries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.queries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_queries_title ON public.queries USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_queries_content ON public.queries USING GIN (to_tsvector('english', content));

-- Enable Row Level Security
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can refine this later)
CREATE POLICY "Allow all operations on queries" ON public.queries FOR ALL USING (true);

