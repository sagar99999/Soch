/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Music from './pages/Music';

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titleMap: Record<string, string> = {
      '/': 'Soch Band',
      '/music': 'Soch Band | Music',
      '/admin': 'Soch Band | Admin',
    };

    const newTitle = titleMap[location.pathname] || 'Soch Band';
    document.title = newTitle;

    // Update Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', newTitle);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <TitleUpdater />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-warm-gold selection:text-black">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/music" element={<Music />} />
          </Routes>
        </main>
        <footer className="w-full px-10 py-6 bg-neutral-950 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] italic font-serif">
            Cultural Heart. Modern Soul.
          </p>
          <div className="flex gap-8">
            <a href="https://www.instagram.com/soch___band/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-neutral-400 uppercase tracking-widest hover:text-warm-gold transition-colors">Instagram</a>
            <a href="https://www.youtube.com/channel/UC2diELzRtJ1IqufMwej-4UQ" target="_blank" rel="noopener noreferrer" className="text-[10px] text-neutral-400 uppercase tracking-widest hover:text-warm-gold transition-colors">Youtube</a>
            <a href="https://open.spotify.com/artist/3J1fiPiGLoctMaZQQl0DJs" target="_blank" rel="noopener noreferrer" className="text-[10px] text-neutral-400 uppercase tracking-widest hover:text-warm-gold transition-colors">Spotify</a>
            <a href="#" className="text-[10px] text-neutral-400 uppercase tracking-widest hover:text-warm-gold transition-colors">Facebook</a>
          </div>
          <p className="text-[10px] text-neutral-600 tracking-widest uppercase">
            © 2026 SOCH BAND OFFICIAL
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

