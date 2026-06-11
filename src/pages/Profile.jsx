import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

const profileStyles = `
  @media (max-width: 768px) {
    .profile-container { padding: 12px !important; }
    .profile-header { padding: 12px !important; }
    .profile-header span:first-child { font-size: 0.9rem !important; }
    .user-card { padding: 12px !important; gap: 10px !important; }
    .user-card-avatar { width: 48px !important; height: 48px !important; font-size: 1.2rem !important; }
    .stats-grid { gap: 8px !important; padding: 10px !important; }
    .stats-grid > div { gap: 4px !important; }
    .stats-grid > div:first-child { font-size: 0.7rem !important; }
    .stats-grid > div:nth-child(2) { font-size: 1rem !important; }
    .menu-item { padding: 10px !important; font-size: 0.9rem !important; }
    .menu-icon { width: 32px !important; font-size: 1.2rem !important; }
    .logout-btn { padding: 12px 16px !important; font-size: 0.9rem !important; width: 100%; }
  }
  @media (max-width: 480px) {
    .profile-container { padding: 10px !important; }
    .profile-header { padding: 10px !important; }
    .profile-header span:first-child { font-size: 0.85rem !important; }
    .user-card { padding: 10px !important; }
    .user-card-avatar { width: 44px !important; height: 44px !important; font-size: 1.1rem !important; }
    .stats-grid { padding: 8px !important; }
    .stats-grid > div:first-child { font-size: 0.65rem !important; }
    .stats-grid > div:nth-child(2) { font-size: 0.95rem !important; }
    .menu-item { padding: 8px !important; font-size: 0.85rem !important; }
    .menu-icon { width: 28px !important; font-size: 1.1rem !important; }
  }
`;

export default function Profile() {
  const context = useContext(AppContext);
  
  if (!context) {
    return null;
  }

  const { logout, session, db } = context;
  const router = useRouter();

  const user = session && db ? db.users[session.username] : null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleMenuItemClick = (label) => {
    switch (label) {
      case 'Withdraw':
        router.push('/withdraw');
        break;
      case 'Wallet Management':
        router.push('/wallet');
        break;
      case 'Withdraw Record':
        router.push('/withdraw-record');
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { label: 'Withdraw', icon: '💰', action: () => handleMenuItemClick('Withdraw') },
    { label: 'Wallet Management', icon: '💳', action: () => handleMenuItemClick('Wallet Management') },
    { label: 'Withdraw Record', icon: '📋', action: () => handleMenuItemClick('Withdraw Record') },
    { label: 'Recharge Record', icon: '🔄', action: () => {} },
    { label: 'Order Record', icon: '📦', action: () => {} },
    { label: 'System Notifications', icon: '📧', action: () => {} },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container" style={{ width: '100%', height: '100%', background: '#1a1a1a', color: '#fff', paddingTop: '10px', paddingBottom: '70px', overflowY: 'auto', padding: '16px' }}>
      <style>{profileStyles}</style>
      
      {/* Header */}
      <div className="profile-header" style={{ background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)', padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Personal Center</span>
          <span style={{ fontSize: '1rem' }}>🔒</span>
        </div>
      </div>

      {/* User Card */}
      <div className="user-card" style={{ background: 'linear-gradient(135deg, #d4a574 0%, #c68964 100%)', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div className="user-card-avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b9d 0%, #c76e8e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#000' }}>{user.username}</span>
            <span style={{ fontSize: '0.9rem', cursor: 'pointer' }}>✏️</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ background: '#2a2a2a', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>Balance</div>
          <div style={{ fontSize: '1.1rem', color: '#f5b041', fontWeight: 600 }}>{user.balance.toFixed(4)} BTC</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>Credit Score</div>
          <div style={{ fontSize: '1.1rem', color: '#f5b041', fontWeight: 600 }}>0</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>Video Views</div>
          <div style={{ fontSize: '1.1rem', color: '#f5b041', fontWeight: 600 }}>0</div>
        </div>
      </div>

      {/* VIP Membership */}
      <div style={{ background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px' }}>Join Exclusive Membership</div>
          <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Single Payment, Lifetime Access</div>
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, background: 'linear-gradient(135deg, #f5b041 0%, #e8935a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VIP</div>
      </div>

      {/* Menu Items */}
      <div style={{ background: '#2a2a2a', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
        {menuItems.map((item, idx) => (
          <div key={idx} className="menu-item" onClick={item.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: idx < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: '0.9rem', color: '#aaa' }}>›</span>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-btn" style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #d4a574 0%, #c68964 100%)', color: '#000', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
        Logout
      </button>
      
      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', maxWidth: '430px', background: 'rgba(26,26,26,0.98)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0', height: '60px' }}>
        {[
          { label: 'Home', icon: '🏠', route: '/' },
          { label: 'Reviews', icon: '⭐', route: '/reviews' },
          { label: 'Events', icon: '💝', route: '/events' },
          { label: 'Video', icon: '🎥', route: '/video' },
          { label: 'Me', icon: '👤', route: '/me' },
        ].map((item) => (
          <button key={item.label} onClick={() => router.push(item.route)} style={{ background: 'none', border: 'none', color: item.route === '/me' ? '#f5b041' : 'rgba(255,255,255,0.5)', cursor: 'pointer', textAlign: 'center', flex: 1, padding: '4px', fontSize: '0.65rem', fontWeight: 500, transition: 'color 0.3s ease' }} onMouseEnter={(e) => { if (item.route !== '/me') e.currentTarget.style.color = '#f5b041'; }} onMouseLeave={(e) => { if (item.route !== '/me') e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{item.icon}</div>
            {item.label}
          </button>
        ))}
      </div>
      
    </div>
  );
}