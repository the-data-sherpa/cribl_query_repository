ALTER TABLE public.queries
ADD COLUMN tags TEXT[] DEFAULT '{}';

CREATE INDEX idx_queries_tags ON public.queries USING GIN (tags);

