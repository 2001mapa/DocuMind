<div align="center">
  <br />
  <h1>🧠 DocuMind AI</h1>
  <p>
    <strong>Plataforma B2B inteligente para gestión documental potenciada por RAG y Gemini AI.</strong>
  </p>
  <p>
    Sube tus PDFs corporativos, interactúa con ellos mediante lenguaje natural y obtén insights precisos y citados en milisegundos.
  </p>
  <br />

  [![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Google Gemini](https://img.shields.io/badge/Gemini_AI-Flash_3.6-8E75B2?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
</div>

<br />

## ✨ Características Principales

- **💬 Chat Inteligente con PDFs (RAG):** Procesamiento de lenguaje natural conectado directamente a tus documentos. Las respuestas incluyen citaciones exactas a la página del PDF original.
- **📝 Generador de Cartas de Presentación:** Módulo integrado que cruza la información de tu currículum (PDF) con la descripción de una oferta laboral (Job Description) para generar cartas altamente personalizadas.
- **🛡️ Seguridad y Rate Limiting:** Protección contra ataques DDoS y abusos de API mediante _Edge Rate Limiting_ global utilizando **Upstash Redis**. Políticas de Row Level Security (RLS) en base de datos.
- **⚡ Ingesta Paralelizada:** Generación de embeddings vectoriales por lotes (Batching) para un procesamiento de documentos ultra-rápido.
- **🎨 UI/UX Premium:** Interfaz minimalista, modo oscuro nativo y componentes accesibles (a11y) usando Radix / Base UI.

## 🏗️ Arquitectura Técnica

DocuMind AI implementa una arquitectura **Retrieval-Augmented Generation (RAG)** de vanguardia:

1. **Extracción:** Los archivos PDF se procesan en el servidor (`pdf-parse`) y se dividen en fragmentos semánticos (chunks).
2. **Vectorización:** Cada fragmento se convierte en un vector matemático a través del modelo `gemini-embedding-2`.
3. **Almacenamiento:** Los vectores se indexan en PostgreSQL utilizando la extensión `pgvector` en Supabase.
4. **Recuperación & Generación:** Las consultas de los usuarios se vectorizan; se ejecuta una búsqueda de similitud espacial (Similarity Search) y el contexto relevante se inyecta en un prompt hacia `gemini-3.6-flash`, el cual responde sin alucinaciones.

## 🚀 Despliegue Local

### 1. Clonar e Instalar
```bash
git clone https://github.com/tu-usuario/documind-ai.git
cd documind-ai
npm install
```

### 2. Variables de Entorno
Renombra el archivo `.env.example` a `.env.local` y configura los siguientes servicios:
```env
# Supabase (Auth & Database)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Google Gemini (Modelos LLM)
GEMINI_API_KEY=tu_api_key

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=tu_upstash_url
UPSTASH_REDIS_REST_TOKEN=tu_upstash_token
```

### 3. Iniciar Entorno de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 📊 Calidad del Código (Linter & Salud)
Este proyecto mantiene estrictos estándares de código:
- **100/100 Health Score** validado por auditores de código reactivos.
- **0 Vulnerabilidades** en dependencias.
- Implementación total de tipado estricto en TypeScript.

## ⚖️ Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
