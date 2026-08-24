-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_size INT,
    page_count INT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Document Embeddings table
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    page_number INT,
    embedding VECTOR(768)
);

-- User Usage table
CREATE TABLE IF NOT EXISTS user_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_tokens INT DEFAULT 0,
    total_cost_usd NUMERIC DEFAULT 0,
    queries_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own documents"
ON documents FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own documents"
ON documents FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
ON documents FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON documents FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for document_embeddings
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own embeddings"
ON document_embeddings FOR SELECT TO authenticated
USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_embeddings.document_id
    AND documents.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own embeddings"
ON document_embeddings FOR INSERT TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_embeddings.document_id
    AND documents.user_id = auth.uid()
));

CREATE POLICY "Users can update their own embeddings"
ON document_embeddings FOR UPDATE TO authenticated
USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_embeddings.document_id
    AND documents.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own embeddings"
ON document_embeddings FOR DELETE TO authenticated
USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_embeddings.document_id
    AND documents.user_id = auth.uid()
));

-- RLS Policies for user_usage
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own usage"
ON user_usage FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Vector Similarity Search Function
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding VECTOR(768),
    match_threshold FLOAT,
    match_count INT
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    content_chunk TEXT,
    page_number INT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        de.id,
        de.document_id,
        de.content_chunk,
        de.page_number,
        1 - (de.embedding <=> query_embedding) AS similarity
    FROM
        document_embeddings de
    JOIN
        documents d ON d.id = de.document_id
    WHERE
        1 - (de.embedding <=> query_embedding) > match_threshold
        AND d.user_id = auth.uid() -- only match the user's documents
    ORDER BY
        de.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
