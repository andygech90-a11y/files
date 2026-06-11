'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import model1 from '@/src/assets/photo/model1.png';
import model2 from '@/src/assets/photo/model2.png';
import model3 from '@/src/assets/photo/model3.png';
import model4 from '@/src/assets/photo/model4.png';
import model5 from '@/src/assets/photo/model5.png';
import model6 from '@/src/assets/photo/model6.png';
import model7 from '@/src/assets/photo/model7.png';
import model8 from '@/src/assets/photo/model8.png';
import model9 from '@/src/assets/photo/model9.png';

export const AppContext = createContext();

const SESSION_STORAGE_KEY = 'sincere-love-session';

const WOMEN = [
  { name:'Sophia Laurent',   age:26, tag:'VIP',    img:model1, location: 'Alabama' },
  { name:'Isabella Rossi',   age:24, tag:'Online', img:model2, location: 'Alaska' },
  { name:'Amara Diallo',     age:28, tag:'New',    img:model3, location: 'Arizona' },
  { name:'Mei Lin Chen',     age:23, tag:'Online', img:model4, location: 'Arkansas' },
  { name:'Valentina Cruz',   age:27, tag:'VIP',    img:model5, location: 'California' },
  { name:'Layla Hassan',     age:25, tag:'New',    img:model6, location: 'Colorado' },
  { name:'Natasha Ivanova',  age:29, tag:'Online', img:model7, location: 'Connecticut' },
  { name:'Priya Sharma',     age:26, tag:'New',    img:model8, location: 'Delaware' },
  { name:'Elena Vasquez',    age:22, tag:'Online', img:model9, location: 'Florida' },
  { name:'Aiko Tanaka',      age:25, tag:'VIP',    img:model1, location: 'Georgia' },
  { name:'Zara Ahmed',       age:28, tag:'New',    img:model2, location: 'Hawaii' },
  { name:'Grace Okonkwo',    age:24, tag:'VIP',    img:model3, location: 'Idaho' },
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

const defaultDb = {
  users: {},
  transactions: [],
  withdrawals: [],
  notifications: {},
  referrals: ['LOVE2024','HEART2024','MATCH100','VIP2024','CONNECT1'],
  adminBTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  giftAssign: {},
};

const normalizeDb = (raw) => ({
  users: raw?.users || {},
  transactions: raw?.transactions || [],
  withdrawals: raw?.withdrawals || [],
  notifications: raw?.notifications || {},
  referrals: raw?.referrals || defaultDb.referrals,
  adminBTC: raw?.adminBTC || defaultDb.adminBTC,
  giftAssign: raw?.giftAssign || {},
});

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [db, setDb] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const [userBalance, setUserBalance] = useState(0);
  
  // showToast is used by the initial load effect; declare it early so effects can call it
  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 3400);
  };

  useEffect(() => {
    let mounted = true;
    const loadDb = async () => {
      try {
        const response = await fetch('/api/state');
        if (!response.ok) {
          const text = await response.text().catch(() => null);
          let message = 'Failed to fetch db state';
          if (text) {
            try {
              const parsed = JSON.parse(text);
              message = parsed.error || parsed.message || text;
            } catch {
              message = text;
            }
          }
          console.error('loadDb non-ok response:', response.status, message);
          showToast?.(message, 'error');
          if (mounted) setDb(defaultDb);
          return;
        }
        const remoteDb = await response.json();
        if (mounted) setDb(normalizeDb(remoteDb));
      } catch (error) {
        console.error('loadDb error:', error);
        showToast?.(error?.message || 'Failed to load app state', 'error');
        if (mounted) setDb(defaultDb);
      }
    };
    loadDb();
    return () => { mounted = false; };
  }, [showToast, normalizeDb, defaultDb]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        setSession(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error('Failed to restore session from localStorage:', error);
    }
  }, []);

  const saveSession = (user) => {
    setSession(user);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
  };

  const clearSession = () => {
    setSession(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const saveDB = async (newDb) => {
    setDb(newDb);
    try {
      await fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDb),
      });
    } catch (error) {
      console.error('saveDB error:', error);
    }
  };

  const login = useCallback((username, password) => {
    if (!db || !db.users[username] || db.users[username].password !== password) {
      return false;
    }
    const user = { username, isAdmin: false };
    saveSession(user);
    return true;
  }, [db]);

  const adminLogin = useCallback((password) => {
    if (password !== 'admin123') return false;
    const user = { username: 'admin', isAdmin: true };
    saveSession(user);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const register = (username, password, referralCode) => {
    if (!db) return false;
    if (db.users[username]) return false;
    if (!db.referrals.includes(referralCode.toUpperCase())) return false;

    const newDb = { ...db };
    newDb.users[username] = {
      username: username,
      password: password,
      referral: referralCode.toUpperCase(),
      balance: 0,
      gifts: 0,
      matches: Math.floor(Math.random()*60)+10,
      joined: new Date().toLocaleDateString('en-GB'),
      joinedTs: Date.now(),
      avatar: `https://i.pravatar.cc/200?u=${username}`,
    };
    saveDB(newDb);
    return true;
  };

  // Fetch user balance from backend
  const fetchUserBalance = async (username) => {
    try {
      const response = await fetch(`/api/users/balance?username=${username}`);
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      setUserBalance(data.balance || 0);
      return data.balance || 0;
    } catch (error) {
      console.error('Balance fetch error:', error);
      showToast('Failed to fetch balance', 'error');
      return 0;
    }
  };

  // Request withdrawal
  const requestWithdrawal = async (username, amount, withdrawType, address) => {
    try {
      const response = await fetch('/api/withdrawals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, amount, withdrawType, address }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Withdrawal request failed');
      }

      const data = await response.json();
      showToast('✅ Withdrawal request submitted successfully!', 'success');
      return data;
    } catch (error) {
      console.error('Withdrawal error:', error);
      showToast(error.message || 'Withdrawal request failed', 'error');
      return null;
    }
  };

  // Add points to user (admin only)
  const addUserPoints = async (adminPassword, username, points, reason) => {
    try {
      const response = await fetch('/api/users/add-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword, username, points, reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add points');
      }

      const data = await response.json();
      showToast(data.message, 'success');
      return data;
    } catch (error) {
      console.error('Add points error:', error);
      showToast(error.message || 'Failed to add points', 'error');
      return null;
    }
  };

  // Get withdrawal requests
  const getWithdrawals = async (status = null) => {
    try {
      const url = status ? `/api/withdrawals/request?status=${status}` : '/api/withdrawals/request';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch withdrawals');
      const data = await response.json();
      return data.requests || [];
    } catch (error) {
      console.error('Fetch withdrawals error:', error);
      showToast('Failed to fetch withdrawal requests', 'error');
      return [];
    }
  };

  // Approve withdrawal (UI passes requestId)
  const approveWithdrawal = async (requestId, txHash = null) => {
    try {
      const response = await fetch('/api/withdrawals/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: 'admin123', requestId, txHash }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to approve withdrawal');
      }

      const data = await response.json();
      showToast(data.message, 'success');
      return data;
    } catch (error) {
      console.error('Approve withdrawal error:', error);
      showToast(error.message || 'Failed to approve withdrawal', 'error');
      return null;
    }
  };

  // Reject withdrawal (UI passes requestId)
  const rejectWithdrawal = async (requestId, reason = null) => {
    try {
      const response = await fetch('/api/withdrawals/reject', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: 'admin123', requestId, reason }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to reject withdrawal');
      }

      const data = await response.json();
      showToast(data.message, 'success');
      return data;
    } catch (error) {
      console.error('Reject withdrawal error:', error);
      showToast(error.message || 'Failed to reject withdrawal', 'error');
      return null;
    }
  };

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
      fetchUserBalance,
      requestWithdrawal,
      addUserPoints,
      getWithdrawals,
      approveWithdrawal,
      rejectWithdrawal,
      userBalance,
      WOMEN,
      TESTIMONIALS,
      GIFT_PLANS,
    }}>
      {children}
    </AppContext.Provider>
  );
}
