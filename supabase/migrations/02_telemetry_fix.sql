-- Asegurar restriccion unica en user_id para poder hacer UPSERT
ALTER TABLE user_usage ADD CONSTRAINT user_usage_user_id_key UNIQUE (user_id);

-- Funcion RPC para sumar tokens y consultas sin condiciones de carrera
CREATE OR REPLACE FUNCTION increment_user_usage(
  p_user_id UUID,
  p_tokens INT,
  p_cost NUMERIC,
  p_is_query BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$ 
BEGIN   
  INSERT INTO user_usage (user_id, total_tokens, total_cost_usd, queries_count)   
  VALUES (     
    p_user_id,     
    p_tokens,     
    p_cost,     
    CASE WHEN p_is_query THEN 1 ELSE 0 END   
  )   
  ON CONFLICT (user_id) DO UPDATE SET     
    total_tokens = user_usage.total_tokens + EXCLUDED.total_tokens,     
    total_cost_usd = user_usage.total_cost_usd + EXCLUDED.total_cost_usd,     
    queries_count = user_usage.queries_count + EXCLUDED.queries_count; 
END; 
$$;
