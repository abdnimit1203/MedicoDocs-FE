import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedicoDocs by AB',
  description: 'Lightweight mobile-first personal & family medical document manager',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        <AuthProvider>
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
