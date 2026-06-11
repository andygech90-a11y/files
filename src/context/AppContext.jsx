"use client";

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

const SESSION_STORAGE_KEY = 'sincere-love-session';

const WOMEN = [
  { name:'Sophia Laurent',   age:26, tag:'VIP',    img:model1.src || model1, location: 'Alabama' },
  { name:'Isabella Rossi',   age:24, tag:'Online', img:model2.src || model2, location: 'Alaska' },
  { name:'Amara Diallo',     age:28, tag:'New',    img:model3.src || model3, location: 'Arizona' },
  { name:'Mei Lin Chen',     age:23, tag:'Online', img:model4.src || model4, location: 'Arkansas' },
  { name:'Valentina Cruz',   age:27, tag:'VIP',    img:model5.src || model5, location: 'California' },
  { name:'Layla Hassan',     age:25, tag:'New',    img:model6.src || model6, location: 'Colorado' },
  { name:'Natasha Ivanova',  age:29, tag:'Online', img:model7.src || model7, location: 'Connecticut' },
  { name:'Priya Sharma',     age:26, tag:'New',    img:model8.src || model8, location: 'Delaware' },
  { name:'Elena Vasquez',    age:22, tag:'Online', img:model9.src || model9, location: 'Florida' },
  { name:'Aiko Tanaka',      age:25, tag:'VIP',    img:model1.src || model1, location: 'Georgia' },
  { name:'Zara Ahmed',       age:28, tag:'New',    img:model2.src || model2, location: 'Hawaii' },
  { name:'Grace Okonkwo',    age:24, tag:'VIP',    img:model3.src || model3, location: 'Idaho' },
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
  const [session, setSession] = useState(null);

  const defaultDb = {
    users: {},
    transactions: [],
    withdrawals: [],
    notifications: {},
    referrals: ['LOVE2024','HEART2024','MATCH100','VIP2024','CONNECT1'],
    adminBTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    giftAssign: {},
  };

  const [db, setDb] = useState(defaultDb);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const normalizeDb = (raw) => ({
      users: raw?.users || {},
      transactions: raw?.transactions || [],
      withdrawals: raw?.withdrawals || [],
      notifications: raw?.notifications || {},
      referrals: raw?.referrals || defaultDb.referrals,
      adminBTC: raw?.adminBTC || defaultDb.adminBTC,
      giftAssign: raw?.giftAssign || {},
    });

    const loadDb = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/state');
        if (!response.ok) {
          // Try to parse backend message if provided
          const text = await response.text().catch(() => null);
          let message = 'Failed to fetch db state';
          if (text) {
            try {
              const parsed = JSON.parse(text);
              message = parsed.error || parsed.message || message;
            } catch (e) {
              message = text || message;
            }
          }
          console.error('loadDb non-ok response:', response.status, message);
          try { showToast(message, 'error'); } catch (e) { /* showToast may not be initialized yet */ }
          setDb(defaultDb);
          return;
        }
        const remoteDb = await response.json();
        const normalized = normalizeDb(remoteDb);
        setDb(normalized);
      } catch (error) {
        console.error('loadDb error:', error);
        try { showToast(error?.message || 'Failed to load app state', 'error'); } catch (e) {}
        setDb(defaultDb);
      } finally {
        setLoading(false);
      }
    };

    loadDb();
  }, []);

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

  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  const saveDB = useCallback((newDb) => {
    setDb(newDb);
    fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDb),
    }).catch((error) => {
      console.error('saveDB error:', error);
    });
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 3400);
  }, []);

  // Wrap async fetches to show global loading
  const withLoading = useCallback(async (fn) => {
    try {
      setLoading(true);
      const res = await fn();
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotification = useCallback((username, notification) => {
    if (!db || !username) return null;

    const existingNotifications = db.notifications?.[username] || [];
    const nextNotification = {
      id: notification.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: notification.title || 'Notification',
      message: notification.message || '',
      type: notification.type || 'info',
      timestamp: notification.timestamp || new Date().toLocaleString(),
      read: notification.read === true,
    };

    const newDb = {
      ...db,
      notifications: {
        ...db.notifications,
        [username]: [...existingNotifications, nextNotification],
      },
    };
    saveDB(newDb);
    return nextNotification;
  }, [db, saveDB]);

  const markNotificationRead = useCallback((username, notificationId) => {
    if (!db || !username || !db.notifications?.[username]) return false;

    const updatedNotifications = db.notifications[username].map((item) =>
      item.id === notificationId ? { ...item, read: true } : item
    );

    const newDb = {
      ...db,
      notifications: {
        ...db.notifications,
        [username]: updatedNotifications,
      },
    };
    saveDB(newDb);
    return true;
  }, [db, saveDB]);

  const saveWalletAddress = useCallback((username, type, address) => {
    if (!db || !db.users[username]) return false;

    const newDb = {
      ...db,
      users: {
        ...db.users,
        [username]: {
          ...db.users[username],
          wallets: {
            ...(db.users[username].wallets || {}),
            [type]: address,
          },
        },
      },
    };

    saveDB(newDb);
    return true;
  }, [db, saveDB]);

  const fetchUserBalance = useCallback(async (username) => {
    if (!username) return 0;
    try {
      const response = await fetch(`/api/users/balance?username=${encodeURIComponent(username)}`);
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      const balance = data.balance ?? 0;
      setUserBalance(balance);
      return balance;
    } catch (error) {
      console.error('fetchUserBalance error:', error);
      showToast('Failed to load balance', 'error');
      return 0;
    }
  }, [showToast]);

  const login = useCallback(async (username, password) => {
    return withLoading(async () => {
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message = err.error || 'Invalid username or password';
        showToast(message, 'error');
        return { success: false, message };
      }

      const data = await response.json();
      const user = data.user || { username, isAdmin: false };
      saveSession(user);
      return { success: true, user };
      } catch (error) {
        console.error('login error:', error);
        showToast('Login failed', 'error');
        return { success: false, message: 'Login failed' };
      }
    });
  }, [saveSession, showToast]);

  const adminLogin = useCallback((password) => {
    if (password !== 'admin123') return false;
    const user = { username: 'admin', isAdmin: true };
    saveSession(user);
    return true;
  }, [saveSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const register = useCallback(async (username, password, referralCode) => {
    return withLoading(async () => {
      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, referralCode }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const message = err.error || 'Registration failed';
          showToast(message, 'error');
          return { success: false, message };
        }

        // Optionally, we could refresh the local db from backend here
        await fetch('/api/state').then(r => r.ok && r.json()).then(remote => remote && saveDB(remote)).catch(() => {});

        return { success: true };
      } catch (error) {
        console.error('register error:', error);
        showToast('Registration failed', 'error');
        return { success: false, message: 'Registration failed' };
      }
    });
  }, [saveDB, showToast]);

  const requestWithdrawal = useCallback(async (username, amount, withdrawType, address) => {
    if (!db) {
      showToast('Unable to submit withdrawal request. Please try again later.', 'error');
      return { success: false, message: 'Server unavailable' };
    }

    return withLoading(async () => {
      try {
        const response = await fetch('/api/withdrawals/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, amount, withdrawType, address }),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          const message = error.error || 'Withdrawal request failed';
          showToast(message, 'error');
          return { success: false, message };
        }

        const data = await response.json();

      const newWithdrawal = {
        id: Date.now().toString(),
        username,
        amount,
        withdrawType,
        address,
        status: 'pending',
        requestedAt: new Date().toLocaleString(),
        approvedAt: null,
        txHash: null,
      };

      const newDb = {
        ...db,
        withdrawals: [...(db.withdrawals || []), newWithdrawal],
        notifications: {
          ...db.notifications,
          [username]: [
            ...(db.notifications?.[username] || []),
            {
              id: Date.now().toString(),
              type: 'withdrawal_requested',
              title: 'Withdrawal Requested',
              message: `Your ${withdrawType} withdrawal request for ${amount} was submitted successfully.`,
              timestamp: new Date().toLocaleString(),
              read: false,
            }
          ]
        }
      };

      saveDB(newDb);
      await fetchUserBalance(username);
      showToast('✅ Withdrawal request submitted! Waiting for admin approval...', 'success');
      return { success: true, data };
      } catch (error) {
        console.error('requestWithdrawal error:', error);
        const msg = error?.message || 'Withdrawal request failed';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }
    });
  }, [db, fetchUserBalance, saveDB, showToast]);

  const approveWithdrawal = useCallback((withdrawalId) => {
    if (!db || !db.withdrawals) return false;

    const withdrawal = db.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal || withdrawal.status !== 'pending') return false;

    const newDb = {
      ...db,
      withdrawals: db.withdrawals.map(w => 
        w.id === withdrawalId ? { ...w, status: 'approved', approvedAt: new Date().toLocaleString() } : w
      ),
      users: {
        ...db.users,
        [withdrawal.username]: {
          ...db.users[withdrawal.username],
          balance: (db.users[withdrawal.username].balance || 0) - withdrawal.amount
        }
      },
      notifications: {
        ...db.notifications,
        [withdrawal.username]: [
          ...(db.notifications[withdrawal.username] || []),
          {
            id: Date.now().toString(),
            type: 'withdrawal_approved',
            title: '✅ Withdrawal Approved',
            message: `Your withdrawal of ${withdrawal.amount} BTC has been approved and deducted from your account.`,
            timestamp: new Date().toLocaleString(),
            read: false,
          }
        ]
      }
    };
    saveDB(newDb);
    return true;
  }, [db, saveDB]);

  const rejectWithdrawal = useCallback((withdrawalId) => {
    if (!db || !db.withdrawals) return false;

    const withdrawal = db.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal || withdrawal.status !== 'pending') return false;

    const newDb = {
      ...db,
      withdrawals: db.withdrawals.map(w => 
        w.id === withdrawalId ? { ...w, status: 'rejected', rejectedAt: new Date().toLocaleString() } : w
      ),
      notifications: {
        ...db.notifications,
        [withdrawal.username]: [
          ...(db.notifications[withdrawal.username] || []),
          {
            id: Date.now().toString(),
            type: 'withdrawal_rejected',
            title: '❌ Withdrawal Rejected',
            message: `Your withdrawal request of ${withdrawal.amount} BTC has been rejected.`,
            timestamp: new Date().toLocaleString(),
            read: false,
          }
        ]
      }
    };
    saveDB(newDb);
    return true;
  }, [db, saveDB]);

  const addBalance = useCallback((username, amount, reason = 'Admin credit') => {
    if (!db || !db.users[username]) return false;

    const newDb = {
      ...db,
      users: {
        ...db.users,
        [username]: {
          ...db.users[username],
          balance: (db.users[username].balance || 0) + amount
        }
      },
      transactions: [
        ...(db.transactions || []),
        {
          id: Date.now().toString(),
          username,
          type: 'credit',
          amount,
          reason,
          timestamp: new Date().toLocaleString(),
        }
      ],
      notifications: {
        ...db.notifications,
        [username]: [
          ...(db.notifications[username] || []),
          {
            id: Date.now().toString(),
            type: 'balance_added',
            title: '💰 Balance Added',
            message: `${amount} BTC has been added to your account. Reason: ${reason}`,
            timestamp: new Date().toLocaleString(),
            read: false,
          }
        ]
      }
    };
    saveDB(newDb);
    return true;
  }, [db, saveDB]);

  const getNotificationsForUser = useCallback((username) => {
    if (!db || !username) return [];
    return db.notifications?.[username] || [];
  }, [db]);

  return (
    <AppContext.Provider value={{
      loading,
      session,
      db,
      toast,
      showToast,
      login,
      adminLogin,
      logout,
      register,
      saveDB,
      saveWalletAddress,
      fetchUserBalance,
      requestWithdrawal,
      approveWithdrawal,
      rejectWithdrawal,
      addBalance,
      createNotification,
      markNotificationRead,
      getNotificationsForUser,
      userBalance,
      WOMEN,
      TESTIMONIALS,
      GIFT_PLANS,
    }}>
      {loading && (
        <div className="global-loading">
          <div className="spinner" aria-hidden="true"></div>
        </div>
      )}
      {children}
    </AppContext.Provider>
  );
}