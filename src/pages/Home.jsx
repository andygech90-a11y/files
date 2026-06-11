import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import imageHero from '../assets/image.png';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';


export default function Home() {
  const { session, WOMEN, TESTIMONIALS, db, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const marqueeRef = useRef(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const menuItems = [
    { id: 'withdraw', label: 'Withdraw', icon: '💰' },
    { id: 'wallet', label: 'Wallet Management', icon: '💳' },
    { id: 'withdraw-record', label: 'Withdraw Record', icon: '📋' },
    { id: 'recharge-record', label: 'Recharge Record', icon: '🔄' },
    { id: 'order-record', label: 'Order Record', icon: '📦' },
    { id: 'notifications', label: 'System Notifications', icon: '📧' },
  ];

  const notifications = [
    { id: 1, title: 'Welcome to Sincere Love Club!', message: 'You have successfully registered. Complete your profile to get started.', icon: '🎉', time: 'Just now', type: 'welcome' },
    { id: 2, title: 'New Match Alert!', message: 'Sophia Lauren is interested in you! Check her profile.', icon: '💕', time: '2 hours ago', type: 'match' },
    { id: 3, title: 'VIP Member Bonus', message: 'You received 50 bonus points! Use them to send gifts.', icon: '🎁', time: '1 day ago', type: 'reward' },
    { id: 4, title: 'Profile Updated', message: 'Your profile verification is pending review.', icon: '👤', time: '2 days ago', type: 'info' },
    { id: 5, title: 'Special Offer!', message: 'Upgrade to VIP and get 30% off on all gift plans!', icon: '⭐', time: '3 days ago', type: 'offer' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const user = session && db ? db.users[session.username] : null;

  // Generate stable random values for women cards
  const womenCardData = useMemo(() => WOMEN.map((woman, i) => ({
    vipId: 10000 + i * 7777,
    rating: (9.7 + (i % 3) * 0.1).toFixed(1),
    viewers: 100 + i * 37,
  })), [WOMEN]);

  // Carousel slides
  const SLIDES = [
    { img: image1, title: 'Find Your Perfect Match', subtitle: 'Join 100,000+ verified members worldwide', badge: '💎 VIP EXCLUSIVE' },
    { img: image2, title: 'Premium Dating Experience', subtitle: 'Verified profiles · Real connections', badge: '🔥 TRENDING' },
    { img: image3, title: 'Love Starts Here', subtitle: 'Exclusive matches curated just for you', badge: '✨ NEW' },
    { img: imageHero, title: 'Sincere Love Club', subtitle: 'Find genuine connections today', badge: '💕 FEATURED' },
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

  // Global redirect removed so unauthenticated users can view Home, Events, etc.
  const gifts = [
    { id: 'tinder', name: 'Tinder', logo: '💗', bgColor: '#e7165f' },
    { id: 'bumble', name: 'Bumble', logo: '🐝', bgColor: '#ffc646' },
    { id: 'hinge', name: 'Hinge', logo: '📱', bgColor: '#fff' },
    { id: 'badoo', name: 'Badoo', logo: '👤', bgColor: '#dd0000' },
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
            <div style={{ position: 'absolute', top: '-2px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#f5b041', border: '2px solid #0a0a0a' }}></div>
          </div>
          <div
            onClick={() => session ? navigate('/profile') : navigate('/login')}
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

        {/* ========== HOME TAB ========== */}
        {activeTab === 'home' && (
          <div className="slide-enter">
            {/* Carousel */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                display: 'flex',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentSlide * 100}%)`,
              }}>
                {SLIDES.map((slide, i) => (
                  <div key={i} style={{ minWidth: '100%', position: 'relative', height: '240px' }}>
                    <img src={slide.img} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              display: 'flex', justifyContent: 'space-around', padding: '14px 16px',
              background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {[
                { val: '100K+', label: 'Members', icon: '👥' },
                { val: '50+', label: 'Countries', icon: '🌍' },
                { val: '98%', label: 'Verified', icon: '✅' },
                { val: '24/7', label: 'Support', icon: '💬' },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.5px' }}>{stat.label}</div>
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
                    <img src={woman.img} alt={woman.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {/* Live badge */}
                    <div style={{
                      position: 'absolute', top: '6px', left: '6px',
                      padding: '2px 6px', borderRadius: '4px',
                      background: 'rgba(245,176,65,0.9)', color: '#000',
                      fontSize: '0.55rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', gap: '3px',
                      backdropFilter: 'blur(4px)',
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', animation: 'pulse-dot 1s ease infinite' }}></span>
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
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{woman.name.split(' ')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Companions - Grid */}
            <div style={{ padding: '16px 16px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>💕 Featured Companions</h3>
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
                    <img src={woman.img} alt={woman.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
                { icon: '💝', label: 'Match', color: '#f5b041' },
                { icon: '🎁', label: 'Gifts', color: '#f5b041' },
                { icon: '👑', label: 'VIP', color: '#b04eff' },
                { icon: '💬', label: 'Chat', color: '#00e5b0' },
              ].map((action, i) => (
                <div key={i} onClick={() => !session && navigate('/login')} style={{
                  textAlign: 'center', padding: '14px 8px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${action.color}15, ${action.color}08)`,
                  border: `1px solid ${action.color}25`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{action.icon}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{action.label}</div>
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
                  02:24
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>1055097 period</div>
                <span style={{ background: '#ffc646', color: '#000', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>bumble</span>
                <span style={{ background: '#dd0000', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>badoo</span>
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
                    <span style={{ fontSize: '2.5rem' }}>{gift.logo}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{gift.name}</span>
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
        {activeTab === 'me' && session && user && !selectedMenuItem && (
          <div className="slide-enter" style={{ padding: '0' }}>
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
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{user.username}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Member since {user.joined}</p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Points</div>
                  <div style={{ fontSize: '1.2rem', color: '#f5b041', fontWeight: 700 }}>0.00</div>
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
          <div className="slide-enter" style={{ width: '100%', minHeight: 'calc(100vh - 140px)', background: '#1a1a1a', color: '#fff', paddingTop: '10px', paddingBottom: '20px', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setSelectedMenuItem(null)} style={{ background: 'none', border: 'none', color: '#f5b041', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#f5b041' }}>{menuItems.find(m => m.id === selectedMenuItem)?.label || 'Details'}</span>
              <span style={{ fontSize: '1rem', cursor: 'pointer' }}>⌂</span>
            </div>

            {/* Notifications Content */}
            {selectedMenuItem === 'notifications' ? (
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
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🔔</div>
                    <p style={{ fontSize: '1rem' }}>No notifications</p>
                  </div>
                )}
              </div>
            ) : (
              /* Default empty state for other menu items */
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                <p style={{ fontSize: '1rem' }}>No more data</p>
              </div>
            )}
          </div>
        )}

        {/* ME TAB - Not logged in */}
        {activeTab === 'me' && !session && (
          <div className="slide-enter" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💗</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>Join Sincere Love</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: 1.5 }}>Sign in to access your profile, matches, and exclusive features.</p>
            <button onClick={() => navigate('/login')} style={{
              padding: '14px 40px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #f5b041, #e8a020)',
              border: 'none', color: '#000', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.95rem',
              boxShadow: '0 8px 30px rgba(245,176,65,0.3)',
            }}>Sign In</button>
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Don't have an account? </span>
              <span onClick={() => navigate('/register')} style={{ fontSize: '0.8rem', color: '#f5b041', fontWeight: 600, cursor: 'pointer' }}>Register Free</span>
            </div>
          </div>
        )}
      </div>

      {/* ===== BOTTOM NAVIGATION ===== */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: '398px', /* 430px - 32px margin */
        background: 'rgba(20, 20, 25, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '30px',
        display: 'flex', justifyContent: 'space-around',
        zIndex: 1000,
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        padding: '6px 8px',
        paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
      }}>
        {[
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'reviews', label: 'Reviews', icon: '⭐' },
          { id: 'events', label: 'Events', icon: '🎉' },
          { id: 'video', label: 'Video', icon: '🎥' },
          { id: 'me', label: 'Me', icon: '👤' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if ((tab.id === 'me' || tab.id === 'events') && !session) {
                navigate('/login');
              } else {
                setActiveTab(tab.id);
              }
            }}
            style={{
              flex: 1,
              padding: '10px 4px 8px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? '#f5b041' : 'rgba(255,255,255,0.35)',
              fontSize: '0.65rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              position: 'relative',
              transition: 'color 0.2s ease',
            }}
          >
            {activeTab === tab.id && (
              <div style={{
                position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
                width: '24px', height: '3px', borderRadius: '2px',
                background: 'linear-gradient(90deg, #f5b041, #e8a020)',
              }}></div>
            )}
            <span style={{ fontSize: '1.15rem', transition: 'transform 0.2s ease', transform: activeTab === tab.id ? 'scale(1.15)' : 'scale(1)' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}