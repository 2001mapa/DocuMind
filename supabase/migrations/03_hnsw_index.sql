-- Agregar ndice HNSW para bsquedas vectoriales ultra-rpidas
CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw ON document_embeddings USING hnsw (embedding vector_cosine_ops);
