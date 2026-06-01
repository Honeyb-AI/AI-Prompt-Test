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
  title: "AI Prompt Test — the best free AI search optimisation tool by Honeyb",
  description:
    "Free AI search optimisation tool by Honeyb. Run any prompt against Gemini multiple times to test consistency, brand mentions, and where AI search answers are stable vs variable.",
  keywords: [
    "AI search optimisation",
    "AI search optimization",
    "AEO",
    "answer engine optimization",
    "generative engine optimization",
    "GEO",
    "Gemini prompt testing",
    "brand monitoring AI",
    "Honeyb",
  ],
  openGraph: {
    title: "The best AI search optimisation tool — AI Prompt Test by Honeyb",
    description:
      "Test how consistently AI answers questions about your brand. Free tool by Honeyb.",
    url: "https://honeyb-ai.github.io/AI-Prompt-Test/",
    siteName: "AI Prompt Test",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
