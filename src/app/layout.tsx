import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ensPR - Enterprise Sustainability Platform",
  description: "Enterprise sustainability intelligence for industrial companies.",
}

const themeScript = `
(function() {
  try {
    var s = localStorage.getItem('theme');
    var t = s || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var r = document.documentElement;
    if (t === 'dark') { r.classList.add('dark'); r.style.colorScheme = 'dark'; }
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased font-sans bg-app text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
