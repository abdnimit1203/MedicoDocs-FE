import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const SITE_URL = 'https://medicodocs-ab.vercel.app';
const SITE_DESCRIPTION =
  'Scan prescriptions & test reports with Gemini AI, keep structured medicine records, and ask an AI assistant grounded only in your own data.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'MedicoDocs by AB',
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/logo.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'MedicoDocs — Every prescription, one private history.',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'MedicoDocs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MedicoDocs — AI-powered prescription vault',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedicoDocs — Every prescription, one private history.',
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#8F1D2C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#F8F9F7] text-[#17201D] antialiased selection:bg-[#F8E9EC] selection:text-[#8F1D2C]"
        suppressHydrationWarning
      >
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#FFFFFF',
                color: '#17201D',
                borderRadius: '0.75rem',
                border: '1px solid #E2E8F0',
                fontSize: '0.875rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
