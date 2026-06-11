'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/src/context/AppContext';

export default function Nav() {
  const { session, logout, db, showToast } = useContext(AppContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    if (showToast) showToast('Logged out', 'info');
    router.push('/');
  };

  const balance = session && db?.users[session.username]
    ? (db.users[session.username].balance || 0).toFixed(5)
    : '0.00000';

  return (
    <nav style={navStyles.container}>
      <Link href="/" style={navStyles.logo}>💗 Sincere Love Club</Link>
      <div style={navStyles.links}>
        {session ? (
          <>
            <span style={navStyles.balancePill}>₿ {balance}</span>
            <Link href="/events" style={navStyles.navBtn}>Events</Link>
            <Link href="/me" style={navStyles.navBtn}>Profile</Link>
            <button onClick={handleLogout} style={{ ...navStyles.navBtn, background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/" style={navStyles.navBtn}>← Home</Link>
            <Link href="/register" style={{ ...navStyles.navBtn, ...navStyles.primary }}>Join Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navStyles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    padding: '20px 48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(8, 3, 18, 0.85)',
    backdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  logo: {
    fontSize: '1.2rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #f5b041, #e8a020)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  navBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(245, 176, 65, 0.3)',
    background: 'transparent',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.25s',
  },
  primary: {
    background: 'linear-gradient(135deg, #f5b041, #e8a020)',
    border: 'none',
    color: '#000',
  },
  balancePill: {
    padding: '8px 16px',
    borderRadius: '50px',
    background: 'rgba(245, 176, 65, 0.1)',
    border: '1px solid rgba(245, 176, 65, 0.3)',
    color: '#f5b041',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
};
