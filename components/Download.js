'use client';

import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';

function AppStoreBadge() {
  return (
    <svg viewBox="0 0 120 40" width="135" height="45" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Download on the App Store">
      <rect width="120" height="40" rx="6" fill="#000" />
      <path d="M24.77 20.3a4.95 4.95 0 0 1 2.36-4.15 5.07 5.07 0 0 0-3.99-2.16c-1.68-.18-3.31 1.01-4.17 1.01-.87 0-2.18-.99-3.59-.96a5.31 5.31 0 0 0-4.47 2.72c-1.93 3.34-.49 8.27 1.36 10.97.93 1.33 2.02 2.81 3.43 2.76 1.39-.06 1.91-.88 3.58-.88 1.67 0 2.15.88 3.59.85 1.48-.02 2.43-1.33 3.33-2.67a11.05 11.05 0 0 0 1.51-3.1 4.78 4.78 0 0 1-2.94-4.39z" fill="#fff" />
      <path d="M22.04 12.21a4.87 4.87 0 0 0 1.12-3.49 4.96 4.96 0 0 0-3.21 1.66 4.64 4.64 0 0 0-1.15 3.36 4.1 4.1 0 0 0 3.24-1.53z" fill="#fff" />
      <text fill="#fff" fontFamily="Arial,sans-serif" fontSize="8" x="42" y="15">Download on the</text>
      <text fill="#fff" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="bold" x="42" y="31">App Store</text>
    </svg>
  );
}

function GooglePlayBadge() {
  return (
    <svg viewBox="0 0 135 40" width="152" height="45" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Get it on Google Play">
      <rect width="135" height="40" rx="6" fill="#000" />
      <path d="M14.5 7.8c-.3.3-.5.8-.5 1.4v21.6c0 .6.2 1.1.5 1.4l.1.1 12.1-12.1v-.3L14.5 7.8z" fill="#4285F4" />
      <path d="M30.7 24.2l-4-4v-.3l4-4 .1.1 4.8 2.7c1.4.8 1.4 2 0 2.8l-4.8 2.7h-.1z" fill="#FBBC04" />
      <path d="M30.8 24.1L26.7 20 14.5 32.2c.5.5 1.2.5 2.1.1l14.2-8.2" fill="#EA4335" />
      <path d="M30.8 15.9L16.6 7.7c-.9-.5-1.7-.4-2.1.1L26.7 20l4.1-4.1z" fill="#34A853" />
      <text fill="#fff" fontFamily="Arial,sans-serif" fontSize="7.5" x="46" y="14">GET IT ON</text>
      <text fill="#fff" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="bold" x="46" y="30">Google Play</text>
    </svg>
  );
}

export default function Download() {
  const { t } = useTranslation();

  return (
    <section id="download" style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-badge" style={{ background: `${C.green}15`, color: C.green }}>{t('download.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
            {t('download.title')}
          </h2>
          <p style={{ color: C.muted, maxWidth: 520, margin: '12px auto 0', lineHeight: 1.8 }}>{t('download.subtitle')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { key: 'ios', title: 'iPhone & iPad', req: 'iOS 15+ \u00B7 CarPlay', url: CONFIG.waze.appStoreUrl, bg: `linear-gradient(135deg, ${C.waze}, ${C.blue})`, Badge: AppStoreBadge },
            { key: 'android', title: 'Android', req: 'Android 10+ \u00B7 Android Auto', url: CONFIG.waze.playStoreUrl, bg: `linear-gradient(135deg, ${C.green}, #00c853)`, Badge: GooglePlayBadge },
          ].map((d) => (
            <div key={d.key} className="card-lift" style={{ background: '#fff', borderRadius: 24, padding: '36px 28px', textAlign: 'center', border: '1px solid #eee' }}>
              <div style={{ marginBottom: 20 }}>
                <d.Badge />
              </div>
              <h3 className="heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{d.title}</h3>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>{d.req}</p>
              <a href={d.url} {...externalLinkProps} className="waze-btn"
                style={{ background: d.bg, color: '#fff', width: '100%', justifyContent: 'center' }}>
                {t('download.cta')} {'\u2197'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
