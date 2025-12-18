import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { config } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: `${config.site.name} - Streaming Drama Asia Terlengkap`,
    template: `%s | ${config.site.name}`,
  },
  description: config.site.description,
  keywords: ['drama korea', 'drama china', 'drama jepang', 'nonton drama', 'streaming drama', 'drama asia', 'drakor', 'dracin'],
  authors: [{ name: 'Rizal Dracin' }],
  creator: 'Rizal Dracin',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: config.site.url,
    siteName: config.site.name,
    title: `${config.site.name} - Streaming Drama Asia Terlengkap`,
    description: config.site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.site.name} - Streaming Drama Asia Terlengkap`,
    description: config.site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
