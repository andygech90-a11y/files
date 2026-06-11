'use client';

import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from './context/AppContext';

export default function HomePage() {
  const { session, WOMEN, db, logout } = useContext(AppContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const marqueeRef = useRef(null);

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
    router.push('/login');
  };

  const user = session && db ? db.users[session.username] : null;



  const SLIDES = [
    { img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=430&h=240&fit=crop', title: 'Find Your Perfect Match', subtitle: 'Join 100,000+ verified members worldwide', badge: '💎 VIP EXCLUSIVE' },
    { img: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=430&h=240&fit=crop', title: 'Premium Dating Experience', subtitle: 'Verified profiles · Real connections', badge: '🔥 TRENDING' },
    { img: 'https://images.unsplash.com/photo-1516984173510-dd1b19763c1a?w=430&h=240&fit=crop', title: 'Love Starts Here', subtitle: 'Exclusive matches curated just for you', badge: '✨ NEW' },
    { img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=430&h=240&fit=crop', title: 'Sincere Love Club', subtitle: 'Find genuine connections today', badge: '💕 FEATURED' },
  ];

  useEffect(() => {
    if (activeTab !== 'home') return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeTab, SLIDES.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMarqueeOffset(prev => prev - 1);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const VIDEOS = useMemo(() => [
    { name: 'Sophia', thumb: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop', viewers: 1243, live: true },
    { name: 'Isabella', thumb: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop', viewers: 876, live: true },
    { name: 'Amara', thumb: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop', viewers: 2104, live: false },
    { name: 'Valentina', thumb: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop', viewers: 543, live: true },
    { name: 'Natasha', thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop', viewers: 1567, live: false },
    { name: 'Elena', thumb: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=500&fit=crop', viewers: 932, live: true },
    { name: 'Priya', thumb: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop', viewers: 410, live: false },
    { name: 'Aiko', thumb: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop', viewers: 1890, live: true },
    { name: 'Layla', thumb: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=500&fit=crop', viewers: 723, live: true },
  ], []);

  const [selectedGift, setSelectedGift] = useState(null);
  const [giftPoints, setGiftPoints] = useState(0);

  const gifts = useMemo(() => [
    { id: 'tinder', name: 'Tinder', logo: '💗', bgColor: '#e7165f' },
    { id: 'bumble', name: 'Bumble', logo: '🐝', bgColor: '#ffc646' },
    { id: 'hinge', name: 'Hinge', logo: '📱', bgColor: '#fff' },
    { id: 'badoo', name: 'Badoo', logo: '👤', bgColor: '#dd0000' },
  ], []);

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

      {/* HEADER */}
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
            onClick={() => session ? router.push('/profile') : router.push('/login')}
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

      {/* MARQUEE TICKER */}
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

      {/* CONTENT AREA - Simplified for now */}
      <div style={{ paddingBottom: '110px', textAlign: 'center', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>🎉</h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>Welcome to Next.js!</p>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Your Vite frontend has been successfully migrated to Next.js</p>
        <button 
          onClick={() => router.push('/login')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f5b041, #e8a020)',
            border: 'none',
            color: '#000',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Get Started
        </button>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: '398px',
        background: 'rgba(20, 20, 25, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '30px',
        display: 'flex', justifyContent: 'space-around',
        zIndex: 1000,
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        padding: '6px 8px',
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
                router.push('/login');
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
