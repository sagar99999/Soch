import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, Music as MusicIcon, Users, Image as ImageIcon, MessageSquare, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import Hero from '../components/Hero';
import { EventEntry, BandMember, GalleryImage } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function Home() {
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [members, setMembers] = useState<BandMember[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventEntry)));
      setLoadingEvents(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'events');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
      setLoadingGallery(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'gallery');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'members'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BandMember)));
      setLoadingMembers(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'members');
    });
    return () => unsubscribe();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'fanMessages'), {
        ...contactForm,
        createdAt: new Date().toISOString()
      });
      setSent(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'fanMessages');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-0">
      <Hero />

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <span className="text-warm-gold text-xs uppercase tracking-[0.4em] font-bold">Our Story</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              ROOTED IN <span className="italic font-light text-zinc-400 font-serif">TRADITION</span>, DRIVEN BY <span className="text-warm-gold">MODERNITY</span>.
            </h2>
            <div className="space-y-6 text-zinc-400 leading-relaxed font-light text-lg">
              <p>
                Soch Band emerged from the vibrant streets of Kathmandu, carrying the echoes of traditional Nepali instruments and the raw energy of contemporary rock. 
              </p>
              <p>
                Our music is a reflection of the dual identity we live—respecting the deep cultural roots that define us, while embracing the global sounds that move us. Every performance is an immersive storytelling experience.
              </p>
            </div>
            <button className="text-warm-gold border-b border-warm-gold py-2 hover:text-white hover:border-white transition-all text-sm tracking-widest font-bold">
              LEARN MORE ABOUT OUR JOURNEY
            </button>
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="flex-1 relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://i.scdn.co/image/ab6761670000ecd443c88fb1b53ee89b2a2bdabf" 
                alt="Soch Band members" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-warm-gold text-black p-8 rounded-2xl hidden md:block max-w-[240px]">
              <p className="text-sm font-bold uppercase tracking-widest mb-2">Artistic Vision</p>
              <p className="text-xs leading-relaxed opacity-80 italic italic">"We don't just play music, we communicate emotions that words cannot define."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tour Dates Section */}
      <section id="tour" className="py-24 px-10 bg-neutral-900/40 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">UPCOMING <span className="text-warm-gold">TOUR</span></h2>
            <a href="#" className="text-[10px] text-warm-gold underline tracking-[0.2em] font-bold">VIEW ALL DATES</a>
          </div>

          <div className="divide-y divide-white/5">
            {loadingEvents ? (
              <div className="h-64 flex items-center justify-center text-zinc-600">Loading tour dates...</div>
            ) : events.length > 0 ? (
              events.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex flex-col md:flex-row items-center justify-between py-8 px-4 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left w-full">
                    {event.imageUrl ? (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10 hidden md:block group-hover:border-warm-gold transition-colors">
                        <img src={event.imageUrl} alt={event.city} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="min-w-[100px]">
                        <p className="text-warm-gold text-xs font-mono tracking-widest uppercase mb-1">
                          {format(new Date(event.date), 'MMM dd')}
                        </p>
                        <p className="text-[10px] text-zinc-600 font-mono italic">{format(new Date(event.date), 'yyyy')}</p>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-warm-gold text-[10px] font-mono tracking-widest uppercase mb-1 md:hidden">
                        {format(new Date(event.date), 'MMM dd')}
                      </p>
                      <p className="text-xl md:text-2xl font-bold tracking-tight uppercase group-hover:text-warm-gold transition-colors">{event.city}</p>
                      <p className="text-neutral-500 text-sm tracking-widest uppercase">{event.venue}</p>
                    </div>
                  </div>
                  <div className="mt-8 md:mt-0 flex items-center gap-6">
                    {event.status === 'upcoming' ? (
                       <a 
                        href={event.ticketUrl} 
                        className="px-8 py-3 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all whitespace-nowrap"
                       >
                         RESERVE SEAT
                       </a>
                    ) : (
                      <span className="text-zinc-600 uppercase tracking-[0.3em] text-[10px] font-bold border border-zinc-900 px-6 py-2">
                        {event.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-64 flex items-center justify-center border border-dashed border-white/5 rounded-sm">
                <p className="text-zinc-500 text-xs italic tracking-widest uppercase">No Active Tours Announced</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      <section id="gallery" className="py-24 px-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
           <div className="mb-12 border-l-4 border-warm-gold pl-6">
              <h2 className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase mb-2">Gallery // Moments</h2>
              <p className="text-3xl md:text-4xl font-black uppercase tracking-tighter">THE VISUAL ARCHIVE</p>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingGallery ? (
                <div className="col-span-full h-64 flex items-center justify-center text-zinc-600">Loading archives...</div>
              ) : gallery.length > 0 ? (
                gallery.map((img, i) => (
                  <div key={img.id} className={cn(
                    "relative group overflow-hidden bg-neutral-900 border border-white/5",
                    i % 6 === 2 && "col-span-2 row-span-2 aspect-[4/5] md:aspect-auto", // Make some larger
                    i % 6 !== 2 && "aspect-square"
                  )}>
                    <img 
                      src={img.url} 
                      className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 object-cover scale-100 group-hover:scale-105"
                      alt={img.caption || `Moment ${i + 1}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-warm-gold truncate">{img.caption || 'Live Experience'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl">
                   <ImageIcon className="w-8 h-8 text-zinc-800 mb-4" />
                   <p className="text-zinc-600 text-xs uppercase tracking-widest">No images in archive</p>
                </div>
              )}
           </div>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="py-24 px-10 bg-black overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-warm-gold/20 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-3 text-warm-gold mb-2">
              <MusicIcon className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Now Streaming</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              DREAMS OF THE <br/><span className="text-gradient-white">MOUNTAINS.</span>
            </h2>
            <p className="text-neutral-400 text-lg font-light max-w-xl leading-relaxed">
              Our latest single is a journey through the high passes of the Himalayas, translated into heavy riffs and ethereal vocals. Listen to the full experience on Spotify.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <a 
                href="https://open.spotify.com/artist/3J1fiPiGLoctMaZQQl0DJs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-[#1DB954] text-black px-8 py-4 rounded-full font-bold text-xs tracking-widest hover:scale-105 transition-all"
              >
                OPEN SPOTIFY
              </a>
              <Link 
                to="/music" 
                className="px-8 py-4 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all"
              >
                EXPLORE DISCOGRAPHY
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full lg:w-auto h-[450px] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)] border border-white/10">
            <iframe 
              src="https://open.spotify.com/embed/artist/3J1fiPiGLoctMaZQQl0DJs?utm_source=generator&theme=0" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Band Members Section */}
      <section id="members" className="py-24 px-6 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">THE <span className="text-warm-gold">HEART</span> OF SOCH</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-warm-gold hover:text-black transition-all group"
              >
                <ChevronLeft className="w-6 h-6 group-active:scale-95 transition-transform" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-warm-gold hover:text-black transition-all group"
              >
                <ChevronRight className="w-6 h-6 group-active:scale-95 transition-transform" />
              </button>
            </div>
          </div>
          
          <div 
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {loadingMembers ? (
              <div className="w-full h-64 flex items-center justify-center text-zinc-600 italic tracking-widest">Gathering the crew...</div>
            ) : members.length > 0 ? (
              members.map((member, idx) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] md:min-w-[320px] snap-center group flex flex-col"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-500 reflection-container relative">
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">{member.name}</h3>
                  <p className="text-warm-gold text-xs uppercase tracking-widest font-bold mb-4">{member.role}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">{member.bio}</p>
                </motion.div>
              ))
            ) : (
              <div className="w-full py-20 text-center border border-dashed border-white/5 rounded-2xl">
                 <p className="text-zinc-600 text-xs uppercase tracking-[0.3em]">The heart is silent // No members found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto border border-zinc-800 rounded-3xl p-8 md:p-16 bg-gradient-to-br from-zinc-900 to-black">
          <div className="text-center mb-12 space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">GET IN <span className="text-warm-gold">TOUCH</span></h2>
             <p className="text-zinc-500 font-light max-w-lg mx-auto">For bookings, press inquiries, or just to say hi, drop us a message below.</p>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" placeholder="Your Name" 
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 w-full focus:outline-none focus:border-warm-gold transition-colors"
                value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})}
                required
              />
              <input 
                type="email" placeholder="Email Address" 
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 w-full focus:outline-none focus:border-warm-gold transition-colors"
                value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})}
                required
              />
            </div>
            <input 
              type="text" placeholder="Subject" 
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 w-full focus:outline-none focus:border-warm-gold transition-colors"
              value={contactForm.subject} onChange={e => setContactForm({...contactForm, subject: e.target.value})}
            />
            <textarea 
              placeholder="Your Message" rows={6} 
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 w-full focus:outline-none focus:border-warm-gold transition-colors resize-none"
              value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}
              required
            ></textarea>
            <button 
              type="submit"
              disabled={sending || sent}
              className="bg-warm-gold text-black px-12 py-4 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'SENDING...' : sent ? 'MESSAGE SENT!' : 'SEND MESSAGE'}
              {!sending && !sent && <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
