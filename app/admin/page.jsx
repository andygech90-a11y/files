'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export const dynamic = 'force-dynamic';

export default function AdminPanelPage() {
  const [mounted, setMounted] = useState(false);
  const context = useContext(AppContext);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !context?.session?.isAdmin) {
      router.push('/admin-login');
    }
  }, [mounted, context?.session, router]);

  if (typeof window === 'undefined' || !mounted || !context) {
    return null;
  }

  const { session, db } = context;

  if (!session?.isAdmin) return null;

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>Admin Panel</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Total Users</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f5b041' }}>{db?.users ? Object.keys(db.users).length : 0}</div>
        </div>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Transactions</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f5b041' }}>{db?.transactions?.length || 0}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Admin BTC Address</h2>
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
          {db?.adminBTC}
        </div>
      </div>
    </div>
  );
}
