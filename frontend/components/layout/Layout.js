// components/layout/Layout.js
'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Don't show header/footer for admin routes
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Show header/footer for all other routes
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}