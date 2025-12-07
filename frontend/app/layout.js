// app/layout.js
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { CheckoutProvider } from '../contexts/CheckoutContext';
import Layout from '../components/layout/Layout';
import './globals.css';

export const metadata = {
  title: 'WoodWorks - Premium Wood & Craftsmanship',
  description: 'Discover the finest selection of hardwoods, live edge slabs, and exotic woods',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <CheckoutProvider>
            <Layout>{children}</Layout>
            </CheckoutProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}