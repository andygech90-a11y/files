"use client";

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from '@/src/context/AppContext';

export default function BottomTabs() {
  const { session, showToast } = useContext(AppContext);
  const router = useRouter();

  const handleClick = (tab) => {
    if ((tab === 'me' || tab === 'events') && !session) {
      if (showToast) showToast('Please sign in to access this section', 'info');
      router.push('/login');
      return;
    }

    if (tab === 'home') {
      router.push('/');
    } else if (tab === 'reviews') {
      router.push('/reviews');
    } else if (tab === 'events') {
      router.push('/events');
    } else if (tab === 'video') {
      router.push('/video');
    } else if (tab === 'me') {
      router.push('/me');
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: '398px',
      background: 'rgba(20, 20, 25, 0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '30px', display: 'flex', justifyContent: 'space-around', zIndex: 2000,
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)', padding: '6px 8px'
    }}>
      {[
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'reviews', label: 'Reviews', icon: '⭐' },
        { id: 'events', label: 'Events', icon: '🎉' },
        { id: 'video', label: 'Video', icon: '🎥' },
        { id: 'me', label: 'Me', icon: '👤' },
      ].map(tab => (
        <button key={tab.id} onClick={() => handleClick(tab.id)} style={{
          flex: 1, padding: '10px 4px 8px', border: 'none', background: 'transparent', color: '#fff',
          fontSize: '0.65rem', fontWeight: 500, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.15rem' }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
