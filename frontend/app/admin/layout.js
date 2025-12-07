// app/admin/layout.js
import { AuthProvider } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminRootLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AuthProvider>
  );
}