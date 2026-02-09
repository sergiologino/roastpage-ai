import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "RoastPage.ai - AI Landing Page Roaster",
  description: "Get brutal, actionable AI feedback on your landing page. Analyze design, copy, CTAs, and conversion potential in 30 seconds.",
  keywords: ["landing page", "roast", "ai analysis", "conversion optimization"],
  openGraph: {
    title: "RoastPage.ai - AI Landing Page Roaster",
    description: "Get brutal, actionable AI feedback on your landing page in 30 seconds.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-950 text-white antialiased">
        {children}
        <Toaster theme="dark" position="top-right"
          toastOptions={{ style: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" } }}
        />
      </body>
    </html>
  )
}
