import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'GeoImpact Intelligence | REAL-TIME ANALYTICS',
  description: 'Real-world geopolitical impact analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased bg-[#FFFFFF] text-[#0F172A] min-h-full">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
