
  import type { Metadata } from 'next'

  export const metadata: Metadata = {
    title: 'Baleine Media - Professional Photography',
    description: 'Professional photography services',
  }

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    )
  }
