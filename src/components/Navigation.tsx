import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Youtube, Facebook, Music } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const isAdmin = user?.email === "shaagar5@gmail.com";

  const navLinks = [
    { name: 'Home', path: '/', isExternal: false },
    { name: 'Tour', path: '/#tour', isExternal: false },
    { name: 'Gallery', path: '/#gallery', isExternal: false },
    { name: 'Music', path: '/music', isExternal: false },
    { name: 'About', path: '/#about', isExternal: false },
    { name: 'Contact', path: '/#contact', isExternal: false },
  ];

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-10 py-6 border-b",
      scrolled ? "bg-black/95 backdrop-blur-xl py-4 border-white/10" : "bg-transparent border-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center">
          <span className="text-warm-gold uppercase">SOCH</span>
          <span className="text-white">.BAND</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            link.path.startsWith('/#') ? (
              <a
                key={link.name}
                href={link.path}
                className="text-[11px] uppercase tracking-[0.25em] font-medium text-white/60 hover:text-warm-gold transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className="text-[11px] uppercase tracking-[0.25em] font-medium text-white/60 hover:text-warm-gold transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-[11px] uppercase tracking-[0.25em] font-medium text-warm-gold hover:text-white">
              Admin
            </Link>
          )}
          {user ? (
            <button onClick={() => signOut(auth)} className="text-[11px] uppercase tracking-[0.25em] font-medium text-white/60 hover:text-red-500 transition-colors">
              Sign Out
            </button>
          ) : (
             <button onClick={handleLogin} className="text-[11px] uppercase tracking-[0.25em] font-medium text-white/60 hover:text-warm-gold transition-colors">
               Login
             </button>
          )}
          <a href="/#contact" className="px-6 py-2 border border-warm-gold text-warm-gold text-[10px] font-bold uppercase tracking-widest hover:bg-warm-gold hover:text-black transition-all">
            Book
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-zinc-950 border-t border-zinc-900 p-6 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-zinc-300"
              >
                {link.name}
              </a>
            ))}
            {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-medium text-warm-gold">Admin</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
