import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {CounterContextProvider} from '@/context/counter.context'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Navbar from '@/components/Navbar';
import SideDrawer from '@/components/SideDrawer';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Romscent Warehouse',
  description: 'Smells good',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
          <body className={inter.className}>
          <SideDrawer />
                  {children}
          </body>
      </html>
  )
}
