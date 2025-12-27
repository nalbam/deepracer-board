import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './deepracer.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeepRacer Board',
  description: 'AWS DeepRacer League Management and Leaderboard System',
  keywords: 'deepracer, aws, racing, leaderboard, league',
  authors: [{ name: 'nalbam' }],
  openGraph: {
    title: 'DeepRacer Board',
    description: 'AWS DeepRacer League Management and Leaderboard System',
    url: 'https://deepracerboard.com',
    siteName: 'DeepRacer Board',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}