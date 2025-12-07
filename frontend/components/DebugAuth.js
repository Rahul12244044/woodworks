// components/DebugAuth.js
'use client';

import { useAuth } from '../contexts/AuthContext';

export default function DebugAuth() {
  const { user, loading } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded-lg z-50 max-w-md">
      <h3 className="font-bold text-yellow-800">Auth Debug</h3>
      <div className="text-xs text-yellow-700 mt-2">
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>User: {user ? user.username : 'null'}</p>
        <p>Role: {user ? user.role : 'null'}</p>
        <p>ID: {user ? user._id : 'null'}</p>
        <p>Token: {localStorage.getItem('token') ? 'Exists' : 'None'}</p>
      </div>
    </div>
  );
}