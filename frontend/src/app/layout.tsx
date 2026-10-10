import type { Metadata } from "next";
import { fontFraunces, fontDmSans, fontSpaceMono } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteBackground } from "@/components/layout/SiteBackground";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "ResearchPilot | Autonomous AI Research Agent",
  description:
    "Autonomous research agent that plans, searches the web, reads pages, takes notes, and writes reports within strict limits.",
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fontFraunces.variable, fontDmSans.variable, fontSpaceMono.variable, inter.variable)}
    >
      <body className="min-h-screen flex flex-col bg-bg text-ink font-sans antialiased selection:bg-gold-light selection:text-ink">
        <SiteBackground />
        <Header />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
