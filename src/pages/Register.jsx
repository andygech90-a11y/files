import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppContext } from '../context/AppContext';
import Nav from '../components/Nav';
import BottomTabs from '../components/BottomTabs';

export default function Register() {
  const context = useContext(AppContext);
  
  if (!context) {
    return null;
  }

  const { register, showToast } = context;
  const router = useRouter();
  const [formData, setFormData] = useState({
    uname: '', pass: '', refcode: ''
  });
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const { uname, pass, refcode } = formData;

    if (!uname || !pass || !refcode) {
      setError('Please fill in all fields.');
      setShowError(true);
      return;
    }

    if (pass.length < 6) {
      setError('Password must be at least 6 characters.');
      setShowError(true);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(uname.toLowerCase())) {
      setError('Username: letters, numbers, underscores only.');
      setShowError(true);
      return;
    }

    const normalizedUsername = uname.toLowerCase();
    const success = await register(normalizedUsername, pass, refcode.toUpperCase());

    if (success) {
      showToast('✅ Account created successfully! Please log in.', 'success');
      router.push('/login');
    } else {
      setError('Registration failed. Check your username or referral code.');
      setShowError(true);
    }
  };

  return (
    <div>
      <style>{`
        .bg-photo {
          position:fixed;inset:0;z-index:0;
          background:url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1920&q=85&fit=crop') center/cover no-repeat;
        }
        .bg-photo::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(5,0,15,.9) 0%,rgba(50,0,80,.75) 100%);
        }
      `}</style>

      <div className="bg-photo"></div>
      <Nav />

      {/* Banner */}
      <div style={{ position: 'relative', zIndex: 50, padding: '12px 20px', background: 'linear-gradient(135deg, rgba(245, 176, 65, 0.95), rgba(232, 160, 32, 0.95))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#000', fontSize: '0.9rem', fontWeight: 600 }}>
        ✨ Join 100,000+ members finding love today!
      </div>

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>
        <div style={{ width: '100%', maxWidth: '500px', padding: '48px', borderRadius: '20px', background: 'rgba(10, 4, 20, 0.92)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(25px)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>✨</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 600, marginBottom: '6px' }}>Join LoveConnect</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Create your free account today — a referral code is required</p>
          </div>

          {showError && (
            <div style={{ background: 'rgba(245, 176, 65, 0.15)', border: '1px solid rgba(245, 176, 65, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#f5b041', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}



          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Username</label>
            <input type="text" name="uname" value={formData.uname} onChange={handleChange} placeholder="Choose a username (no spaces)" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
            <input type="password" name="pass" value={formData.pass} onChange={handleChange} placeholder="Min 6 characters" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
              Referral Code <span style={{ color: '#f5b041' }}>*Required</span>
            </label>
            <input type="text" name="refcode" value={formData.refcode} onChange={handleChange} placeholder="e.g. LOVE2024" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none', textTransform: 'uppercase' }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>💡 Ask a member for their referral code to join.</div>
          </div>

          <button
            onClick={handleRegister}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #f5b041, #e8a020)', border: 'none', color: '#000', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', marginBottom: '20px' }}
          >
            Create Account 💗
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            Already have an account? <Link to="/login" style={{ color: '#f5b041', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// show bottom tabs on the register page
export function RegisterWithTabs(props) {
  return (
    <>
      <Register {...props} />
      <BottomTabs />
    </>
  );
}
