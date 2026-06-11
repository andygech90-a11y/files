import { useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export default function BottomTabs() {
  const { session } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    const path = pathname;
    if (path === '/') return 'home';
    if (path.includes('/reviews')) return 'reviews';
    if (path.includes('/events')) return 'events';
    if (path.includes('/video')) return 'video';
    if (path.includes('/me')) return 'me';
    return null;
  };

  const activeTab = getActiveTab();

  const handleClick = (tab) => {
    if ((tab === 'me' || tab === 'events') && !session) {
      router.push('/login');
      return;
    }

    if (tab === 'me') {
      router.push('/me');
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
      borderRadius: '30px',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.6)', padding: '6px 8px',
      paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))'
    }}>
      {[
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'reviews', label: 'Reviews', icon: '⭐' },
        { id: 'events', label: 'Events', icon: '🎉' },
        { id: 'video', label: 'Video', icon: '🎥' },
        { id: 'me', label: 'Me', icon: '👤' },
      ].map(tab => (
        <button key={tab.id} onClick={() => handleClick(tab.id)} style={{
          flex: 1, padding: '10px 4px 8px', border: 'none', background: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
          color: activeTab === tab.id ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.85)', fontSize: '0.65rem', fontWeight: activeTab === tab.id ? 600 : 500, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', borderRadius: '16px', transition: 'all 0.2s ease'
        }}>
          <span style={{ fontSize: '1.15rem' }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
