'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppContext } from '@/src/context/AppContext';

export default function AdminLoginForm() {
  const [context, setContext] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  // Get context only on client after mount
  const contextValue = useContext(AppContext);
  useEffect(() => {
    setContext(contextValue);
  }, [contextValue]);

  useEffect(() => {
    if (context?.session?.isAdmin) {
      router.push('/admin');
    }
  }, [context?.session?.isAdmin, router, context]);

  const handleLogin = () => {
    if (!context) return;
    if (!password) {
      setError('Please enter the admin password.');
      setShowError(true);
      return;
    }

    if (context.adminLogin(password)) {
      context.showToast('Admin login successful!', 'success');
      router.push('/admin');
    } else {
      setError('Invalid admin password.');
      setShowError(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '48px', borderRadius: '20px', background: 'rgba(10, 4, 20, 0.92)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(25px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🔐</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '6px' }}>Admin Access</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Enter admin password</p>
        </div>

        {showError && (
          <div style={{ background: 'rgba(245, 176, 65, 0.15)', border: '1px solid rgba(245, 176, 65, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#f5b041', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #f5b041, #e8a020)', border: 'none', color: '#000', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
        >
          Login
        </button>

        <Link href="/login" style={{ display: 'block', textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#f5b041', textDecoration: 'none' }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
