import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Nav from '../components/Nav';

export default function AdminLogin() {
  const {  showToast } = useContext(AppContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);




  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div>
      <style>{`
        .bg-photo {
          position:fixed;inset:0;z-index:0;
          background:url('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&q=85&fit=crop') center/cover no-repeat;
        }
        .bg-photo::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(5,0,15,.92) 0%,rgba(80,0,40,.75) 100%);
        }
      `}</style>

      <div className="bg-photo"></div>
      <Nav />

      {/* Banner */}
      <div style={{ position: 'relative', zIndex: 50, padding: '12px 20px', background: 'linear-gradient(135deg, rgba(245, 176, 65, 0.95), rgba(232, 160, 32, 0.95))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#000', fontSize: '0.9rem', fontWeight: 600 }}>
        🔐 Secure admin access — manage your platform
      </div>

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
        <div style={{ width: '100%', maxWidth: '460px', padding: '52px 48px', borderRadius: '20px', background: 'rgba(10, 4, 20, 0.92)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(30px)', boxShadow: '0 25px 60px rgba(0,0,0,0.4), inset 0 0 30px rgba(176,78,255,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🔐</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 600, marginBottom: '6px' }}>Admin Access</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem' }}>Enter your admin credentials</p>
          </div>

          {showError && (
            <div style={{ background: 'rgba(245, 176, 65, 0.15)', border: '1px solid rgba(245, 176, 65, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#f5b041', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #f5b041, #e8a020)', border: 'none', color: '#000', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}
          >
            Access Admin Panel 🔐
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            <Link to="/login" style={{ color: '#f5b041', fontWeight: 600, textDecoration: 'none' }}>User Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
