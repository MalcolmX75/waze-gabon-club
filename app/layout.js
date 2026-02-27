import { LanguageProvider } from '@/lib/i18n';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import './globals.css';

export const metadata = {
  // === BASE ===
  metadataBase: new URL('https://wazegabon.com'),
  title: {
    default: 'Waze Gabon Club #1 — Conduisez plus malin au Gabon',
    template: '%s | Waze Gabon Club',
  },
  description: 'Rejoignez la 1ere communaute Waze du Gabon. Tutoriels complets, carte trafic en temps reel, alertes routieres, signalements et entraide entre conducteurs gabonais. 100% gratuit.',

  // === KEYWORDS ===
  keywords: [
    'Waze Gabon', 'Waze Gabon Club', 'Waze Libreville',
    'GPS Gabon', 'navigation Gabon', 'GPS gratuit Gabon', 'itineraire Gabon',
    'application GPS Gabon', 'meilleur GPS Gabon',
    'trafic Libreville', 'embouteillage Libreville', 'circulation Gabon',
    'bouchon Libreville', 'etat des routes Gabon', 'trafic Gabon',
    'embouteillage Gabon', 'circulation Libreville',
    'trafic Port-Gentil', 'trafic Franceville', 'trafic Oyem',
    'route Libreville Port-Gentil', 'route nationale Gabon',
    'signalement routier Gabon', 'alerte police Gabon', 'radar Gabon',
    'station service Gabon', 'prix carburant Gabon',
    'carte routiere Gabon', 'plan Libreville',
    'communaute conducteurs Gabon', 'groupe Waze Gabon',
    'waze community gabon', 'waze africa',
    'tutoriel Waze', 'comment utiliser Waze', 'installer Waze',
    'Waze CarPlay', 'Waze Android Auto',
  ],

  // === AUTHORS ===
  authors: [{ name: 'Waze Gabon Club', url: 'https://wazegabon.com' }],
  creator: 'Waze Gabon Club',
  publisher: 'Waze Gabon Club',

  // === FORMAT ===
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // === OPEN GRAPH ===
  openGraph: {
    title: 'Waze Gabon Club #1 — Conduisez plus malin au Gabon',
    description: 'La 1ere communaute Waze du Gabon. Tutoriels, alertes trafic en temps reel, signalements routiers et entraide entre conducteurs. Rejoignez-nous gratuitement !',
    url: 'https://wazegabon.com',
    siteName: 'Waze Gabon Club',
    locale: 'fr_GA',
    alternateLocale: ['fr_FR', 'en_US'],
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Waze Gabon Club — La 1ere communaute Waze du Gabon',
        type: 'image/png',
      },
    ],
  },

  // === TWITTER ===
  twitter: {
    card: 'summary_large_image',
    title: 'Waze Gabon Club #1 — Conduisez plus malin au Gabon',
    description: 'La 1ere communaute Waze du Gabon. Tutoriels, alertes trafic et communaute de conducteurs.',
    images: ['/twitter-image'],
    creator: '@WazeGabonClub',
  },

  // === ROBOTS ===
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // === CANONICAL ===
  alternates: {
    canonical: 'https://wazegabon.com',
  },

  // === PWA ===
  manifest: '/manifest.json',

  // === ICONS ===
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },

  // === AUTRES ===
  category: 'technology',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#009E49' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1628' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// === JSON-LD ===
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Waze Gabon Club',
  alternateName: 'Waze Gabon Club #1',
  url: 'https://wazegabon.com',
  description: 'La premiere communaute Waze du Gabon. Tutoriels, alertes trafic, signalements routiers et entraide entre conducteurs gabonais.',
  inLanguage: ['fr', 'en'],
  publisher: {
    '@type': 'Organization',
    name: 'Waze Gabon Club',
    url: 'https://wazegabon.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://wazegabon.com/logo.png',
      width: 800,
      height: 800,
    },
    sameAs: [
      'https://www.facebook.com/WazeGabonClub',
      'https://chat.whatsapp.com/CxqQfJ2DI8rJFGRx583YS5',
      'https://t.me/+terR7LTLdk9jMDk0',
    ],
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://wazegabon.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Waze est-il gratuit au Gabon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, Waze est 100% gratuit. Seuls les frais de donnees mobiles s'appliquent (Airtel, Moov Africa). Comptez 10-30 Mo par heure de navigation.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment fonctionne Waze au Gabon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Waze fonctionne partout ou vous avez du GPS et du reseau mobile (3G/4G/5G). Plus les utilisateurs sont nombreux, plus les informations trafic sont precises et fiables.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment signaler un embouteillage sur Waze ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Pendant la navigation, appuyez sur le bouton orange en bas a droite, puis selectionnez \"Trafic\". Vous pouvez preciser l'intensite (modere, dense, arrete).",
      },
    },
    {
      '@type': 'Question',
      name: 'Waze fonctionne-t-il hors connexion ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Waze necessite internet pour calculer les itineraires. Cependant, si vous perdez la connexion en route, la navigation continue avec les donnees deja chargees.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment devenir editeur de carte Waze au Gabon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Utilisez Waze normalement, puis allez sur waze.com/editor depuis un ordinateur. Vous pourrez ajouter des routes manquantes et corriger les adresses au Gabon.",
      },
    },
    {
      '@type': 'Question',
      name: 'Le prix du carburant est-il utile sur Waze au Gabon ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Au Gabon, les prix du carburant sont fixes par l'Etat et identiques partout. Waze reste tres utile pour localiser les stations-service les plus proches sur votre trajet.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment installer Waze sur CarPlay ou Android Auto ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Connectez votre telephone en USB ou Bluetooth. Waze apparait automatiquement sur l'ecran de votre voiture si CarPlay ou Android Auto est active.",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="geo.region" content="GA" />
        <meta name="geo.placename" content="Gabon" />
        <meta name="geo.position" content="0.3924;9.4536" />
        <meta name="ICBM" content="0.3924, 9.4536" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
