import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {CounterContextProvider} from '@/context/counter.context'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SideDrawer from '@/components/SideDrawer';
import {CSSObject} from '@emotion/react';


const inter = Inter({ subsets: ['latin'] })

const frameStyle:CSSObject={
        marginTop:"2.5rem",
        width:"100vw",
        padding:"3rem",
    }

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
          <body style={{display:"flex"}} className={inter.className}>
              <SideDrawer />

              <div style={frameStyle}>
                {children}
              </div>
          </body>
      </html>
  )
}
