import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Profile() {
  const { logout } = useContext(AppContext);
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Withdraw', icon: '💰' },
    { label: 'Wallet Management', icon: '💳' },
    { label: 'Withdraw Record', icon: '📋' },
    { label: 'Recharge Record', icon: '🔄' },
    { label: 'Order Record', icon: '📦' },
    { label: 'System Notifications', icon: '📧' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a1a', color: '#fff', paddingTop: '10px', paddingBottom: '70px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)', padding: '16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Personal Center</span>
          <span style={{ fontSize: '1rem' }}>🔒</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        
        {/* User Card */}
        <div style={{ background: 'linear-gradient(135deg, #d4a574 0%, #c68964 100%)', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b9d 0%, #c76e8e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
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
        <div style={{ background: '#2a2a2a', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>Points</div>
            <div style={{ fontSize: '1.1rem', color: '#f5b041', fontWeight: 600 }}>{(user.balance * 100).toFixed(0)}</div>
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
        <div style={{ background: '#2a2a2a', borderRadius: '10px', overflow: 'hidden' }}>
          {menuItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: idx < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              </div>
              <span style={{ fontSize: '0.9rem', color: '#aaa' }}>›</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #d4a574 0%, #c68964 100%)', color: '#000', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          Logout
        </button>
      </div>

      {/* Bottom Navigation */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', maxWidth: '430px', background: 'rgba(26,26,26,0.98)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '6px 0', height: '60px' }}>
        {[
          { label: 'Home', icon: '🏠', route: '/' },
          { label: 'Reviews', icon: '⭐', route: '/reviews' },
          { label: 'Events', icon: '💝', route: '/events' },
          { label: 'Video', icon: '🎥', route: '/video' },
          { label: 'Me', icon: '👤', route: '/profile' },
        ].map((item) => (
          <button key={item.label} onClick={() => navigate(item.route)} style={{ background: 'none', border: 'none', color: item.route === '/profile' ? '#f5b041' : 'rgba(255,255,255,0.5)', cursor: 'pointer', textAlign: 'center', flex: 1, padding: '4px', fontSize: '0.65rem', fontWeight: 500, transition: 'color 0.3s ease' }} onMouseEnter={(e) => { if (item.route !== '/profile') e.currentTarget.style.color = '#f5b041'; }} onMouseLeave={(e) => { if (item.route !== '/profile') e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{item.icon}</div>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
