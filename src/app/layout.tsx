import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import EmotionRegistry from '@/components/EmotionRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dugod Admin',
  description: 'Admin dashboard for Dugod',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/old-english-five"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <EmotionRegistry>
          <Providers>{children}</Providers>
        </EmotionRegistry>
      </body>
    </html>
  );
}
