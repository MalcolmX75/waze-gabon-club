'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { externalLinkProps } from '@/utils/externalLink';
import { ARTICLES } from '@/lib/data';
import { getArticles } from '@/app/actions/articles';

export default function Articles() {
  const { t } = useTranslation();
  const [dbArticles, setDbArticles] = useState(null);

  useEffect(() => {
    getArticles().then((data) => {
      if (data && data.length > 0) setDbArticles(data);
    });
  }, []);

  // DB articles: render title/desc directly (not i18n keys)
  // Fallback: render from hardcoded ARTICLES with i18n keys
  const useDb = dbArticles !== null;

  return (
    <section id="articles" style={{ padding: '100px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-badge" style={{ background: `${C.yellow}30`, color: '#b8860b' }}>{t('articles.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
            {t('articles.title')}
          </h2>
          <p style={{ color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            {t('articles.subtitle')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {useDb ? (
            dbArticles.map((a) => (
              <a key={a.url} href={a.url} {...externalLinkProps} className="card-lift"
                style={{
                  background: '#fff', borderRadius: 20, padding: 28,
                  border: '1px solid #eee', textDecoration: 'none', color: C.text,
                  display: 'flex', flexDirection: 'column',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                    {formatDate(a.published_at)} {'\u00B7'} {a.source}
                  </span>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 11,
                    fontWeight: 700, background: `${C.waze}15`, color: C.blue,
                  }}>{a.tag}</span>
                </div>
                <h3 className="heading" style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>
                  {a.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, flex: 1 }}>
                  {a.description}
                </p>
                <div style={{ marginTop: 16, fontSize: 13, color: C.waze, fontWeight: 600 }}>
                  {t('articles.readMore')} {'\u2192'}
                </div>
              </a>
            ))
          ) : (
            ARTICLES.map((a) => (
              <a key={a.key} href={a.url} {...externalLinkProps} className="card-lift"
                style={{
                  background: '#fff', borderRadius: 20, padding: 28,
                  border: '1px solid #eee', textDecoration: 'none', color: C.text,
                  display: 'flex', flexDirection: 'column',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                    {t(`articles.${a.key}.date`)} {'\u00B7'} {t(`articles.${a.key}.source`)}
                  </span>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 11,
                    fontWeight: 700, background: `${C.waze}15`, color: C.blue,
                  }}>{t(`articles.${a.key}.tag`)}</span>
                </div>
                <h3 className="heading" style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>
                  {t(`articles.${a.key}.title`)}
                </h3>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, flex: 1 }}>
                  {t(`articles.${a.key}.desc`)}
                </p>
                <div style={{ marginTop: 16, fontSize: 13, color: C.waze, fontWeight: 600 }}>
                  {t('articles.readMore')} {'\u2192'}
                </div>
              </a>
            ))
          )}
        </div>

        <div style={{
          marginTop: 40, background: C.bg, borderRadius: 20,
          padding: 36, border: '1px solid #eee',
        }}>
          <h3 className="heading" style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
            {'\u{1F4C5}'} {t('articles.calendar.title')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { key: 'monday', color: C.waze },
              { key: 'wednesday', color: C.danger },
              { key: 'friday', color: C.green },
              { key: 'sunday', color: '#7c3aed' },
            ].map((day) => (
              <div key={day.key} style={{
                padding: 20, borderRadius: 14, background: '#fff',
                border: `1px solid ${day.color}20`,
              }}>
                <div style={{ fontSize: 14, color: C.muted }}>{t(`articles.calendar.${day.key}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}
