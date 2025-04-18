import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import RootProviders from '@/components/providers/RootProviders';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Track my Cash',
  description: 'Manage your expenses',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Toaster richColors position="bottom-right" />
          <RootProviders>
            <div className="flex-1">{children}</div>
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
