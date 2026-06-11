import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Login from './Login';
import BottomTabs from '../components/BottomTabs';
import { AppContext } from '../context/AppContext';
import imageHero from '../assets/image.png';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import tinderLogo from '../assets/tinder.png';
import bumbleLogo from '../assets/bumble.png';
import badooLogo from '../assets/badoo.png';
import hingeLogo from '../assets/hinge.png';


export default function Home({ initialTab = 'home' }) {
  const context = useContext(AppContext);
  
  if (!context) {
    return null;
  }

  const { session, WOMEN, TESTIMONIALS, db, logout, fetchUserBalance, requestWithdrawal, saveWalletAddress, userBalance, showToast, markNotificationRead } = context;
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [marqueeOffset, setMarqueeOffset] = useState(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const path = pathname.replace(/\/$/, '');
    if (path === '/reviews') {
      setActiveTab('reviews');
    } else if (path === '/events') {
      setActiveTab('events');
    } else if (path === '/video') {
      setActiveTab('video');
    } else if (path === '/me') {
      setActiveTab('me');
    } else {
      setActiveTab('home');
    }
  }, [pathname]);

  const marqueeRef = useRef(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const menuItems = [
    { id: 'Withdraw', label: 'Withdraw', icon: '💰' },
    { id: 'wallet', label: 'Wallet Management', icon: '💳' },
    { id: 'withdraw-record', label: 'Withdraw Record', icon: '📋' },
    { id: 'recharge-record', label: 'Recharge Record', icon: '🔄' },
    { id: 'order-record', label: 'Order Record', icon: '📦' },
    { id: 'notifications', label: 'System Notifications', icon: '📧' },
  ];
  const notifications = session && db?.notifications?.[session.username]
    ? db.notifications[session.username]
    : [];
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  useEffect(() => {
    if (selectedMenuItem !== 'notifications' || !session || !notifications.length) return;
    notifications.forEach((notification) => {
      if (!notification.read) {
        markNotificationRead(session.username, notification.id);
      }
    });
  }, [selectedMenuItem, session, notifications, markNotificationRead]);

  const handleLogout = () => {
    logout();
    setShowLogin(false);
  };

  useEffect(() => {
    if (session) setShowLogin(false);
  }, [session]);

  const user = session && db ? db.users[session.username] : null;

  // Generate stable random values for women cards
  const womenCardData = useMemo(() => WOMEN.map((woman, i) => ({
    vipId: 10000 + i * 7777,
    rating: (9.7 + (i % 3) * 0.1).toFixed(1),
    viewers: 100 + i * 37,
  })), [WOMEN]);

  // Carousel slides
  const SLIDES = [
    { img: image1.src || image1, title: 'Find Your Perfect Match', subtitle: 'Join 100,000+ verified members worldwide', badge: '💎 VIP EXCLUSIVE' },
    { img: image2.src || image2, title: 'Premium Dating Experience', subtitle: 'Verified profiles · Real connections', badge: '🔥 TRENDING' },
    { img: image3.src || image3, title: 'Love Starts Here', subtitle: 'Exclusive matches curated just for you', badge: '✨ NEW' },
    { img: imageHero.src || imageHero, title: 'Sincere Love Club', subtitle: 'Find genuine connections today', badge: '💕 FEATURED' },
  ];

  // Auto-slide carousel
  useEffect(() => {
    if (activeTab !== 'home') return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeTab, SLIDES.length]);

  // Marquee animation
  useEffect(() => {
    const timer = setInterval(() => {
      setMarqueeOffset(prev => prev - 1);
    }, 30);
    return () => clearInterval(timer);
  }, []);



  const VIDEOS = [
    { name: 'Sophia', thumb: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop', viewers: 1243, live: true },
    { name: 'Isabella', thumb: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop', viewers: 876, live: true },
    { name: 'Amara', thumb: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop', viewers: 2104, live: false },
    { name: 'Valentina', thumb: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop', viewers: 543, live: true },
    { name: 'Natasha', thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop', viewers: 1567, live: false },
    { name: 'Elena', thumb: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=500&fit=crop', viewers: 932, live: true },
    { name: 'Priya', thumb: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', viewers: 410, live: false },
    { name: 'Aiko', thumb: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop', viewers: 1890, live: true },
    { name: 'Layla', thumb: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=500&fit=crop', viewers: 723, live: true },
  ];

  const [selectedGift, setSelectedGift] = useState(null);
  const [giftPoints, setGiftPoints] = useState(0);
  const [countdownTime, setCountdownTime] = useState(144); // 02:24 in seconds (144 seconds)

  // Countdown timer for events page - continues even when switching tabs
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 1) {
          return 144; // Reset to 02:24
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
const withdrawStyles = `
  @media (max-width: 768px) {
    .withdraw-header { padding: 12px 16px !important; }
    .withdraw-header span:nth-child(2) { font-size: 0.95rem !important; }
    .withdraw-content { padding: 16px !important; }
    .balance-card { padding: 16px !important; margin-bottom: 16px !important; }
    .balance-card > div:first-child { font-size: 0.85rem !important; }
    .balance-card > div:nth-child(2) { font-size: 1.6rem !important; }
    .form-card { padding: 16px !important; }
    .form-card h2 { font-size: 1rem !important; margin-bottom: 12px !important; }
    .form-group { margin-bottom: 12px !important; }
    .form-group label { font-size: 0.85rem !important; margin-bottom: 6px !important; }
    .form-group input { padding: 10px !important; font-size: 0.9rem !important; }
    .submit-btn { padding: 12px !important; font-size: 0.95rem !important; }
  }
  @media (max-width: 480px) {
    .withdraw-header { padding: 10px 12px !important; }
    .withdraw-header span { font-size: 1.2rem !important; }
    .withdraw-content { padding: 12px !important; }
    .balance-card { padding: 12px !important; margin-bottom: 12px !important; }
    .form-card { padding: 12px !important; }
    .form-group { margin-bottom: 10px !important; }
    .form-group label { font-size: 0.8rem !important; }
    .form-group input { padding: 8px !important; font-size: 0.85rem !important; }
    .submit-btn { padding: 10px !important; font-size: 0.9rem !important; }
  }
`;
  // Helper function to format seconds to MM:SS
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Global redirect removed so unauthenticated users can view Home, Events, etc.
  const gifts = [
    { id: 'tinder', name: 'Tinder', logo: tinderLogo, bgColor: '#e7165f' },
    { id: 'bumble', name: 'Bumble', logo: bumbleLogo, bgColor: '#ffc646' },
    { id: 'hinge', name: 'Hinge', logo: hingeLogo, bgColor: '#fff' },
    { id: 'badoo', name: 'Badoo', logo: badooLogo, bgColor: '#dd0000' },
  ];

  const handleSendGift = () => {
    if (selectedGift && giftPoints > 0) {
      alert(`Sending ${giftPoints} points via ${selectedGift.name}!`);
      setGiftPoints(0);
      setSelectedGift(null);
    }
  };

  const handleReset = () => {
    setGiftPoints(0);
    setSelectedGift(null);
  };


  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawType, setWithdrawType] = useState('BTC');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [walletAddresses, setWalletAddresses] = useState({ BTC: '', ETH: '' });
  const [editingWallet, setEditingWallet] = useState(null);
  const [tempWalletAddress, setTempWalletAddress] = useState('');

  // Fetch balance on mount and when user changes
  useEffect(() => {
    if (session && session.username) {
      fetchUserBalance(session.username);
    }
  }, [session, fetchUserBalance]);

  useEffect(() => {
    if (!session || !db) {
      setWalletAddresses({ BTC: '', ETH: '' });
      return;
    }

    const userWallets = db.users[session.username]?.wallets || {};
    setWalletAddresses({ BTC: userWallets.BTC || '', ETH: userWallets.ETH || '' });
  }, [session, db]);

  const handleWithdraw = async () => {
    if (!amount || amount <= 0) {
      showToast('Please enter valid amount', 'error');
      return;
    }

    if (!withdrawAddress || withdrawAddress.trim() === '') {
      showToast(`Please enter a valid ${withdrawType} address`, 'error');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      showToast('Invalid amount', 'error');
      return;
    }

    if (userBalance < withdrawAmount) {
      showToast(`Insufficient balance. You have ${userBalance} USDT`, 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await requestWithdrawal(session.username, withdrawAmount, withdrawType, withdrawAddress);
      if (result?.success) {
        setAmount('');
        setWithdrawAddress('');
        setTimeout(() => {
          router.push('/me');
        }, 1200);
      } else {
        showToast(result?.message || 'Failed to submit withdrawal request', 'error');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      showToast('Withdrawal failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = (type) => {
    if (!tempWalletAddress || tempWalletAddress.trim() === '') {
      showToast(`Please enter a valid ${type} address`, 'error');
      return;
    }

    if (!session?.username) {
      showToast('Please log in first to save wallet addresses.', 'error');
      return;
    }

    const success = saveWalletAddress(session.username, type, tempWalletAddress);
    if (success) {
      setWalletAddresses({
        ...walletAddresses,
        [type]: tempWalletAddress,
      });
      showToast(`✅ ${type} address saved successfully!`, 'success');
      setEditingWallet(null);
      setTempWalletAddress('');
    } else {
      showToast('Failed to save wallet address.', 'error');
    }
  };

  const handleEditWallet = (type) => {
    setEditingWallet(type);
    setTempWalletAddress(walletAddresses[type]);
  };

  const handleCancelEdit = () => {
    setEditingWallet(null);
    setTempWalletAddress('');
  };


  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: "'Jost', sans-serif", maxWidth: '100vw', overflow: 'hidden' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0a; }
        
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .card-hover:active {
          transform: scale(0.97);
        }
        .slide-enter {
          animation: slideUp 0.4s ease-out;
        }
        .marquee-text {
          white-space: nowrap;
          display: inline-block;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ===== HEADER ===== */}
      <div style={{
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>💗</span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, background: 'linear-gradient(135deg, #f5b041, #e8a020)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sincere Love</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>🔔</span>
            {unreadCount > 0 && (
              <div style={{ position: 'absolute', top: '-4px', right: '-6px', minWidth: '16px', height: '16px', borderRadius: '999px', background: '#ff4757', border: '2px solid #0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, padding: '0 4px' }}>
                {unreadCount}
              </div>
            )}
          </div>
          <div
            onClick={() => session ? (window.location.href = '/me') : setShowLogin(true)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f5b041, #e8a020)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
              border: '2px solid rgba(255,255,255,0.2)',
              color: '#000',
            }}
          >
            {session ? session.username.charAt(0).toUpperCase() : '👤'}
          </div>
        </div>
      </div>

      {/* ===== MARQUEE TICKER ===== */}
      <div style={{
        padding: '10px 0',
        background: 'linear-gradient(90deg, rgba(245, 176, 65, 0.15), rgba(232, 160, 32, 0.15), rgba(245, 176, 65, 0.15))',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div ref={marqueeRef} className="marquee-text" style={{
          transform: `translateX(${marqueeOffset % 1200}px)`,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.8)',
          fontWeight: 500,
        }}>
          🎉 Welcome to Sincere Love! &nbsp;•&nbsp; 100,000+ verified members &nbsp;•&nbsp; ✨ New matches every day &nbsp;•&nbsp; 💎 VIP plans available &nbsp;•&nbsp; 🌍 Members from 50+ countries &nbsp;•&nbsp; 🔒 100% secure platform &nbsp;•&nbsp; 💝 Real connections, real love &nbsp;•&nbsp; 🎉 Welcome to Sincere Love! &nbsp;•&nbsp; 100,000+ verified members &nbsp;•&nbsp; ✨ New matches every day &nbsp;•&nbsp;
        </div>
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div style={{ paddingBottom: '110px' }}>

        {showLogin && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
            <div style={{ width: '100%', maxWidth: '520px', margin: '20px', position: 'relative' }}>
              <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', right: 8, top: 8, zIndex: 2010, background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
              <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Login />
              </div>
            </div>
          </div>
        )}

        {/* ========== HOME TAB ========== */}
        {activeTab === 'home' && (
          <div className="slide-enter" style={{
            background: 'linear-gradient(180deg, #07040a 0%, #0b0710 100%)',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: '#efe6d6'
          }}>
            {/* Carousel */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                display: 'flex',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentSlide * 100}%)`,
              }}>
                {SLIDES.map((slide, i) => (
                  <div key={i} style={{ minWidth: '100%', position: 'relative', height: '240px' }}>
                    <img src={slide.img?.src || slide.img} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(10,5,15,0.98) 0%, rgba(10,5,15,0.4) 50%, rgba(10,5,15,0.1) 100%)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      padding: '24px 20px',
                    }}>
                      <div style={{ padding: '3px 10px', background: 'rgba(245,176,65,0.3)', color: '#f5b041', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, marginBottom: '8px', width: 'max-content', border: '1px solid rgba(245,176,65,0.4)', letterSpacing: '1px' }}>
                        {slide.badge}
                      </div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: 1.2 }}>{slide.title}</h2>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{slide.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Carousel dots */}
              <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
                {SLIDES.map((_, i) => (
                  <div key={i} onClick={() => setCurrentSlide(i)} style={{
                    width: currentSlide === i ? '20px' : '6px', height: '6px',
                    borderRadius: '3px',
                    background: currentSlide === i ? '#f5b041' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease', cursor: 'pointer',
                  }}></div>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-around', padding: '18px 16px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.08))', borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              {[
                { val: '100K+', label: 'Members', icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3z" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 20c0-2 3-3 6-3s6 1 6 3" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) },
                { val: '50+', label: 'Countries', icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12c0 4.971-4.029 9-9 9S3 16.971 3 12 7.029 3 12 3s9 4.029 9 9z" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12h20M12 2v20" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/></svg>
                ) },
                { val: '98%', label: 'Verified', icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.39 4.847L20 8.333l-4 3.9.944 5.5L12 16.9 7.056 17.1 8 11.6 4 7.7l5.61-.486L12 2z" stroke="#d4af37" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) },
                { val: '24/7', label: 'Support', icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2h-3l-3 3v-3H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9z" stroke="#d4af37" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#efe6d6' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.5px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Online Now - Horizontal scroll */}
            <div style={{ padding: '18px 0 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5b0', display: 'inline-block', animation: 'pulse-dot 1.5s ease infinite' }}></span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Online Now</h3>
                  <span style={{ fontSize: '0.7rem', color: '#00e5b0', fontWeight: 600, background: 'rgba(0,229,176,0.15)', padding: '2px 8px', borderRadius: '10px' }}>{WOMEN.length} online</span>
                </div>
              </div>
              <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 16px', scrollSnapType: 'x mandatory' }}>
                {WOMEN.slice(0, 8).map((woman, i) => (
                  <div
                    key={i}
                    className="card-hover"
                    style={{
                      minWidth: '120px', maxWidth: '120px',
                      borderRadius: '16px', overflow: 'hidden',
                      position: 'relative', cursor: 'pointer',
                      aspectRatio: '3/4',
                      scrollSnapAlign: 'start',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    }}
                  >
                    <img src={woman.img?.src || woman.img} alt={woman.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {/* Live badge */}
                    <div style={{
                        position: 'absolute', top: '8px', left: '8px',
                        padding: '4px 8px', borderRadius: '6px',
                        background: '#d4af37', color: '#0b0710',
                        fontSize: '0.62rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', gap: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0b0710' }}></span>
                        LIVE
                      </div>
                    {/* Verified */}
                    <div style={{
                      position: 'absolute', top: '6px', right: '6px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'rgba(0,229,176,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', color: '#fff',
                    }}>✓</div>
                    {/* Bottom info */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                      padding: '30px 8px 8px',
                    }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#efe6d6', marginBottom: '4px' }}>{woman.name.split(' ')[0]}</div>
                          <div style={{ fontSize: '0.62rem', color: 'rgba(255,230,200,0.8)', marginTop: '2px' }}>{woman.location || ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Companions - Grid */}
            <div style={{ padding: '16px 16px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#efe6d6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-4.35-9-7.2C-1 9.86 4.41 6 6.5 6c1.77 0 2.74 1.2 3.5 2.2.76-1 1.73-2.2 3.5-2.2C19.59 6 25 9.86 21 13.8 19 16.65 12 21 12 21z" fill="#d4af37"/></svg>
                  Featured Companions
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {WOMEN.map((woman, i) => (
                  <div
                    key={i}
                    className="card-hover"
                    style={{
                      borderRadius: '14px', overflow: 'hidden',
                      position: 'relative', cursor: 'pointer',
                      aspectRatio: '3/4',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    <img src={woman.img?.src || woman.img} alt={woman.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {/* Tag */}
                    <div style={{
                      position: 'absolute', top: '6px', right: '6px',
                      padding: '2px 6px', borderRadius: '4px',
                      background: woman.tag === 'VIP' ? 'rgba(176,78,255,0.9)' : woman.tag === 'Online' ? 'rgba(0,229,176,0.9)' : 'rgba(245,176,65,0.9)',
                      color: woman.tag === 'VIP' || woman.tag === 'Online' ? '#fff' : '#000', fontSize: '0.55rem', fontWeight: 800,
                      backdropFilter: 'blur(4px)',
                    }}>
                      {woman.tag}
                    </div>
                    {/* Bottom */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)',
                      padding: '24px 8px 8px',
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{woman.name}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>{woman.location || ''}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f5b041', marginBottom: '1px' }}>VIP{womenCardData[i].vipId}</div>
                      <div style={{
                        fontSize: '0.55rem', background: 'rgba(245,176,65,0.8)', color: '#000',
                        padding: '2px 6px', borderRadius: '3px', display: 'inline-block', fontWeight: 700,
                      }}>⭐ {womenCardData[i].rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill="#d4af37"/></svg>
                  ), label: 'Match', color: '#d4af37' },
                { icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 8h-3V6a3 3 0 0 0-6 0v2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM9 8V6a3 3 0 0 1 6 0v2H9z" fill="#d4af37"/></svg>
                  ), label: 'Gifts', color: '#d4af37' },
                { icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2 4 4 .5-2.5 2 0.5 4L12 11l-4 2 0.5-4L6 6.5 10 6 12 2z" fill="#b04eff"/></svg>
                  ), label: 'VIP', color: '#b04eff' },
                { icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9z" fill="#00e5b0"/></svg>
                  ), label: 'Chat', color: '#00e5b0' },
              ].map((action, i) => (
                <div key={i} onClick={() => !session && setShowLogin(true)} style={{
                  textAlign: 'center', padding: '14px 8px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))`,
                  border: `1px solid rgba(255,255,255,0.03)`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{action.icon}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{action.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ========== EVENTS TAB ========== */}
        {activeTab === 'events' && (
          <div className="slide-enter" style={{ padding: '24px 16px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Current period</h3>
                <a href="#" style={{ color: '#f5b041', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                  Gift History →
                </a>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px', background: 'linear-gradient(135deg, #f5b041, #e8a020)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1055098</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Sending Gift...</div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(245,176,65,0.1)',
                  border: '1px solid rgba(245,176,65,0.3)',
                  color: '#f5b041',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}>
                  {formatCountdown(countdownTime)}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>1055097 period</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffc646', color: '#000', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                  <img src={bumbleLogo.src || bumbleLogo} alt="Bumble" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                  Bumble
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dd0000', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                  <img src={badooLogo.src || badooLogo} alt="Badoo" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                  Badoo
                </span>
              </div>
            </div>

            {/* Select Gift Section */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '18px', background: 'linear-gradient(to bottom, #f5b041, #e8a020)', borderRadius: '2px' }}></div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Select Gift</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {gifts.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className="card-hover"
                    style={{
                      background: selectedGift?.id === gift.id ? 'rgba(245, 176, 65, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: selectedGift?.id === gift.id ? '1px solid #f5b041' : '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '16px',
                      padding: '24px 16px',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
                    }}
                  >
                    <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {typeof gift.logo === 'string' ? (
                        <span style={{ fontSize: '2.5rem' }}>{gift.logo}</span>
                      ) : (
                        <img src={gift.logo.src || gift.logo} alt={gift.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                      )}
                    </div>

                  </button>
                ))}
              </div>
            </div>

            {/* Selected Section */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '4px', height: '18px', background: 'linear-gradient(to bottom, #f5b041, #e8a020)', borderRadius: '2px' }}></div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Selected</h2>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '16px'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 600 }}>
                    Gift Points:
                  </div>
                  <input
                    type="number"
                    value={giftPoints}
                    onChange={(e) => setGiftPoints(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: '1.1rem',
                      outline: 'none',
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 600
                    }}
                  />
                </div>

                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 700,
                  color: giftPoints > 0 ? '#f5b041' : 'rgba(255,255,255,0.4)'
                }}>
                  Total Points: {giftPoints}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSendGift}
                  disabled={!selectedGift || giftPoints === 0}
                  style={{
                    flex: 1,
                    background: selectedGift && giftPoints > 0 ? 'linear-gradient(135deg, #f5b041, #e8a020)' : 'rgba(255,255,255,0.05)',
                    color: selectedGift && giftPoints > 0 ? '#000' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: selectedGift && giftPoints > 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedGift && giftPoints > 0 ? '0 8px 20px rgba(245,176,65,0.2)' : 'none'
                  }}
                >
                  Send Gift
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========== REVIEWS TAB ========== */}
        {activeTab === 'reviews' && (
          <div className="slide-enter" style={{ padding: '0' }}>
            {/* Header banner */}
            <div style={{
              padding: '24px 20px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(0,229,176,0.1), rgba(176,78,255,0.1))',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Member Reviews</h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Real stories from real members</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '10px' }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f5c842', fontSize: '1.1rem' }}>★</span>)}
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginLeft: '6px', fontWeight: 600 }}>4.9/5 ({TESTIMONIALS.length} reviews)</span>
              </div>
            </div>

            <div style={{ padding: '16px' }}>
              {TESTIMONIALS.map((review, i) => (
                <div key={i} className="card-hover" style={{
                  padding: '16px', marginBottom: '12px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img src={review.img} alt={review.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(245,176,65,0.4)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{review.name}</h4>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {[...Array(review.stars)].map((_, idx) => (
                            <span key={idx} style={{ color: '#f5c842', fontSize: '0.7rem' }}>★</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#00e5b0', fontWeight: 600 }}>📍 {review.loc}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, fontStyle: 'italic' }}>"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== VIDEO TAB ========== */}
        {activeTab === 'video' && (
          <div className="slide-enter">
            {/* Header */}
            <div style={{
              padding: '16px 16px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2px' }}>🎥 Live & Videos</h2>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Watch live streams & video profiles</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f5b041', animation: 'pulse-dot 1s ease infinite' }}></span>
                <span style={{ fontSize: '0.7rem', color: '#f5b041', fontWeight: 700 }}>LIVE</span>
              </div>
            </div>

            <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {VIDEOS.map((vid, i) => (
                <div key={i} className="card-hover" style={{
                  borderRadius: '14px', overflow: 'hidden',
                  position: 'relative', cursor: 'pointer',
                  aspectRatio: '3/4',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  background: `linear-gradient(135deg, ${['#f5b041', '#e8a020', '#b04eff'][i % 3]}, ${['#e8a020', '#b04eff', '#f5b041'][(i + 1) % 3]})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {/* Play button placeholder */}
                  <div style={{
                    fontSize: '3rem',
                    color: 'rgba(255,255,255,0.8)',
                    textShadow: '0 4px 8px rgba(0,0,0,0.4)',
                  }}>
                    ▶
                  </div>
                  
                  {/* Live / Recorded badge */}
                  {vid.live ? (
                    <div style={{
                      position: 'absolute', top: '6px', left: '6px',
                      padding: '2px 6px', borderRadius: '4px',
                      background: 'rgba(245,176,65,0.9)', color: '#000',
                      fontSize: '0.5rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fff', animation: 'pulse-dot 1s ease infinite' }}></span>
                      LIVE
                    </div>
                  ) : (
                    <div style={{
                      position: 'absolute', top: '6px', left: '6px',
                      padding: '2px 6px', borderRadius: '4px',
                      background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.5rem', fontWeight: 700,
                    }}>▶ VIDEO</div>
                  )}
                  {/* Viewers */}
                  <div style={{
                    position: 'absolute', top: '6px', right: '6px',
                    padding: '2px 6px', borderRadius: '4px',
                    background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.5rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}>👁 {vid.viewers}</div>
                  {/* Bottom */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                    padding: '20px 8px 8px',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>{vid.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== ME TAB ========== */}
        {activeTab === 'me'  &&(
          <div className="slide-enter" style={{ padding: '0', position: 'relative', top: 0}}>
            {/* Header banner */}
            <div style={{
              padding: '24px 20px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(176,78,255,0.1), rgba(245,176,65,0.1))',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👤</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Personal Center</h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Manage your account & settings</p>
            </div>

            <div style={{ padding: '24px 16px' }}>
              {/* User Card */}
              <div style={{ background: 'linear-gradient(135deg, rgba(245,176,65,0.15), rgba(232,160,32,0.15))', border: '1px solid rgba(245,176,65,0.2)', borderRadius: '14px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #f5b041 0%, #e8a020 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, color: '#000', fontWeight: 700 }}>
                  {user?.username?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{user?.username}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Member since {user?.joined}</p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Points</div>
                  <div style={{ fontSize: '1.2rem', color: '#f5b041', fontWeight: 700 }}>{user?.balance}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Credit Score</div>
                  <div style={{ fontSize: '1.2rem', color: '#f5b041', fontWeight: 700 }}>0</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Video Views</div>
                  <div style={{ fontSize: '1.2rem', color: '#f5b041', fontWeight: 700 }}>0</div>
                </div>
              </div>

              {/* VIP Membership */}
              <div style={{ background: 'linear-gradient(135deg, rgba(176,78,255,0.1), rgba(245,176,65,0.1))', border: '1px solid rgba(245,176,65,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Join Exclusive Membership</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Single Payment, Lifetime Access</div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(135deg, #f5b041 0%, #e8a020 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VIP</div>
              </div>

              {/* Menu Items */}
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '12px', marginTop: '16px' }}>QUICK ACTIONS</h3>
              <div style={{ background: '#2a2a2a', borderRadius: '12px', overflow: 'hidden' }}>
                {menuItems.map((item, idx) => (
                  <div key={item.id} onClick={() => setSelectedMenuItem(item.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: idx < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)' }}>›</span>
                  </div>
                ))}
              </div>

              {/* Logout Button */}
              <button onClick={handleLogout} style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* MENU ITEM MODAL */}
        {activeTab === 'me' && session && selectedMenuItem && (
  <div 
    className="new-page-slide"
    style={{ 
      position: 'absolute',
      top: 0,              
      left: 0,             
      width: '100%',
      height: '200%',
      background: '#1a1a1a', 
      color: '#fff', 
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}
  >
    {/* Embedded CSS Mobile Page Slide-Up Animation */}
    <style>{`
      @keyframes pageSlideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .new-page-slide {
        animation: pageSlideUp 0.28s cubic-bezier(0.32, 0.94, 0.6, 1) forwards;
      }
    `}</style>

    {/* Header */}
    <div style={{ background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <button onClick={() => setSelectedMenuItem(null)} style={{ background: 'none', border: 'none', color: '#f5b041', fontSize: '1.3rem', cursor: 'pointer', padding: '4px' }}>←</button>
      <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f5b041' }}>{menuItems.find(m => m.id === selectedMenuItem)?.label || 'Details'}</span>
      <span onClick={() => setSelectedMenuItem(null)} style={{ fontSize: '1.1rem', cursor: 'pointer', padding: '4px' }}>⌂</span>
    </div>

    {/* Scrollable Main Content Section */}
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '30px' }}>
      
      {/* Notifications Content */}
      {selectedMenuItem === 'notifications' && (
        <div style={{ padding: '0' }}>
          {notifications.length > 0 ? (
            <div style={{ padding: '16px' }}>
              {notifications.map((notif, idx) => (
                <div key={notif.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: idx < notifications.length - 1 ? '12px' : '0',
                  display: 'flex',
                  gap: '12px',
                }}>
                  <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{notif.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: '#fff' }}>{notif.title}</h4>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{notif.time}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🔔</div>
              <p style={{ fontSize: '1rem' }}>No notifications</p>
            </div>
          )}
        </div>
      )}

      {selectedMenuItem === 'settings' && (
        <div style={{ padding: '20px 16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Account Settings</h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Here you can manage your account settings. (This is a placeholder content for the settings page.)</p>
        </div>
      )}

      {selectedMenuItem === 'wallet' && (
        <div style={{ padding: '20px 16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>💳 Wallet Management</h3>
          
          {/* Bitcoin Wallet */}
          <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>₿ Bitcoin (BTC)</div>
              {editingWallet !== 'BTC' && (
                <button
                  onClick={() => handleEditWallet('BTC')}
                  style={{
                    background: '#f5b041',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {walletAddresses.BTC ? 'Edit' : 'Add'}
                </button>
              )}
            </div>
            
            {editingWallet === 'BTC' ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter your Bitcoin wallet address"
                  value={tempWalletAddress}
                  onChange={(e) => setTempWalletAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    marginBottom: '12px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleSaveWallet('BTC')}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f5b041, #e8a020)',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '6px',
                      color: '#000',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '10px',
                      borderRadius: '6px',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: walletAddresses.BTC ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }}>
                {walletAddresses.BTC ? (
                  <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>
                    {walletAddresses.BTC}
                  </div>
                ) : (
                  'No Bitcoin wallet address saved'
                )}
              </div>
            )}
          </div>

          {/* Ethereum Wallet */}
          <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Ξ Ethereum (ETH)</div>
              {editingWallet !== 'ETH' && (
                <button
                  onClick={() => handleEditWallet('ETH')}
                  style={{
                    background: '#f5b041',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    color: '#000',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {walletAddresses.ETH ? 'Edit' : 'Add'}
                </button>
              )}
            </div>
            
            {editingWallet === 'ETH' ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter your Ethereum wallet address"
                  value={tempWalletAddress}
                  onChange={(e) => setTempWalletAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    marginBottom: '12px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleSaveWallet('ETH')}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f5b041, #e8a020)',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '6px',
                      color: '#000',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '10px',
                      borderRadius: '6px',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: walletAddresses.ETH ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }}>
                {walletAddresses.ETH ? (
                  <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>
                    {walletAddresses.ETH}
                  </div>
                ) : (
                  'No Ethereum wallet address saved'
                )}
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(100,149,237,0.1)', border: '1px solid rgba(100,149,237,0.3)', borderRadius: '8px', padding: '12px' }}>
            💡 Save your wallet addresses here for quick access during withdrawal. Your addresses are stored locally on your device.
          </div>
        </div>
      )}

      {selectedMenuItem === 'withdraw-record' && (
        <div style={{ padding: '20px 16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>📋 Withdraw Record</h3>
          {db?.withdrawals?.filter(w => w.username === session?.username).length ? (
            db.withdrawals.filter(w => w.username === session.username).map((withdraw, idx) => (
              <div key={withdraw.id || idx} style={{ marginBottom: '16px', padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{withdraw.withdrawType || 'BTC'} Withdrawal</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{withdraw.requestedAt || withdraw.createdAt || 'Unknown time'}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: '999px', background: withdraw.status === 'approved' ? 'rgba(0,229,176,0.15)' : withdraw.status === 'rejected' ? 'rgba(255,71,87,0.15)' : 'rgba(245,176,65,0.15)', color: withdraw.status === 'approved' ? '#00e5b0' : withdraw.status === 'rejected' ? '#ff4757' : '#f5b041', fontWeight: 700, fontSize: '0.75rem' }}>{withdraw.status?.toUpperCase() || 'PENDING'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Amount:</strong> {withdraw.amount}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Type:</strong> {withdraw.withdrawType}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Address:</strong> <span style={{ wordBreak: 'break-all' }}>{withdraw.address}</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Tx Hash:</strong> {withdraw.txHash || 'N/A'}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📭</div>
              <p style={{ fontSize: '1rem', marginBottom: '10px' }}>No withdrawal records yet.</p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Submit a withdrawal request from the Withdraw menu.</p>
            </div>
          )}
        </div>
      )}

      {selectedMenuItem === 'recharge-record' && (
        <div style={{ padding: '20px 16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>🔄 Recharge Record</h3>
          {db?.transactions?.filter(t => t.username === session?.username && (t.type === 'credit' || t.type === 'recharge')).length ? (
            db.transactions.filter(t => t.username === session.username && (t.type === 'credit' || t.type === 'recharge')).map((tx, idx) => (
              <div key={tx.id || idx} style={{ marginBottom: '16px', padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{tx.type === 'credit' ? 'Recharge' : tx.type}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{tx.timestamp || tx.date || 'Unknown time'}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: '999px', background: 'rgba(0,229,176,0.15)', color: '#00e5b0', fontWeight: 700, fontSize: '0.75rem' }}>{tx.type}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Amount:</strong> {tx.amount}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Reason:</strong> {tx.reason || 'Recharge'}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💳</div>
              <p style={{ fontSize: '1rem', marginBottom: '10px' }}>No recharge records yet.</p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Recharge your account to see records here.</p>
            </div>
          )}
        </div>
      )}

      {selectedMenuItem === 'order-record' && (
        <div style={{ padding: '20px 16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>📦 Order Record</h3>
          {db?.transactions?.filter(t => t.username === session?.username && t.type === 'order').length ? (
            db.transactions.filter(t => t.username === session.username && t.type === 'order').map((tx, idx) => (
              <div key={tx.id || idx} style={{ marginBottom: '16px', padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{tx.description || 'Order'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{tx.timestamp || tx.date || 'Unknown time'}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: '999px', background: 'rgba(245,176,65,0.15)', color: '#f5b041', fontWeight: 700, fontSize: '0.75rem' }}>{tx.status || 'COMPLETED'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Amount:</strong> {tx.amount}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><strong>Item:</strong> {tx.item || 'Gift plan'}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛍️</div>
              <p style={{ fontSize: '1rem', marginBottom: '10px' }}>No order records yet.</p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Place an order to see it in your order history.</p>
            </div>
          )}
        </div>
      )}

      {selectedMenuItem === 'Withdraw' && (
         <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#fff',
        paddingTop: '10px',
        paddingBottom: '70px',
        overflowY: 'auto',
      }}
    >
      <style>{withdrawStyles}</style>
      
      {/* Header */}
      <div
        className="withdraw-header"
        style={{
          background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
          padding: '16px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '24px' }}></div>
        <div style={{ flex: 1 }}></div>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Content */}
      <div className="withdraw-content" style={{ padding: '24px 16px' }}>
        {/* Withdrawal Form */}
        <div
          className="form-card"
          style={{
            background: '#2a2a2a',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '24px',
          }}
        >
          {/* Withdrawal Type */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              Withdrawal Type
            </label>
            <select
              value={withdrawType}
              onChange={(e) => setWithdrawType(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
          </div>

          {/* Amount Input */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              Withdrawal Amount ({withdrawType})
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              max={user.balance}
              placeholder={`Enter amount in ${withdrawType}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Address Input */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              {withdrawType} Address
            </label>
            <input
              type="text"
              placeholder={`Enter your ${withdrawType} wallet address`}
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                boxSizing: 'border-box',
                marginBottom: '8px',
              }}
            />
            {walletAddresses[withdrawType] && (
              <button
                onClick={() => setWithdrawAddress(walletAddresses[withdrawType])}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(245,176,65,0.15)',
                  border: '1px solid rgba(245,176,65,0.3)',
                  borderRadius: '6px',
                  color: '#f5b041',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245,176,65,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245,176,65,0.15)';
                }}
              >
                📋 Use Saved {withdrawType} Address
              </button>
            )}
          </div>

          {/* Info Box */}
          <div
            style={{
              background: 'rgba(100,149,237,0.1)',
              border: '1px solid rgba(100,149,237,0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            ℹ️ Your withdrawal request will be reviewed by an admin. You'll receive a notification once it's approved or rejected.
          </div>

          {/* Submit Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading || !amount || !withdrawAddress}
            className="submit-btn"
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#666' : 'linear-gradient(135deg, #f5b041, #e8a020)',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.3s',
              opacity: loading || !amount || !withdrawAddress ? 0.6 : 1,
              marginBottom: '12px',
            }}
          >
            {loading ? '⏳ Processing...' : '📤 Submit Withdrawal Request'}
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => setSelectedMenuItem(null)}
            className="submit-btn"
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '430px',
          background: 'rgba(26,26,26,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '6px 0',
          height: '60px',
        }}
      >
        {[
          { label: 'Home', icon: '🏠', route: '/' },
          { label: 'Reviews', icon: '⭐', route: '/reviews' },
          { label: 'Events', icon: '💝', route: '/events' },
          { label: 'Video', icon: '🎥', route: '/video' },
          { label: 'Me', icon: '👤', route: '/me' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.route)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              textAlign: 'center',
              flex: 1,
              padding: '4px',
              fontSize: '0.65rem',
              fontWeight: 500,
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f5b041';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{item.icon}</div>
            {item.label}
          </button>
        ))}
      </div>
    </div>
      )}

    </div>
  </div>
)}

        {/* ME TAB - Not logged in */}
        {activeTab === 'me' && !session && (
          <div className="slide-enter" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💗</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Join Sincere Love</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: 1.5 }}>Sign in to access your profile, matches, and exclusive features.</p>
            <button onClick={() => setShowLogin(true)} style={{
              padding: '14px 40px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #f5b041, #e8a020)',
              border: 'none', color: '#000', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.95rem',
              boxShadow: '0 8px 30px rgba(245,176,65,0.3)',
            }}>Sign In</button>
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Don't have an account? </span>
              <span onClick={() => setShowLogin(true)} style={{ fontSize: '0.8rem', color: '#f5b041', fontWeight: 600, cursor: 'pointer' }}>Register Free</span>
            </div>
          </div>
        )}
      </div>

      <BottomTabs />
    </div>
  );
}