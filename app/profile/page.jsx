'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const context = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !context?.session) {
      router.push('/login');
    }
  }, [mounted, context?.session, router]);

  if (typeof window === 'undefined' || !mounted || !context) {
    return null;
  }

  const { session } = context;

  if (!session) {
    return null;
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>User Profile</h1>
      
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
        <p style={{ marginBottom: '16px' }}>
          <strong>Username:</strong> {session.username}
        </p>
        <p>
          <strong>Role:</strong> {session.isAdmin ? 'Admin' : 'User'}
        </p>
      </div>
    </div>
  );
}
