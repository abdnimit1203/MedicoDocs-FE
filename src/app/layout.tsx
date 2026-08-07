import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedicoDocs by AB',
  description: 'Lightweight mobile-first personal & family medical document manager',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0284c7',
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
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-sky-500 selection:text-white">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '0.75rem',
              border: '1px solid #334155',
              fontSize: '0.875rem',
            },
          }}
        />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
