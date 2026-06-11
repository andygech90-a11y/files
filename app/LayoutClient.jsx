'use client';

import { useState, useEffect } from 'react';
import { AppProvider } from '@/src/context/AppContext';

const RULES_MODAL_SEEN_KEY = 'sincere-love-rules-seen';

export default function LayoutClient({ children }) {
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [isAdminPath, setIsAdminPath] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(RULES_MODAL_SEEN_KEY);
    if (!seen) {
      setShowRulesModal(true);
    }
    // Detect admin route and expand layout for admin pages
    try {
      const path = window.location.pathname || '';
      if (path.startsWith('/admin')) setIsAdminPath(true);
    } catch (e) {
      console.error('Failed to detect admin path', e);
    }
  }, []);

  useEffect(() => {
    // Prevent background scroll when modal is open
    if (typeof window !== 'undefined') {
      if (showRulesModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [showRulesModal]);

  const handleCloseRulesModal = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(RULES_MODAL_SEEN_KEY, 'true');
    }
    setShowRulesModal(false);
  };

  return (
    <AppProvider>
      <div style={{
        display: 'flex',
        justifyContent: isAdminPath ? 'flex-start' : 'center',
        alignItems: 'stretch',
        height: '100vh',
        background: '#000',
        width: '100%',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          width: isAdminPath ? '100%' : '430px',
          maxWidth: isAdminPath ? '100%' : '430px',
          height: '100%',
          overflowY: 'auto',
          background: isAdminPath ? '#07060a' : '#0a0a0a',
          boxShadow: isAdminPath ? 'none' : '0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(245,176,65,0.1)',
          position: 'relative',
        }}>

          {/* Rules Modal */}
          {showRulesModal && (
            <div style={{
              position: 'sticky', inset: 0, zIndex: 2000,
              width: '420px', maxWidth: '420px',
              height: '100%',
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                background: 'rgba(10, 4, 20, 0.95)', border: '1px solid rgba(245,176,65,0.3)',
                borderRadius: '16px', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto',
                padding: '32px 24px', backdropFilter: 'blur(20px)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>💗 Dating Card Activation Rules</h2>
                  <button onClick={handleCloseRulesModal} style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                    fontSize: '1.5rem', cursor: 'pointer', padding: 0, width: '32px', height: '32px',
                  }}>×</button>
                </div>

                <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                  <p style={{ marginBottom: '12px' }}>
                    All members are required to complete the Dating Card activation tasks after paying the <strong>$118 membership fee</strong>.
                  </p>

                  <ol style={{ marginLeft: '18px', marginBottom: '12px' }}>
                    <li style={{ marginBottom: '8px' }}>
                      First task: requires no additional funds. Upon completion you will receive a <strong>$79 refund</strong>.
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      Second task: requires a minimum of <strong>$300</strong>. Upon completion you will receive a <strong>$330 refund</strong>.
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      Third task: requires a minimum of <strong>$800</strong>. Upon completion you will receive a <strong>$880 refund</strong>.
                    </li>
                  </ol>

                  <p style={{ marginBottom: '12px' }}>
                    All funds are refunded after each task is completed. These tasks are designed to activate your Dating Card — this is <strong>not</strong> a profit-making platform. The Club provides rewards as an incentive for participation.
                  </p>

                  <p style={{ marginBottom: '6px', color: 'rgba(245,176,65,0.95)', fontWeight: 700 }}>
                    Please review each task carefully before participating.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
                    <button onClick={handleCloseRulesModal} style={{
                      background: 'rgba(245,176,65,0.95)', color: '#09060a', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer'
                    }}>I Understand</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </AppProvider>
  );
}
