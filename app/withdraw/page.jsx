'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/src/context/AppContext';



export default function WithdrawPage() {

  return (
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
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: '#f5b041',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <span style={{ fontSize: '1rem', fontWeight: 600 }}>Request Withdrawal</span>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Content */}
      <div className="withdraw-content" style={{ padding: '24px 16px' }}>
        {/* Balance Info */}
        <div
          className="balance-card"
          style={{
            background: 'rgba(245,176,65,0.1)',
            border: '1px solid rgba(245,176,65,0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '8px',
            }}
          >
            Available Balance
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f5b041, #e8a020)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {user.balance.toFixed(6)} BTC
          </div>
        </div>

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
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>💰 Withdrawal Details</h2>

          {/* Amount Input */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
              Withdrawal Amount (BTC)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              max={user.balance}
              placeholder="Enter amount in BTC"
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
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Max: {user.balance.toFixed(6)} BTC
            </div>
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
            disabled={loading || !amount}
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
              opacity: loading || !amount ? 0.6 : 1,
              marginBottom: '12px',
            }}
          >
            {loading ? '⏳ Processing...' : '📤 Submit Withdrawal Request'}
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => router.back()}
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
  );
}
