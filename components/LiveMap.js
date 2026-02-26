'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';
import { DEEP_LINKS } from '@/lib/data';

export default function LiveMap() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const wazeNavLink = (lat, lon) => `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;

  return (
    <section id="livemap" style={{ padding: '100px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-badge" style={{ background: `${C.green}15`, color: C.green }}>{t('map.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
            {t('map.title')}
          </h2>
          <p style={{ color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            {t('map.subtitle')}
          </p>
        </div>
        <div className="livemap-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: '2px solid #eee', background: '#e8e8e8',
            aspectRatio: '16/10', minHeight: 400,
          }}>
            {isOnline ? (
              <iframe
                src={CONFIG.map.iframeSrc}
                width="100%" height="100%"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen
                title="Waze Live Map Libreville"
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center', color: C.muted }}>
                {t('map.offlineMessage')}
              </div>
            )}
          </div>
          <div>
            <h3 className="heading" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: C.text }}>
              {'\u{1F3AF}'} {t('map.navigateTo')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEEP_LINKS.map((link) => (
                <a key={link.key} href={wazeNavLink(link.lat, link.lon)} {...externalLinkProps} className="deep-link-card">
                  <span style={{ fontSize: 24 }}>{link.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t(`map.${link.key}.name`)}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{t('map.openInWaze')} {'\u2192'}</div>
                  </div>
                </a>
              ))}
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 16, lineHeight: 1.6, padding: '0 4px' }}>
              {'\u{1F4A1}'} {t('map.deepLinkHint')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
