'use client';

import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';
import { HERO_STATS } from '@/lib/data';

export default function Hero() {
  const { t } = useTranslation();

  const scrollTo = (id) => (e) => {
    e?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" style={{
      position: 'relative', overflow: 'hidden', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0a1628 0%, #0f2847 30%, #0d4a3a 60%, #1a3a1a 100%)',
      padding: '120px 24px 80px',
    }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%`,
          width: 6 + i * 3, height: 6 + i * 3, borderRadius: '50%',
          background: `radial-gradient(circle, ${[C.waze, C.green, C.yellow, C.blue][i % 4]}40, transparent)`,
          animation: `float ${4 + i * 0.8}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }} />
      ))}

      <div style={{ textAlign: 'center', maxWidth: 820, position: 'relative', zIndex: 2 }}>
        <div className="anim-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,.08)', borderRadius: 50,
          padding: '10px 24px', marginBottom: 32,
          border: '1px solid rgba(255,255,255,.12)',
        }}>
          <span style={{ fontSize: 20 }}>{'\u{1F1EC}\u{1F1E6}'}</span>
          <span style={{ color: 'rgba(255,255,255,.9)', fontSize: 14, fontWeight: 500 }}>
            {t('hero.badge')}
          </span>
        </div>

        <h1 className="heading anim-up-1" style={{
          fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', fontWeight: 900,
          lineHeight: 1.08, color: '#fff', marginBottom: 24,
        }}>
          {t('hero.title.line1')}{' '}
          <span style={{ color: C.waze }}>{t('hero.title.highlight1')}</span>
          <br />{t('hero.title.line2')}{' '}
          <span style={{ color: C.green }}>{t('hero.title.highlight2')}</span>{' '}
          <span style={{ display: 'inline-block', animation: 'float 3s ease-in-out infinite' }}>{'\u{1F697}'}</span>
        </h1>

        <p className="anim-up-2" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: 'rgba(255,255,255,.7)', maxWidth: 600,
          margin: '0 auto 40px', lineHeight: 1.8,
        }}>
          {t('hero.subtitle')}
        </p>

        <div className="anim-up-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#tutorials" onClick={scrollTo('tutorials')} className="waze-btn waze-btn-primary" style={{ fontSize: 17, padding: '16px 32px' }}>
            {'\u{1F4D6}'} {t('hero.cta.tutorials')}
          </a>
          <a href={CONFIG.links.whatsapp} {...externalLinkProps} className="waze-btn waze-btn-whatsapp">
            {'\u{1F4AC}'} {t('hero.cta.whatsapp')}
          </a>
          <a href="#community" onClick={scrollTo('community')} className="waze-btn waze-btn-outline">
            {'\u{1F465}'} {t('hero.cta.join')}
          </a>
        </div>

        <div className="anim-up-3" style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}>
          {HERO_STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="heading" style={{ fontSize: '2rem', fontWeight: 900, color: C.waze }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', fontWeight: 500 }}>{t(s.key)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: -1, left: 0, right: 0, height: 80,
        background: C.bg,
        clipPath: 'polygon(0 70%, 100% 0, 100% 100%, 0 100%)',
      }} />
    </section>
  );
}
