import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Aliso Viejo Apartment & OC Commute Finder — 92656 Rental Intelligence',
  description:
    'Search apartments in Greater Lansing and East Lansing, MI with traffic-aware drive times to 241 East Saginaw, East Lansing, pet policies, and garage parking details.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full overflow-x-hidden">
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[#faf8f5] text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
