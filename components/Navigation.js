'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useFlags } from '@/lib/flags';
import C from '@/lib/colors';
import { NAV_ITEMS } from '@/lib/data';

export default function Navigation({ onOpenRegister }) {
  const { t, lang, setLang } = useTranslation();
  const flags = useFlags();
  const [scrollY, setScrollY] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id) => (e) => {
    e?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowMobileMenu(false);
  };

  return (
    <>
      <div className="flag-stripe" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001 }} />

      <nav style={{
        position: 'fixed', top: 4, left: 0, right: 0, zIndex: 1000,
        background: scrollY > 50 ? 'rgba(255,255,255,.96)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(0,0,0,.06)' : 'none',
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all .3s ease',
      }}>
        <a href="#home" onClick={scrollTo('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.waze}, ${C.green})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 20, fontFamily: "'Outfit', sans-serif",
          }}>W</div>
          <div>
            <div className="heading" style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1, color: scrollY > 50 ? C.text : '#fff' }}>
              Waze Gabon
            </div>
            <div style={{ fontSize: 11, color: scrollY > 50 ? C.muted : 'rgba(255,255,255,.7)', fontWeight: 500 }}>
              Club Communautaire
            </div>
          </div>
        </a>

        <div className="hide-mobile" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={scrollTo(item.id)} className="nav-link"
              style={{ color: scrollY > 50 ? undefined : 'rgba(255,255,255,.85)' }}>
              {t(item.key)}
            </a>
          ))}
          {flags.languageSwitcher && (
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              style={{
                padding: '8px 14px', border: `2px solid ${scrollY > 50 ? C.green : 'rgba(255,255,255,.3)'}`,
                borderRadius: 8, background: 'transparent',
                color: scrollY > 50 ? C.green : '#fff', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              }}>
              {t('nav.langSwitch')}
            </button>
          )}
          {flags.registerModal && (
            <button onClick={() => onOpenRegister?.()} className="waze-btn waze-btn-primary"
              style={{ padding: '10px 20px', fontSize: 13, marginLeft: 8 }}>
              {t('nav.register')}
            </button>
          )}
        </div>

        <button className="show-mobile" onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, fontSize: 24,
            color: scrollY > 50 ? C.text : '#fff', display: 'none' }}>
          {showMobileMenu ? '\u2715' : '\u2630'}
        </button>
      </nav>

      {showMobileMenu && (
        <div className="mobile-menu">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={scrollTo(item.id)}
              style={{ display: 'block', padding: '12px 0', color: C.text, textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>
              {t(item.key)}
            </a>
          ))}
          {flags.languageSwitcher && (
            <button onClick={() => { setLang(lang === 'fr' ? 'en' : 'fr'); setShowMobileMenu(false); }}
              style={{ display: 'block', padding: '12px 0', background: 'none', border: 'none', color: C.green, fontWeight: 600, cursor: 'pointer', fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
              {t('nav.langSwitch')}
            </button>
          )}
          {flags.registerModal && (
            <button onClick={() => { onOpenRegister?.(); setShowMobileMenu(false); }}
              className="waze-btn waze-btn-primary" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
              {t('nav.register')}
            </button>
          )}
        </div>
      )}
    </>
  );
}
