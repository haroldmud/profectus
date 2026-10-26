import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { AIAssistant } from '@/components/assistant/AIAssistant'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Profectus — XR Learning Tracker',
  description: 'Track your progress through XR development',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0d0d0f] text-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
        <AIAssistant />
      </body>
    </html>
  )
}
