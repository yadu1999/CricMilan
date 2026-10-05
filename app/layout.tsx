import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: {
    default: 'CricMilan.in - Latest Cricket News, Breaking News, Stories',
    template: '%s - CricMilan'
  },
  description: 'Get your daily dose of cricket news, breaking headlines, stories, India matches, world coverage and trending articles on CricMilan.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cricmilan.in'),
  openGraph: {
    title: 'CricMilan.in - CRICKET & NEWS ALWAYS ON.',
    description: 'Get your daily dose of cricket news, breaking headlines, stories, India matches, world coverage and trending articles on CricMilan.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cricmilan.in',
    siteName: 'CricMilan',
    images: [
      {
        url: '/css/logo-og.jpg',
        width: 1200,
        height: 630,
        alt: 'CricMilan Logo'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CricMilan.in - CRICKET & NEWS ALWAYS ON.',
    description: 'Get your daily dose of cricket news, breaking headlines, stories, India matches, world coverage and trending articles on CricMilan.',
    images: ['/css/logo-og.jpg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="readingProgressBar"></div>
        <Navbar />
        <main className="container">
          <AdBanner type="header" />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

