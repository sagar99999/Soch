import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, LogOut, LayoutDashboard, Calendar, ShoppingBag, Send, Upload, Loader2, Users } from 'lucide-react';
import { EventEntry, MerchItem, GalleryImage, BandMember } from '../types';
import { format } from 'date-fns';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [members, setMembers] = useState<BandMember[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'merch' | 'messages' | 'gallery' | 'members'>('events');
  const navigate = useNavigate();

  // Form states
  const [newEvent, setNewEvent] = useState<Partial<EventEntry>>({ status: 'upcoming' });
  const [newMerch, setNewMerch] = useState<Partial<MerchItem>>({ category: 'Apparel', stock: 0, price: 0 });
  const [newGallery, setNewGallery] = useState<Partial<GalleryImage>>({});
  const [newMember, setNewMember] = useState<Partial<BandMember>>({ instruments: [] });
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const memberFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === "shaagar5@gmail.com";

  useEffect(() => {
    if (!isAdmin) return;
    const qEvents = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubEvents = onSnapshot(qEvents, 
      (s) => setEvents(s.docs.map(d => ({ id: d.id, ...d.data() } as EventEntry))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'events')
    );
    
    const qMerch = query(collection(db, 'merchandise'), orderBy('createdAt', 'desc'));
    const unsubMerch = onSnapshot(qMerch, 
      (s) => setMerch(s.docs.map(d => ({ id: d.id, ...d.data() } as MerchItem))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'merchandise')
    );

    const qMessages = query(collection(db, 'fanMessages'), orderBy('createdAt', 'desc'));
    const unsubMessages = onSnapshot(qMessages,
      (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() } as any))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'fanMessages')
    );

    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubGallery = onSnapshot(qGallery,
      (s) => setGallery(s.docs.map(d => ({ id: d.id, ...d.data() } as GalleryImage))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'gallery')
    );

    const qMembers = query(collection(db, 'members'), orderBy('order', 'asc'));
    const unsubMembers = onSnapshot(qMembers,
      (s) => setMembers(s.docs.map(d => ({ id: d.id, ...d.data() } as BandMember))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'members')
    );

    return () => { unsubEvents(); unsubMerch(); unsubMessages(); unsubGallery(); unsubMembers(); };
  }, [isAdmin]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.city || !newEvent.venue || !newEvent.date) return;
    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        createdAt: new Date().toISOString()
      });
      setNewEvent({ status: 'upcoming' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'events');
    }
  };

  const handleCreateMerch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerch.name || !newMerch.price || !newMerch.imageUrl) return;
    try {
      await addDoc(collection(db, 'merchandise'), {
        ...newMerch,
        createdAt: new Date().toISOString()
      });
      setNewMerch({ category: 'Apparel', stock: 0, price: 0 });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'merchandise');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("File is too large (max 1MB). Please use a smaller image.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewGallery(prev => ({ ...prev, url: result }));
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Error reading file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleMemberImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("File is too large (max 1MB). Please use a smaller image.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewMember(prev => ({ ...prev, imageUrl: result }));
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Error reading file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.url) return;
    try {
      await addDoc(collection(db, 'gallery'), {
        ...newGallery,
        createdAt: new Date().toISOString()
      });
      setNewGallery({});
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'gallery');
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role || !newMember.imageUrl) return;
    try {
      await addDoc(collection(db, 'members'), {
        ...newMember,
        order: members.length,
        createdAt: new Date().toISOString()
      });
      setNewMember({ instruments: [] });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'members');
    }
  };

  const handleSeedDemoData = async () => {
    const demoEvents = [
      { 
        city: 'Kathmandu', 
        venue: 'Pragya Pratisthan', 
        date: '2026-10-12', 
        status: 'upcoming', 
        ticketUrl: '#',
        imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop'
      },
      { 
        city: 'Pokhara', 
        venue: 'Pokhara Stadium', 
        date: '2026-10-18', 
        status: 'upcoming', 
        ticketUrl: '#',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
      },
      { 
        city: 'Butwal', 
        venue: 'Butwal Mandap', 
        date: '2026-10-25', 
        status: 'upcoming', 
        ticketUrl: '#',
        imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop'
      },
      { 
        city: 'Dharan', 
        venue: 'Dharan Expo Ground', 
        date: '2026-11-02', 
        status: 'upcoming', 
        ticketUrl: '#',
        imageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ceea72?q=80&w=800&auto=format&fit=crop'
      },
      { 
        city: 'Chitwan', 
        venue: 'Narayani River Bank', 
        date: '2026-11-10', 
        status: 'upcoming', 
        ticketUrl: '#',
        imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop'
      },
    ];

    const demoMerch = [
      {
        name: 'Soch Band Official Tee',
        description: 'Premium cotton t-shirt with classic band logo.',
        price: 25,
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        category: 'Apparel'
      },
      {
        name: 'Echoes of Soul Vinyl',
        description: 'Limited edition gold vinyl of our latest album.',
        price: 45,
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop',
        category: 'Music'
      }
    ];

    const demoGallery = [
      { url: '/api/attachment/aistudio_attachment_1741636391456.png', caption: 'Keyboard Live Performance' },
      { url: '/api/attachment/aistudio_attachment_1741541050228.png', caption: 'Drums solo' },
      { url: '/api/attachment/aistudio_attachment_1741540613247.png', caption: 'Electric Guitar Riffs' },
      { url: '/api/attachment/aistudio_attachment_1741540614041.png', caption: 'Soch Band Full Lineup' },
      { url: '/api/attachment/aistudio_attachment_1741540614760.png', caption: 'Backstage Moments' },
      { url: '/api/attachment/aistudio_attachment_1741540615569.png', caption: 'Fans at Kathmandu Show' },
    ];

    const demoMembers = [
      { name: 'Sagar', role: 'Vocals / Guitar', instruments: ['Vocals', 'Electric Guitar'], bio: 'The soulful voice behind Soch.', imageUrl: 'https://picsum.photos/seed/sagar/400/600', order: 0 },
      { name: 'Saroj', role: 'Lead Guitar', instruments: ['Lead Guitar'], bio: 'Master of melodic riffs.', imageUrl: 'https://picsum.photos/seed/saroj/400/600', order: 1 },
      { name: 'Bijay', role: 'Bass', instruments: ['Bass Guitar'], bio: 'The heartbeat of the band.', imageUrl: 'https://picsum.photos/seed/bijay/400/600', order: 2 },
      { name: 'Nabin', role: 'Drums', instruments: ['Drums', 'Percussion'], bio: 'Driving the rhythm forward.', imageUrl: 'https://picsum.photos/seed/nabin/400/600', order: 3 },
    ];

    try {
      for (const event of demoEvents) {
        await addDoc(collection(db, 'events'), {
          ...event,
          createdAt: new Date().toISOString()
        });
      }
      for (const item of demoMerch) {
        await addDoc(collection(db, 'merchandise'), {
          ...item,
          createdAt: new Date().toISOString()
        });
      }
      for (const img of demoGallery) {
        await addDoc(collection(db, 'gallery'), {
          ...img,
          createdAt: new Date().toISOString()
        });
      }
      for (const member of demoMembers) {
        await addDoc(collection(db, 'members'), {
          ...member,
          createdAt: new Date().toISOString()
        });
      }
      alert('Demo data seeded successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    console.log('Deleting event:', id);
    try {
      await deleteDoc(doc(db, 'events', id));
      console.log('Event deleted successfully');
    } catch (err) {
      console.error('Delete event error:', err);
      handleFirestoreError(err, OperationType.DELETE, `events/${id}`);
    }
  };

  const handleDeleteMerch = async (id: string) => {
    console.log('Deleting merch:', id);
    try {
      await deleteDoc(doc(db, 'merchandise', id));
      console.log('Merch deleted successfully');
    } catch (err) {
      console.error('Delete merch error:', err);
      handleFirestoreError(err, OperationType.DELETE, `merchandise/${id}`);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'members', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `members/${id}`);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.log('User closed the login popup.');
      } else {
        console.error('Login error:', err);
      }
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center">Loading portal...</div>;

  if (!isAdmin) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <LayoutDashboard className="w-16 h-16 text-zinc-800 mb-6" />
        <h1 className="text-4xl font-bold mb-4 tracking-tighter uppercase">Access Denied</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          This section is restricted to band administrators. 
          {user ? ` You are logged in as ${user.email}.` : " Please sign in with an authorized account."}
        </p>
        <div className="flex gap-4">
          {!user && (
            <button 
              onClick={handleLogin}
              className="px-8 py-3 bg-white text-black font-bold rounded-full uppercase text-xs tracking-widest hover:bg-warm-gold transition-colors"
            >
              Sign In
            </button>
          )}
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 border border-white/20 text-white font-bold rounded-full uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3 tracking-tighter">
              <LayoutDashboard className="text-warm-gold" />
              BAND CONTROL <span className="text-zinc-600 font-light">PANEL</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-2">Logged in as {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSeedDemoData}
              className="px-6 py-2 rounded-full text-xs font-bold bg-zinc-900 border border-warm-gold/30 text-warm-gold hover:bg-warm-gold hover:text-black transition-all"
            >
              SEED DEMO TOURS
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-warm-gold text-black' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              TOUR DATES
            </button>
            <button 
              onClick={() => setActiveTab('merch')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'merch' ? 'bg-warm-gold text-black' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              MERCHANDISE
            </button>
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'gallery' ? 'bg-warm-gold text-black' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              GALLERY
            </button>
            <button 
              onClick={() => setActiveTab('members')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'members' ? 'bg-warm-gold text-black' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              MEMBERS
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-warm-gold text-black' : 'bg-zinc-900 border border-zinc-800'}`}
            >
              MESSAGES
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {activeTab === 'events' ? <Calendar className="w-5 h-5 text-warm-gold" /> : activeTab === 'merch' ? <ShoppingBag className="w-5 h-5 text-warm-gold" /> : activeTab === 'members' ? <Users className="w-5 h-5 text-warm-gold" /> : <Send className="w-5 h-5 text-warm-gold" />}
                {activeTab === 'messages' ? 'Fan Inquiries' : `Add New ${activeTab === 'events' ? 'Event' : activeTab === 'merch' ? 'Product' : activeTab === 'gallery' ? 'Image' : 'Member'}`}
              </h2>
              
              {activeTab === 'events' ? (
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <input 
                    type="text" placeholder="City (e.g. Kathmandu)" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newEvent.city || ''} onChange={e => setNewEvent({...newEvent, city: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Venue (e.g. Rangasala)" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newEvent.venue || ''} onChange={e => setNewEvent({...newEvent, venue: e.target.value})}
                  />
                  <input 
                    type="date" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newEvent.date || ''} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  />
                  <input 
                    type="url" placeholder="Ticket URL (Optional)" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newEvent.ticketUrl || ''} onChange={e => setNewEvent({...newEvent, ticketUrl: e.target.value})}
                  />
                  <input 
                    type="url" placeholder="Poster Image URL (Optional)" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newEvent.imageUrl || ''} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})}
                  />
                  <select 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newEvent.status} onChange={e => setNewEvent({...newEvent, status: e.target.value as any})}
                  >
                    <option value="upcoming" className="bg-zinc-950">Upcoming</option>
                    <option value="cancelled" className="bg-zinc-950">Cancelled</option>
                    <option value="completed" className="bg-zinc-950">Completed</option>
                  </select>
                  <button type="submit" className="w-full bg-warm-gold text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    PUBLISH EVENT
                  </button>
                </form>
              ) : activeTab === 'merch' ? (
                <form onSubmit={handleCreateMerch} className="space-y-4">
                  <input 
                    type="text" placeholder="Product Name" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newMerch.name || ''} onChange={e => setNewMerch({...newMerch, name: e.target.value})}
                  />
                  <textarea 
                    placeholder="Description" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold resize-none"
                    rows={3}
                    value={newMerch.description || ''} onChange={e => setNewMerch({...newMerch, description: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number" placeholder="Price" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                      value={newMerch.price || ''} onChange={e => setNewMerch({...newMerch, price: Number(e.target.value)})}
                    />
                    <input 
                      type="number" placeholder="Stock" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                      value={newMerch.stock || ''} onChange={e => setNewMerch({...newMerch, stock: Number(e.target.value)})}
                    />
                  </div>
                  <input 
                    type="url" placeholder="Image URL" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newMerch.imageUrl || ''} onChange={e => setNewMerch({...newMerch, imageUrl: e.target.value})}
                  />
                  <select 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold"
                    value={newMerch.category} onChange={e => setNewMerch({...newMerch, category: e.target.value})}
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Music">Music (CD/Vinyl)</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <button type="submit" className="w-full bg-warm-gold text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    ADD PRODUCT
                  </button>
                </form>
              ) : activeTab === 'gallery' ? (
                <form onSubmit={handleCreateGallery} className="space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-warm-gold transition-colors relative overflow-hidden group"
                  >
                    {newGallery.url ? (
                      <>
                        <img src={newGallery.url} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-warm-gold animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-zinc-600 group-hover:text-warm-gold transition-colors" />
                        )}
                        <p className="text-zinc-500 text-xs uppercase tracking-widest text-center px-4">
                          {uploading ? "Processing..." : "Click or drag to upload (Max 1MB)"}
                        </p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">Manual URL (Optional)</label>
                    <input 
                      type="url" placeholder="Paste image URL instead" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold text-sm"
                      value={newGallery.url || ''} onChange={e => setNewGallery({...newGallery, url: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">Caption</label>
                    <input 
                      type="text" placeholder="e.g. Kathmandu Live" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold text-sm"
                      value={newGallery.caption || ''} onChange={e => setNewGallery({...newGallery, caption: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={uploading || !newGallery.url}
                    className="w-full bg-warm-gold text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    PUBLISH TO GALLERY
                  </button>
                </form>
              ) : activeTab === 'members' ? (
                <form onSubmit={handleCreateMember} className="space-y-4">
                  <div 
                    onClick={() => memberFileInputRef.current?.click()}
                    className="w-full h-48 bg-black border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-warm-gold transition-colors relative overflow-hidden group"
                  >
                    {newMember.imageUrl ? (
                      <>
                        <img src={newMember.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 text-warm-gold animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-zinc-600 group-hover:text-warm-gold transition-colors" />
                        )}
                        <p className="text-zinc-500 text-xs uppercase tracking-widest text-center px-4">
                          {uploading ? "Processing..." : "Upload Profile Image (Max 1MB)"}
                        </p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={memberFileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleMemberImageUpload}
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">Manual Image URL</label>
                    <input 
                      type="url" placeholder="Paste image URL instead" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold text-sm"
                      value={newMember.imageUrl || ''} onChange={e => setNewMember({...newMember, imageUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                    <input 
                      type="text" placeholder="e.g. Sagar" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold text-sm"
                      value={newMember.name || ''} onChange={e => setNewMember({...newMember, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">Role</label>
                    <input 
                      type="text" placeholder="e.g. Lead Vocals" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold text-sm"
                      value={newMember.role || ''} onChange={e => setNewMember({...newMember, role: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">Bio</label>
                    <textarea 
                      placeholder="Bio / Short Description" 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-warm-gold text-sm resize-none"
                      rows={3}
                      value={newMember.bio || ''} onChange={e => setNewMember({...newMember, bio: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={uploading || !newMember.name || !newMember.imageUrl}
                    className="w-full bg-warm-gold text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    ADD MEMBER
                  </button>
                </form>
              ) : (
                <div className="text-zinc-500 text-sm space-y-4">
                  <p>Fan messages are read-only. You can respond via their provided email addresses.</p>
                  <div className="p-4 bg-black/50 rounded-xl border border-zinc-800">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Tip</p>
                    <p className="text-xs">Maintaining high fan engagement is key to band growth!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {activeTab === 'events' ? (
                events.length > 0 ? (
                  events.map(event => (
                    <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-6">
                        {event.imageUrl ? (
                          <div className="w-16 h-20 bg-black rounded-lg overflow-hidden border border-zinc-800">
                             <img src={event.imageUrl} alt={event.city} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <div className="text-center min-w-[60px]">
                            <p className="text-xl font-bold">{format(new Date(event.date), 'dd')}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500">{format(new Date(event.date), 'MMM')}</p>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-lg">{event.city}</p>
                          <p className="text-sm text-zinc-500 font-light">{event.venue}</p>
                          <p className="text-[10px] text-zinc-600 mt-1">{format(new Date(event.date), 'MMMM dd, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${event.status === 'upcoming' ? 'border-green-500 text-green-500' : 'border-zinc-700 text-zinc-500'}`}>
                           {event.status}
                         </span>
                         <button onClick={() => handleDeleteEvent(event.id!)} className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-red-500 transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 py-12 text-center border border-zinc-900 rounded-2xl border-dashed">No events found.</div>
                )
              ) : activeTab === 'merch' ? (
                merch.length > 0 ? (
                  merch.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-xl overflow-hidden border border-zinc-800">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-xs text-zinc-500 uppercase tracking-widest">{item.category} • ${item.price}</p>
                          <p className="text-[10px] text-zinc-600">Stock: {item.stock}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => handleDeleteMerch(item.id!)} className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-red-500 transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 py-12 text-center border border-zinc-900 rounded-2xl border-dashed">No products found.</div>
                )
              ) : activeTab === 'gallery' ? (
                gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map(img => (
                      <div key={img.id} className="relative group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden aspect-square">
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white truncate">{img.caption || 'Gallery Image'}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteGallery(img.id!)}
                          className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-zinc-600 py-12 text-center border border-zinc-900 rounded-2xl border-dashed">No gallery images found.</div>
                )
              ) : activeTab === 'members' ? (
                members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.map(member => (
                      <div key={member.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-xl overflow-hidden border border-zinc-800 group-hover:border-warm-gold transition-colors">
                           <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover grayscale transition-all" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{member.name}</p>
                          <p className="text-xs text-warm-gold uppercase tracking-widest">{member.role}</p>
                        </div>
                        <button onClick={() => handleDeleteMember(member.id!)} className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-zinc-600 py-12 text-center border border-zinc-900 rounded-2xl border-dashed">No band members found.</div>
                )
              ) : (
                messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">{msg.name}</p>
                          <p className="text-xs text-zinc-500">{msg.email} • {format(new Date(msg.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-zinc-800 text-warm-gold">
                          New Message
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-300">Subject: {msg.subject || '(No Subject)'}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed bg-black/30 p-4 rounded-xl italic">"{msg.message}"</p>
                      <a href={`mailto:${msg.email}`} className="inline-block text-warm-gold text-xs font-bold hover:underline">REPLY VIA EMAIL</a>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 py-12 text-center border border-zinc-900 rounded-2xl border-dashed">No fan messages yet.</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
