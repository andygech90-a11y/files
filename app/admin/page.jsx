'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/src/context/AppContext';

export const dynamic = 'force-dynamic';

const responsiveStyles = `
  @media (max-width: 768px) {
    .admin-header { padding: 16px !important; }
    .admin-header h1 { font-size: 1.4rem !important; }
    .admin-header p { font-size: 0.75rem !important; }
    .admin-tabs { padding: 0 16px !important; gap: 16px !important; overflow-x: auto; }
    .admin-tabs button { padding: 12px 0 !important; font-size: 0.8rem !important; white-space: nowrap; }
    .admin-content { padding: 16px !important; }
    .stats-grid { grid-template-columns: 1fr !important; }
    .withdrawals-layout { grid-template-columns: 1fr !important; }
    .balance-panel { height: auto !important; }
    table { font-size: 0.8rem !important; }
    table td, table th { padding: 12px 8px !important; }
    .button-group { flex-direction: column !important; }
    .button-group button { width: 100% !important; }
    .search-input { max-width: 100% !important; }
  }
  @media (max-width: 480px) {
    .admin-header { padding: 12px !important; }
    .admin-header h1 { font-size: 1.2rem !important; }
    .admin-tabs { padding: 0 12px !important; gap: 8px !important; }
    .admin-tabs button { padding: 10px 0 !important; font-size: 0.75rem !important; }
    .admin-content { padding: 12px !important; }
    table { font-size: 0.75rem !important; }
    table td, table th { padding: 10px 6px !important; }
    .logout-btn { padding: 8px 12px !important; font-size: 0.8rem !important; }
  }
`;

export default function AdminPanelPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchUser, setSearchUser] = useState('');
  const [newBTC, setNewBTC] = useState('');
  const context = useContext(AppContext);
  const router = useRouter();
  
  // State for withdrawal and balance management
  const [addBalanceUser, setAddBalanceUser] = useState('');
  const [addBalanceAmount, setAddBalanceAmount] = useState('');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && context && !context.session?.isAdmin) {
      router.push('/admin-login');
    }
  }, [mounted, context?.session, context, router]);

  if (typeof window === 'undefined' || !mounted || !context) {
    return null;
  }

  const { session, db, logout, saveDB, showToast, approveWithdrawal, rejectWithdrawal, addBalance } = context;

  if (!session?.isAdmin) return null;

  const handleLogout = () => {
    logout();
    router.push('/admin-login');
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
      showToast('❌ Withdrawal rejected - notification sent to user', 'success');
    } else {
      showToast('Failed to reject withdrawal', 'error');
    }
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
      showToast(`✅ Added ${amount} BTC to ${addBalanceUser} - notification sent`, 'success');
      setAddBalanceUser('');
      setAddBalanceAmount('');
    } else {
      showToast('Failed to add balance - user may not exist', 'error');
    }
  };

  const handleUpdateBTC = () => {
    if (!newBTC.trim()) {
      showToast('Please enter a valid BTC address', 'error');
      return;
    }
    const updatedDb = { ...db, adminBTC: newBTC };
    saveDB(updatedDb);
    showToast('BTC address updated successfully', 'success');
    setNewBTC('');
  };

  const handleDeleteUser = (username) => {
    if (confirm(`Are you sure you want to delete user ${username}?`)) {
      const updatedUsers = { ...db.users };
      delete updatedUsers[username];
      const updatedDb = { ...db, users: updatedUsers };
      saveDB(updatedDb);
      showToast(`User ${username} deleted`, 'success');
    }
  };

  const handleResetUserBalance = (username) => {
    if (confirm(`Reset balance for ${username} to 0?`)) {
      const updatedDb = {
        ...db,
        users: {
          ...db.users,
          [username]: { ...db.users[username], balance: 0 }
        }
      };
      saveDB(updatedDb);
      showToast(`Balance reset for ${username}`, 'success');
    }
  };

  const users = db?.users || {};
  const filteredUsers = Object.values(users).filter(u =>
    u.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  const totalBalance = Object.values(users).reduce((sum, u) => sum + (u.balance || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <style>{responsiveStyles}</style>
      
      {/* Header */}
      <div className="admin-header" style={{
        padding: '20px 32px',
        background: 'linear-gradient(135deg, rgba(245, 176, 65, 0.1), rgba(232, 160, 32, 0.05))',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#f5b041' }}>🔐 Admin Panel</h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>Platform Management</p>
        </div>
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            padding: '10px 20px',
            background: 'rgba(255, 100, 100, 0.2)',
            border: '1px solid rgba(255, 100, 100, 0.5)',
            color: '#ff6464',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{
        padding: '0 32px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '32px',
        background: 'rgba(10,10,15,0.5)',
        position: 'sticky',
        top: '80px',
        zIndex: 99,
      }}>
        {['overview', 'users', 'withdrawals', 'transactions', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '16px 0',
              background: 'none',
              border: 'none',
              color: activeTab === tab ? '#f5b041' : 'rgba(255,255,255,0.5)',
              borderBottom: activeTab === tab ? '2px solid #f5b041' : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: '0.95rem',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease',
            }}
          >
            {tab === 'overview' && '📊 '}
            {tab === 'users' && '👥 '}
            {tab === 'withdrawals' && '🔄 '}
            {tab === 'transactions' && '💳 '}
            {tab === 'settings' && '⚙️ '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="admin-content" style={{ padding: '32px' }}>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(245,176,65,0.08)', border: '1px solid rgba(245,176,65,0.3)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontWeight: 500 }}>Total Users</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f5b041', marginBottom: '4px' }}>{Object.keys(users).length}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Active members</div>
              </div>

              <div style={{ background: 'rgba(0,229,176,0.08)', border: '1px solid rgba(0,229,176,0.3)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontWeight: 500 }}>Transactions</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#00e5b0', marginBottom: '4px' }}>{db?.transactions?.length || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Total completed</div>
              </div>

              <div style={{ background: 'rgba(176,78,255,0.08)', border: '1px solid rgba(176,78,255,0.3)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontWeight: 500 }}>Total Balance</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#b04eff', marginBottom: '4px' }}>₿ {totalBalance.toFixed(4)}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Platform total</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', margin: '0 0 16px 0' }}>Platform Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Admin BTC Address</div>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#f5b041', wordBreak: 'break-all' }}>{db?.adminBTC}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Referral Codes</div>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#00e5b0' }}>
                    {(db?.referrals || []).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="search-input"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Username</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Balance</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Joined</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Referral</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', hover: { background: 'rgba(255,255,255,0.03)' } }}>
                          <td style={{ padding: '16px', color: '#f5b041', fontWeight: 500 }}>{user.username}</td>
                          <td style={{ padding: '16px', color: '#00e5b0' }}>₿ {(user.balance || 0).toFixed(4)}</td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{user.joined}</td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.5)' }}>{user.referral}</td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleResetUserBalance(user.username)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(0,229,176,0.15)',
                                border: '1px solid rgba(0,229,176,0.3)',
                                color: '#00e5b0',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                fontSize: '0.8rem',
                              }}
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.username)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(255,100,100,0.15)',
                                border: '1px solid rgba(255,100,100,0.3)',
                                color: '#ff6464',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="withdrawals-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
            {/* Withdrawal Requests */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Pending Withdrawal Requests</h3>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  {(db?.withdrawals || []).filter(w => w.status === 'pending').length === 0 ? (
                    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                      ✓ No pending withdrawal requests
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>User</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Amount</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Date</th>
                          <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(db?.withdrawals || []).filter(w => w.status === 'pending').map((w) => (
                          <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '16px', color: '#f5b041', fontWeight: 500 }}>{w.username}</td>
                            <td style={{ padding: '16px', color: '#00e5b0' }}>₿ {w.amount.toFixed(5)}</td>
                            <td style={{ padding: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{w.requestedAt}</td>
                            <td style={{ padding: '16px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }} className="button-group">
                              <button
                                onClick={() => handleApproveWithdrawal(w.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(0,229,176,0.2)',
                                  border: '1px solid rgba(0,229,176,0.4)',
                                  color: '#00e5b0',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                }}
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleRejectWithdrawal(w.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(255,100,100,0.2)',
                                  border: '1px solid rgba(255,100,100,0.4)',
                                  color: '#ff6464',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                }}
                              >
                                ✕ Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Add Balance Panel */}
            <div className="balance-panel" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', margin: '0 0 16px 0' }}>💰 Add Balance</h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'rgba(255,255,255,0.7)' }}>Username</label>
                <input
                  type="text"
                  value={addBalanceUser}
                  onChange={(e) => setAddBalanceUser(e.target.value)}
                  placeholder="Enter username"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'rgba(255,255,255,0.7)' }}>Amount (BTC)</label>
                <input
                  type="number"
                  value={addBalanceAmount}
                  onChange={(e) => setAddBalanceAmount(e.target.value)}
                  placeholder="0.001"
                  step="0.001"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
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
                  fontSize: '0.9rem',
                }}
              >
                Add Balance & Notify
              </button>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>User</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Type</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Amount</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Date</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db?.transactions || []).length > 0 ? (
                      (db?.transactions || []).map((tx, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '16px', color: '#f5b041', fontWeight: 500 }}>{tx.username}</td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>{tx.type}</td>
                          <td style={{ padding: '16px', color: '#00e5b0' }}>₿ {(tx.amount || 0).toFixed(4)}</td>
                          <td style={{ padding: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{new Date(tx.timestamp).toLocaleDateString()}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '4px',
                              background: tx.status === 'completed' ? 'rgba(0,229,176,0.2)' : 'rgba(245,176,65,0.2)',
                              color: tx.status === 'completed' ? '#00e5b0' : '#f5b041',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                            }}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', margin: '0 0 20px 0' }}>Admin Bitcoin Address</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Current Address</label>
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#f5b041', wordBreak: 'break-all', marginBottom: '16px' }}>
                    {db?.adminBTC}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>New Address</label>
                  <textarea
                    value={newBTC}
                    onChange={(e) => setNewBTC(e.target.value)}
                    placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      minHeight: '80px',
                      fontFamily: 'monospace',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <button
                  onClick={handleUpdateBTC}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #f5b041, #e8a020)',
                    border: 'none',
                    color: '#000',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    width: '100%',
                  }}
                >
                  Update BTC Address
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
