import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { cn } from "@/lib/utils"
import siteConfig from "@/site.config.mjs"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = { title: siteConfig.title, description: siteConfig.description }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}><body className="min-h-svh bg-background text-foreground"><div className="flex min-h-svh flex-col"><SiteHeader /><main className="flex-1">{children}</main><SiteFooter /></div></body></html>
}
