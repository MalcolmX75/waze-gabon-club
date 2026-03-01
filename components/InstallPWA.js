'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';

export default function InstallPWA() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS (no beforeinstallprompt support)
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    // Listen for install prompt (Chrome/Edge/Samsung/etc.)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
    } else {
      // Show modal with instructions (iOS or fallback)
      setShowModal(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Install Button — positioned above WhatsApp */}
      <button
        onClick={handleInstall}
        className="pwa-install-btn"
        aria-label={t('pwa.install')}
        style={{
          position: 'fixed', bottom: 96, right: 24,
          width: 56, height: 56, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.waze}, ${C.blue})`,
          color: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 24px ${C.waze}50`, zIndex: 998,
          fontSize: 24,
          transition: 'transform .3s ease, box-shadow .3s ease',
        }}>
        {'\u{1F4F2}'}
      </button>

      {/* Install Modal */}
      {showModal && (
        <div className="register-modal" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 24, padding: '36px 32px',
            maxWidth: 400, width: 'calc(100% - 48px)',
            animation: 'fadeUp .3s ease both',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{'\u{1F4F2}'}</div>
              <h3 className="heading" style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                {t('pwa.modal.title')}
              </h3>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
                {t('pwa.modal.subtitle')}
              </p>

              {isIOS ? (
                <div style={{ textAlign: 'left' }}>
                  {[
                    { step: '1', icon: '\u{1F310}', text: t('pwa.ios.step1') },
                    { step: '2', icon: '\u2B06\uFE0F', text: t('pwa.ios.step2') },
                    { step: '3', icon: '\u2795', text: t('pwa.ios.step3') },
                  ].map((s) => (
                    <div key={s.step} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', marginBottom: 8,
                      background: '#f8f9fa', borderRadius: 14,
                    }}>
                      <span style={{ fontSize: 24 }}>{s.icon}</span>
                      <span style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'left' }}>
                  {[
                    { step: '1', icon: '\u22EE', text: t('pwa.android.step1') },
                    { step: '2', icon: '\u{1F4F2}', text: t('pwa.android.step2') },
                    { step: '3', icon: '\u2705', text: t('pwa.android.step3') },
                  ].map((s) => (
                    <div key={s.step} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', marginBottom: 8,
                      background: '#f8f9fa', borderRadius: 14,
                    }}>
                      <span style={{ fontSize: 24, width: 32, textAlign: 'center' }}>{s.icon}</span>
                      <span style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setShowModal(false)}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  marginTop: 20, background: 'none', border: 'none',
                  color: C.muted, cursor: 'pointer', fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                {t('pwa.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
