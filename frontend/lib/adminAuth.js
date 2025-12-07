// lib/adminAuth.js (Server-side only)
export function validateAdminCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    console.error('❌ Admin credentials not configured in environment variables');
    return false;
  }
  
  return email === adminEmail && password === adminPassword;
}

export function getAdminUser() {
  return {
    _id: 'admin-user',
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@woodworks.com',
    role: 'admin'
  };
}