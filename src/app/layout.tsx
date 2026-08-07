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
