import { LanguageProvider } from '@/lib/i18n';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://waze-gabon-club.vercel.app'),
  title: {
    default: 'Waze Gabon Club — La communaute Waze du Gabon',
    template: '%s | Waze Gabon Club',
  },
  description: 'Rejoignez la premiere communaute Waze du Gabon. Tutoriels, carte live de Libreville, signalements en temps reel et entraide entre conducteurs gabonais.',
  keywords: [
    'Waze', 'Gabon', 'Libreville', 'navigation', 'GPS', 'trafic',
    'embouteillage', 'communaute', 'conducteur', 'carte', 'itineraire',
    'Waze Gabon', 'Waze Libreville', 'circulation Libreville',
    'application GPS Gabon', 'trafic Libreville',
  ],
  authors: [{ name: 'Waze Gabon Club' }],
  creator: 'Waze Gabon Club',
  publisher: 'Waze Gabon Club',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Waze Gabon Club — Conduisez plus malin au Gabon',
    description: 'La premiere communaute Waze du Gabon. Tutoriels, carte live, alertes trafic et entraide.',
    url: 'https://waze-gabon-club.vercel.app',
    siteName: 'Waze Gabon Club',
    locale: 'fr_GA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waze Gabon Club — Conduisez plus malin au Gabon',
    description: 'La premiere communaute Waze du Gabon.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#009E49',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
