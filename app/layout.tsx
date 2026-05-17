import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Alwyn D'Souza — Data & AI Engineering Leader",
    template: "%s | Alwyn D'Souza",
  },
  description:
    "Data & AI Engineering Leader specializing in DataOps, dbt, Databricks, AI Agents, and Modern Data Platforms. 66+ published articles, 9 open-source projects.",
  authors: [{ name: "Alwyn D'Souza" }],
  creator: "Alwyn D'Souza",
  keywords: [
    "Data Engineering",
    "dbt",
    "Databricks",
    "DataOps",
    "AI Agents",
    "Semantic Layer",
    "Data Platform",
    "MLOps",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alwyndsouza.github.io",
    siteName: "Alwyn D'Souza",
    title: "Alwyn D'Souza — Data & AI Engineering Leader",
    description:
      "Building production-grade data platforms, AI systems, and developer tools that scale.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@aradsouza",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
