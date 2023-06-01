'use client'

import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient()

export const metadata = {
  title: 'Time Tracker',
  description: 'A simple time tracker',
}

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </QueryClientProvider>
  )
}
