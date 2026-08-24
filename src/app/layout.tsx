import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DocuMind AI | Inteligencia Artificial para tus Documentos",
    template: "%s | DocuMind AI",
  },
  description: "Plataforma B2B inteligente de gestión y análisis de documentos. Extrae valor de tus PDFs con Inteligencia Artificial, RAG Corporativo y analítica avanzada.",
  keywords: ["RAG", "Inteligencia Artificial", "Análisis de Documentos", "SaaS B2B", "DocuMind AI", "Gestión Documental", "Gemini AI"],
  authors: [{ name: "DocuMind Team" }],
  creator: "DocuMind AI",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://documind-ai.com",
    title: "DocuMind AI | La evolución de tus documentos",
    description: "Extrae insights valiosos de tus PDFs en segundos con nuestro motor de Inteligencia Artificial.",
    siteName: "DocuMind AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuMind AI",
    description: "Habla con tus documentos. Inteligencia Artificial corporativa para extraer valor real de tus datos.",
    creator: "@documind_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Toaster } from "@/components/ui/toast";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
