import type { Metadata } from "next"
import Script from "next/script"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "RoastPage.ai - AI Landing Page Roaster | Brutal Feedback in 30 Seconds",
  description: "AI analyzes your landing page and gives brutal, actionable feedback on copy, design, CTAs, and conversion potential. Score your page 0-100.",
  keywords: ["landing page analyzer", "landing page roast", "conversion optimization", "AI feedback", "landing page score"],
  authors: [{ name: "RoastPage.ai" }],
  verification: { google: "UGxiVOS2RiiMw7wJ10LNKUHuMh1ic07dWVXk8sX9dig" },
  openGraph: {
    title: "RoastPage.ai - Your Landing Page Needs a Roast 🔥",
    description: "AI analyzes your landing page and gives brutal, actionable feedback in 30 seconds. Free to try!",
    type: "website",
    url: "https://roastpage-ai.com",
    siteName: "RoastPage.ai",
    images: [{ url: "https://roastpage-ai.com/api/og", width: 1200, height: 630, alt: "RoastPage.ai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastPage.ai - Your Landing Page Needs a Roast 🔥",
    description: "AI analyzes your landing page and gives brutal, actionable feedback in 30 seconds.",
    images: ["https://roastpage-ai.com/api/og"],
    creator: "@SavkinSergeyX",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://roastpage-ai.com"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>" />
        <link rel="canonical" href="https://roastpage-ai.com" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J77YBKV04K" strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-J77YBKV04K');`}
        </Script>
      </head>
      <body className="min-h-screen bg-dark-950 text-white antialiased">
        {children}
        <Toaster theme="dark" position="top-right"
          toastOptions={{ style: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" } }}
        />
      </body>
    </html>
  )
}