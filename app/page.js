'use client';

import { useState } from 'react';
import FLAGS from '@/lib/flags';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Download from '@/components/Download';
import Tutorials from '@/components/Tutorials';
import LiveMap from '@/components/LiveMap';
import Community from '@/components/Community';
import Articles from '@/components/Articles';
import FAQ from '@/components/FAQ';
import Privacy from '@/components/Privacy';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import InstallPWA from '@/components/InstallPWA';
import RegisterModal from '@/components/RegisterModal';
import DebugPanel from '@/components/DebugPanel';

export default function HomePage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation onOpenRegister={() => setShowRegister(true)} />
      {FLAGS.hero && <Hero />}
      {FLAGS.features && <Features />}
      {FLAGS.download && <Download />}
      {FLAGS.tutorials && <Tutorials />}
      {FLAGS.livemap && <LiveMap />}
      {FLAGS.community && <Community />}
      {FLAGS.articles && <Articles />}
      {FLAGS.faq && <FAQ />}
      {FLAGS.privacySection && <Privacy />}
      {FLAGS.footer && <Footer />}
      {FLAGS.floatingWhatsapp && <FloatingWhatsApp />}
      <InstallPWA />
      {FLAGS.registerModal && <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} />}
      <DebugPanel />
    </div>
  );
}
