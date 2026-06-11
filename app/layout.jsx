'use client';

import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Toast from './components/Toast';
import '@/src/App.css';
import '@/src/index.css';

export default function RootLayout({ children }) {
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    // Check if user has seen the rules modal before
    const hasSeenRules = localStorage.getItem('hasSeenRulesModal');
    if (!hasSeenRules) {
      localStorage.setItem('hasSeenRulesModal', 'true');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowRulesModal(true);
    }
  }, []);

  useEffect(() => {
    // Prevent background scroll when modal is open
    if (showRulesModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showRulesModal]);

  const handleCloseRulesModal = () => {
    setShowRulesModal(false);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sincere Love Club</title>
      </head>
      <body>
        <AppProvider>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            height: '100vh',
            background: '#000',
            width: '100%',
            padding: 0,
            margin: 0,
            overflow: 'hidden',
          }}>
            <div style={{
              width: '430px',
              maxWidth: '430px',
              height: '100%',
              overflowY: 'auto',
              background: '#0a0a0a',
              boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(245,176,65,0.1)',
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

                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                      <p style={{ marginBottom: '16px', fontWeight: 600, color: '#f5b041' }}>
                        All members are required to complete the Dating Card activation tasks after paying the <strong>$118 membership fee</strong>.
                      </p>

                      <div style={{ background: 'rgba(245,176,65,0.05)', border: '1px solid rgba(245,176,65,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <h4 style={{ color: '#f5b041', marginTop: 0, marginBottom: '12px', fontWeight: 700 }}>📋 Task 1</h4>
                        <p style={{ margin: 0, marginBottom: '8px' }}>Requires: <strong>No additional funds</strong></p>
                        <p style={{ margin: 0 }}>Refund upon completion: <strong style={{ color: '#00e5b0' }}>$79 refund</strong></p>
                      </div>

                      <div style={{ background: 'rgba(0,229,176,0.05)', border: '1px solid rgba(0,229,176,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <h4 style={{ color: '#00e5b0', marginTop: 0, marginBottom: '12px', fontWeight: 700 }}>📋 Task 2</h4>
                        <p style={{ margin: 0, marginBottom: '8px' }}>Requires: <strong>Minimum of $300</strong></p>
                        <p style={{ margin: 0 }}>Refund upon completion: <strong style={{ color: '#00e5b0' }}>$330 refund</strong></p>
                      </div>

                      <div style={{ background: 'rgba(176,78,255,0.05)', border: '1px solid rgba(176,78,255,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <h4 style={{ color: '#b04eff', marginTop: 0, marginBottom: '12px', fontWeight: 700 }}>📋 Task 3</h4>
                        <p style={{ margin: 0, marginBottom: '8px' }}>Requires: <strong>Minimum of $800</strong></p>
                        <p style={{ margin: 0 }}>Refund upon completion: <strong style={{ color: '#b04eff' }}>$880 refund</strong></p>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                          <strong>✅ All funds are refunded after each task is completed.</strong> This is not a profit-making platform; the tasks are designed to activate your Dating Card, and the club provides rewards as an incentive for participation.
                        </p>
                      </div>
                    </div>

                    <button onClick={handleCloseRulesModal} style={{
                      width: '100%', padding: '14px 24px', marginTop: '24px',
                      background: 'linear-gradient(135deg, #f5b041, #e8a020)', border: 'none',
                      borderRadius: '12px', color: '#000', fontWeight: 700, fontSize: '1rem',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                    }}>
                      I Understand & Accept
                    </button>
                  </div>
                </div>
              )}
              
              <Toast />
              {children}
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
