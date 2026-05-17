import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider, themeScript } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

const BASE_URL = "https://alwyndsouza.github.io";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Alwyn D'Souza — Data & AI Engineering Leader",
    template: "%s | Alwyn D'Souza",
  },
  description:
    "Data & AI Engineering Leader specializing in DataOps, dbt, Databricks, AI Agents, and Modern Data Platforms. Published articles and open-source projects.",
  authors: [{ name: "Alwyn D'Souza", url: BASE_URL }],
  creator: "Alwyn D'Souza",
  publisher: "Alwyn D'Souza",
  keywords: [
    "Data Engineering",
    "dbt",
    "Databricks",
    "DataOps",
    "AI Agents",
    "Semantic Layer",
    "Data Platform",
    "MLOps",
    "Lakehouse",
    "Unity Catalog",
    "MCP",
    "Enterprise Architecture",
  ],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Alwyn D'Souza",
    title: "Alwyn D'Souza — Data & AI Engineering Leader",
    description:
      "Building production-grade data platforms, AI systems, and developer tools that scale for enterprise teams.",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Alwyn D'Souza — Data & AI Engineering Leader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@aradsouza",
    title: "Alwyn D'Souza — Data & AI Engineering Leader",
    description:
      "Building production-grade data platforms, AI systems, and developer tools that scale for enterprise teams.",
    images: ["/og-default.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
    types: { "application/rss+xml": `${BASE_URL}/rss.xml` },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Blocking script: sets dark/light class before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-600/30 selection:text-zinc-100">
        <ThemeProvider>
          {/* Skip to main content — keyboard / screen-reader nav */}
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-indigo-600 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:shadow-lg"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
