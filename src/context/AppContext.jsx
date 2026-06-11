import React, { createContext, useState, useEffect, useCallback } from 'react';
import model1 from '../assets/photo/model1.png';
import model2 from '../assets/photo/model2.png';
import model3 from '../assets/photo/model3.png';
import model4 from '../assets/photo/model4.png';
import model5 from '../assets/photo/model5.png';
import model6 from '../assets/photo/model6.png';
import model7 from '../assets/photo/model7.png';
import model8 from '../assets/photo/model8.png';
import model9 from '../assets/photo/model9.png';

export const AppContext = createContext();

const WOMEN = [
  { name:'Sophia Laurent',   age:26, tag:'VIP',    img:model1 },
  { name:'Isabella Rossi',   age:24, tag:'Online', img:model2 },
  { name:'Amara Diallo',     age:28, tag:'New',    img:model3 },
  { name:'Mei Lin Chen',     age:23, tag:'Online', img:model4 },
  { name:'Valentina Cruz',   age:27, tag:'VIP',    img:model5 },
  { name:'Layla Hassan',     age:25, tag:'New',    img:model6 },
  { name:'Natasha Ivanova',  age:29, tag:'Online', img:model7 },
  { name:'Priya Sharma',     age:26, tag:'New',    img:model8 },
  { name:'Elena Vasquez',    age:22, tag:'Online', img:model9 },
  { name:'Aiko Tanaka',      age:25, tag:'VIP',    img:model1 },
  { name:'Zara Ahmed',       age:28, tag:'New',    img:model2 },
  { name:'Grace Okonkwo',    age:24, tag:'VIP',    img:model3 },
];

const TESTIMONIALS = [
  { text:'I found my soulmate here and my gift plan tripled in just two months. LoveConnect completely changed my life!', name:'Marcus T.', loc:'New York, USA', img:'https://i.pravatar.cc/80?img=11', stars:5 },
  { text:'The diamond plan gave me incredible returns. Beautiful platform, beautiful women, and real earnings.', name:'David K.', loc:'London, UK', img:'https://i.pravatar.cc/80?img=12', stars:5 },
  { text:'Met my girlfriend through LoveConnect. The withdrawal process is seamless and fast. Highly recommended!', name:'Ahmed R.', loc:'Dubai, UAE', img:'https://i.pravatar.cc/80?img=14', stars:5 },
  { text:'Best decision I ever made. The gold plan gave 120% returns and I met someone incredible.', name:'Carlos M.', loc:'São Paulo, Brazil', img:'https://i.pravatar.cc/80?img=15', stars:5 },
  { text:'Real love, real profits. The team is professional and the women are stunning. 10 out of 10!', name:'Samuel O.', loc:'Accra, Ghana', img:'https://i.pravatar.cc/80?img=16', stars:5 },
  { text:'I was skeptical at first, but after my first payout I was convinced. Now on my third plan!', name:'James W.', loc:'Toronto, Canada', img:'https://i.pravatar.cc/80?img=13', stars:5 },
];

const GIFT_PLANS = [
  { id:'bronze', icon:'🥉', name:'Bronze Rose',   min:0.001,  minLabel:'0.001 BTC', returnPct:'50%',  color:'#e8935a', desc:'Perfect for beginners' },
  { id:'silver', icon:'🥈', name:'Silver Heart',  min:0.005,  minLabel:'0.005 BTC', returnPct:'80%',  color:'#c0c8d8', desc:'Most popular plan' },
  { id:'gold',   icon:'🥇', name:'Gold Love',     min:0.01,   minLabel:'0.010 BTC', returnPct:'120%', color:'#f5c842', desc:'Best value & returns' },
  { id:'diamond',icon:'💎', name:'Diamond VIP',   min:0.05,   minLabel:'0.050 BTC', returnPct:'200%', color:'#b04eff', desc:'Maximum gains' },
];

export function AppProvider({ children }) {
  const [session, setSession] = useState(() => {
    const storedSession = sessionStorage.getItem('lcSession');
    return storedSession ? JSON.parse(storedSession) : null;
  });

  const [db, setDb] = useState(() => {
    const stored = localStorage.getItem('lcDB');
    const parsed = stored ? JSON.parse(stored) : {};
    
    if (!parsed.users) parsed.users = {};
    if (!parsed.transactions) parsed.transactions = [];
    if (!parsed.referrals) parsed.referrals = ['LOVE2024','HEART2024','MATCH100','VIP2024','CONNECT1'];
    if (!parsed.adminBTC) parsed.adminBTC = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    if (!parsed.giftAssign) parsed.giftAssign = {};
    
    // Save defaults immediately if they didn't exist
    if (!stored) {
      localStorage.setItem('lcDB', JSON.stringify(parsed));
    }
    return parsed;
  });

  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  const saveDB = useCallback((newDb) => {
    setDb(newDb);
    localStorage.setItem('lcDB', JSON.stringify(newDb));
  }, []);

  const login = useCallback((username, password) => {
    if (!db || !db.users[username] || db.users[username].password !== password) {
      return false;
    }
    const user = { username, isAdmin: false };
    setSession(user);
    sessionStorage.setItem('lcSession', JSON.stringify(user));
    return true;
  }, [db]);

  const adminLogin = useCallback((password) => {
    if (password !== 'admin123') return false;
    const user = { username: 'admin', isAdmin: true };
    setSession(user);
    sessionStorage.setItem('lcSession', JSON.stringify(user));
    return true;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    sessionStorage.removeItem('lcSession');
  }, []);

  const register = useCallback((username, password, referralCode) => {
    if (!db) return false;
    if (db.users[username]) return false;
    if (!referralCode || !db.referrals.includes(referralCode.toUpperCase())) return false;

    const newDb = {
      ...db,
      users: {
        ...db.users,
        [username]: {
          username: username,
          password: password,
          referral: referralCode.toUpperCase(),
          balance: 0,
          gifts: 0,
          matches: Math.floor(Math.random() * 60) + 10,
          joined: new Date().toLocaleDateString('en-GB'),
          joinedTs: Date.now(),
          avatar: `https://i.pravatar.cc/200?u=${username}`,
        }
      }
    };
    saveDB(newDb);
    return true;
  }, [db, saveDB]);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 3400);
  }, []);

  return (
    <AppContext.Provider value={{
      session,
      db,
      toast,
      showToast,
      login,
      adminLogin,
      logout,
      register,
      saveDB,
      WOMEN,
      TESTIMONIALS,
      GIFT_PLANS,
    }}>
      {children}
    </AppContext.Provider>
  );
}