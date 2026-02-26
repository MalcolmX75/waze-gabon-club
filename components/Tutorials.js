'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { TUTORIALS } from '@/lib/data';

export default function Tutorials() {
  const { t } = useTranslation();
  const [openTutorial, setOpenTutorial] = useState(null);

  return (
    <section id="tutorials" style={{ padding: '100px 24px', background: C.bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-badge" style={{ background: `${C.blue}15`, color: C.blue }}>{t('tutorials.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
            {t('tutorials.title')}
          </h2>
          <p style={{ color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            {t('tutorials.subtitle')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {TUTORIALS.map((tuto) => (
            <div key={tuto.id} style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              border: openTutorial === tuto.id ? `2px solid ${tuto.color}` : '1px solid #eee',
              transition: 'all .3s ease',
            }}>
              <button onClick={() => setOpenTutorial(openTutorial === tuto.id ? null : tuto.id)}
                style={{
                  width: '100%', padding: 24, background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                  textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: `${tuto.color}12`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>{tuto.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 className="heading" style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{t(`tutorials.${tuto.id}.title`)}</h3>
                  <p style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{t(`tutorials.${tuto.id}.subtitle`)}</p>
                </div>
                <span style={{
                  transform: openTutorial === tuto.id ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform .3s ease', color: tuto.color, fontSize: 18,
                }}>{'\u25BC'}</span>
              </button>
              {openTutorial === tuto.id && (
                <div style={{ padding: '0 20px 24px', animation: 'fadeUp .4s ease both' }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="tutorial-step">
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${tuto.color}, ${tuto.color}cc)`,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 15, fontFamily: "'Outfit', sans-serif",
                      }}>{step}</div>
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: C.text }}>
                          {t(`tutorials.${tuto.id}.step${step}.title`)}
                        </h4>
                        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                          {t(`tutorials.${tuto.id}.step${step}.desc`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
