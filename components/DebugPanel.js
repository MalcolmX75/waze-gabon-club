'use client';

import { useEffect, useState } from 'react';
import FLAGS, { useFlags } from '@/lib/flags';

export default function DebugPanel() {
  const flags = useFlags();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShow(FLAGS.debugPanel && params.get('debug') === 'flags');
  }, []);

  if (!show) return null;

  const entries = Object.entries(flags);
  const enabled = entries.filter(([, v]) => v).length;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#0a1628', color: '#e2e8f0', fontFamily: 'monospace',
      fontSize: '0.75rem', padding: '0.75rem 1rem', maxHeight: '40vh',
      overflowY: 'auto', borderTop: '2px solid #009E49',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <strong style={{ color: '#009E49' }}>Feature Flags Debug</strong>
        <span style={{ color: '#64748b' }}>{enabled}/{entries.length} enabled</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.25rem' }}>
        {entries.map(([key, value]) => (
          <div key={key} style={{ color: value ? '#10b981' : '#ef4444' }}>
            {value ? '\u2705' : '\u274C'} {key}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.5rem', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '0.5rem' }}>
        Build: {new Date().toISOString().slice(0, 10)} | Next.js
      </div>
    </div>
  );
}
