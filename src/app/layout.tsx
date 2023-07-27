import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {CSSObject} from '@emotion/react';
import ContextProvider from './state/context';
import SideDrawer from '@/components/features/SideDrawer';


const inter = Inter({ subsets: ['latin'] })

const frameStyle:CSSObject={
        marginTop:"3.5rem",
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
          <ContextProvider>
              <body style={{display: "flex"}} className={inter.className}>
                  <SideDrawer />
                  <div style={frameStyle}>
                      {children}
                  </div>
              </body>
          </ContextProvider>
      </html>
  )
}
