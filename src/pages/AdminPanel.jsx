import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export default function AdminPanel() {
  const context = useContext(AppContext);
  
  if (!context) {
    return null;
  }

  const { logout, db, session, approveWithdrawal, rejectWithdrawal, addBalance, showToast } = context;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [addBalanceUser, setAddBalanceUser] = useState('');
  const [addBalanceAmount, setAddBalanceAmount] = useState('');


  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAddBalance = () => {
    if (!addBalanceUser || !addBalanceAmount) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    const amount = parseFloat(addBalanceAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Invalid amount', 'error');
      return;
    }
    if (addBalance(addBalanceUser, amount, 'Admin credit')) {
      showToast(`✅ Added ${amount} BTC to ${addBalanceUser}`, 'success');
      setAddBalanceUser('');
      setAddBalanceAmount('');
    } else {
      showToast('Failed to add balance', 'error');
    }
  };

  const handleApproveWithdrawal = (withdrawalId) => {
    if (approveWithdrawal(withdrawalId)) {
      showToast('✅ Withdrawal approved and deducted from user', 'success');
    } else {
      showToast('Failed to approve withdrawal', 'error');
    }
  };

  const handleRejectWithdrawal = (withdrawalId) => {
    if (rejectWithdrawal(withdrawalId)) {
      showToast('❌ Withdrawal rejected', 'success');
    } else {
      showToast('Failed to reject withdrawal', 'error');
    }
  };

  if (!session?.isAdmin || !db) return null;

  const userCount = Object.keys(db.users || {}).length;
  const txCount = (db.transactions || []).length;
  const totalBTC = Object.values(db.users || {}).reduce((sum, u) => sum + (u.balance || 0), 0);

  return (
    <div>
      <style>{`
        .bg-photo {
          position:fixed;inset:0;z-index:0;
          background:url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1920&q=70&fit=crop') center/cover no-repeat;
        }
        .bg-photo::after {
          content:'';position:absolute;inset:0;
          background:rgba(4,0,14,.93);
        }
      `}</style>

      <div className="bg-photo"></div>
      {/* Banner */}
      <div style={{ position: 'fixed', top: 0, right: 0, left: 250, zIndex: 50, padding: '12px 20px', background: 'linear-gradient(135deg, rgba(245, 176, 65, 0.95), rgba(232, 160, 32, 0.95))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: '#000', fontSize: '0.9rem', fontWeight: 600 }}>
        🔐 Admin Control Center - Manage your platform securely
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
        {/* SIDEBAR */}
        <div style={{ background: 'rgba(8, 3, 18, 0.88)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px 28px' }}>
            <a href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 600, background: 'linear-gradient(135deg,#f5b041,#e8a020)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textDecoration: 'none' }}>💗 LoveConnect</a>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px', marginTop: '2px' }}>ADMIN PANEL</p>
          </div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 16px' }}></div>

          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'users', icon: '👥', label: 'Users' },
            { id: 'withdrawals', icon: '🔄', label: 'Withdrawals' },
            { id: 'transactions', icon: '💳', label: 'Transactions' },
            { id: 'referrals', icon: '🔗', label: 'Referrals' },
          ].map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.88rem',
                color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.25s',
                borderRadius: '10px',
                margin: '2px 10px',
                borderLeft: '2px solid ' + (activeTab === item.id ? '#f5b041' : 'transparent'),
                background: activeTab === item.id ? 'rgba(245, 176, 65, 0.1)' : 'transparent',
              }}
            >
              <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ marginTop: 'auto', padding: '16px 12px' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: '0.88rem',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '36px 40px', overflowY: 'auto' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 600, marginBottom: '8px' }}>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'users' && 'Users Management'}
            {activeTab === 'withdrawals' && 'Withdrawal Requests'}
            {activeTab === 'transactions' && 'Transactions Log'}
            {activeTab === 'referrals' && 'Referral Codes'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '32px' }}>Manage and monitor LoveConnect platform</p>

          {activeTab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '32px' }}>
                {[
                  { num: userCount, label: '👥 Users', color: '#f5b041' },
                  { num: txCount, label: '💳 Transactions', color: '#00e5b0' },
                  { num: totalBTC.toFixed(5), label: '₿ Total BTC', color: '#f5b041' },
                  { num: (db.referrals || []).length, label: '🔗 Ref Codes', color: '#e8a020' },
                ].map((card, i) => (
                  <div key={i} style={{ padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.6rem', fontWeight: 600, lineHeight: 1, color: card.color, marginBottom: '8px' }}>{card.num}</div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.5)' }}>{card.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 600 }}>Recent Users</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Username</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Name</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Balance</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(db.users || {}).slice(0, 5).map(([username, user]) => (
                        <tr key={username} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{username}</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{user.name}</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#f5b041' }}>{(user.balance || 0).toFixed(5)} ₿</td>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{user.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 600 }}>All Users ({userCount})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Username</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Name</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Age</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(db.users || {}).map(([username, user]) => (
                      <tr key={username} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{username}</td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{user.name}</td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{user.age}</td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#f5b041' }}>{(user.balance || 0).toFixed(5)} ₿</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
              <h3 style={{ marginBottom: '20px', fontWeight: 600 }}>Active Referral Codes</h3>
              {(db.referrals || []).map((code, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#f5b041', letterSpacing: '2px' }}>{code}</span>
                  <button onClick={() => navigator.clipboard.writeText(code)} style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}>Copy</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
              {/* Withdrawal Requests */}
              <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 600 }}>Pending Requests ({(db.withdrawals || []).filter(w => w.status === 'pending').length})</h3>
                </div>
                <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
                  {(db.withdrawals || []).filter(w => w.status === 'pending').length === 0 ? (
                    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                      No pending withdrawal requests
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>User</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Amount</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Date</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(db.withdrawals || []).filter(w => w.status === 'pending').map(w => (
                          <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{w.username}</td>
                            <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#00e5b0' }}>{w.amount.toFixed(5)} ₿</td>
                            <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{w.requestedAt}</td>
                            <td style={{ padding: '14px 16px', fontSize: '0.75rem', display: 'flex', gap: '6px' }}>
                              <button onClick={() => handleApproveWithdrawal(w.id)} style={{ padding: '4px 8px', borderRadius: '4px', background: '#00e5b0', border: 'none', color: '#000', cursor: 'pointer', fontWeight: 600 }}>✓ Approve</button>
                              <button onClick={() => handleRejectWithdrawal(w.id)} style={{ padding: '4px 8px', borderRadius: '4px', background: '#ff4757', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>✕ Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Add Balance Form */}
              <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600 }}>Add Balance</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.6)' }}>Username</label>
                    <input
                      type="text"
                      value={addBalanceUser}
                      onChange={(e) => setAddBalanceUser(e.target.value)}
                      placeholder="Enter username"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.6)' }}>Amount (BTC)</label>
                    <input
                      type="number"
                      value={addBalanceAmount}
                      onChange={(e) => setAddBalanceAmount(e.target.value)}
                      placeholder="0.001"
                      step="0.001"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                  <button
                    onClick={handleAddBalance}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #f5b041, #e8a020)',
                      border: 'none',
                      color: '#000',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    💰 Add Balance
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
