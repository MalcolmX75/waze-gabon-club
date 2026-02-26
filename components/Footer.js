'use client';

import { useTranslation } from '@/lib/i18n';
import { useFlags } from '@/lib/flags';
import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';

export default function Footer() {
  const { t } = useTranslation();
  const flags = useFlags();

  const scrollTo = (id) => (e) => {
    e?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{ background: C.dark, color: 'rgba(255,255,255,.7)', padding: '64px 24px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 40 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: `linear-gradient(135deg, ${C.waze}, ${C.green})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 17, fontFamily: "'Outfit', sans-serif",
              }}>W</div>
              <span className="heading" style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Waze Gabon Club</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              {t('footer.description')}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: CONFIG.links.whatsapp, bg: C.whatsapp, icon: '\u{1F4AC}' },
                { href: CONFIG.links.telegram, bg: C.telegram, icon: '\u2708\u{FE0F}' },
                { href: CONFIG.links.facebook, bg: C.facebook, icon: '\u{1F4D8}' },
              ].map((s, i) => (
                <a key={i} href={s.href} {...externalLinkProps}
                  style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: 18 }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="heading" style={{ color: '#fff', fontWeight: 600, marginBottom: 14, fontSize: 15 }}>{t('footer.links.title')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              {[
                { url: CONFIG.waze.officialUrl, key: 'footer.waze.official' },
                { url: CONFIG.waze.editorUrl, key: 'footer.waze.editor' },
                { url: CONFIG.waze.blogUrl, key: 'footer.waze.blog' },
                { url: CONFIG.waze.forumUrl, key: 'footer.waze.forum' },
              ].map((link) => (
                <a key={link.key} href={link.url} {...externalLinkProps}
                  style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none', transition: 'color .2s' }}>
                  {t(link.key)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="heading" style={{ color: '#fff', fontWeight: 600, marginBottom: 14, fontSize: 15 }}>{t('footer.download.title')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <a href={CONFIG.waze.appStoreUrl} {...externalLinkProps}
                style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>
                {'\u{1F34E}'} {t('footer.download.ios')}
              </a>
              <a href={CONFIG.waze.playStoreUrl} {...externalLinkProps}
                style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>
                {'\u{1F916}'} {t('footer.download.android')}
              </a>
            </div>
          </div>
        </div>

        <div className="flag-stripe" style={{ borderRadius: 2, marginBottom: 20 }} />

        <div style={{
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
          gap: 12, fontSize: 13, color: 'rgba(255,255,255,.35)',
        }}>
          <span>{t('footer.copyright')}</span>
          <span>{t('footer.trademark')}</span>
        </div>

        {flags.privacySection && (
          <div style={{ marginTop: 12 }}>
            <a href="#privacy" onClick={scrollTo('privacy')}
              style={{ color: 'rgba(255,255,255,.35)', fontSize: 13, textDecoration: 'none' }}>
              {t('privacy.title')}
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
