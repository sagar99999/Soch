import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, LogOut, LayoutDashboard, Calendar, ShoppingBag, Send } from 'lucide-react';
import { EventEntry, MerchItem } from '../types';
import { format } from 'date-fns';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'merch' | 'messages'>('events');
  const navigate = useNavigate();

  // Form states
  const [newEvent, setNewEvent] = useState<Partial<EventEntry>>({ status: 'upcoming' });
  const [newMerch, setNewMerch] = useState<Partial<MerchItem>>({ category: 'Apparel', stock: 0, price: 0 });

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

    return () => { unsubEvents(); unsubMerch(); unsubMessages(); };
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

  const handleSeedDemoData = async () => {
    const demoEvents = [
      { city: 'Kathmandu', venue: 'Pragya Pratisthan', date: '2026-10-12', status: 'upcoming', ticketUrl: '#' },
      { city: 'Pokhara', venue: 'Pokhara Stadium', date: '2026-10-18', status: 'upcoming', ticketUrl: '#' },
      { city: 'Butwal', venue: 'Butwal Mandap', date: '2026-10-25', status: 'upcoming', ticketUrl: '#' },
      { city: 'Dharan', venue: 'Dharan Expo Ground', date: '2026-11-02', status: 'upcoming', ticketUrl: '#' },
      { city: 'Chitwan', venue: 'Narayani River Bank', date: '2026-11-10', status: 'upcoming', ticketUrl: '#' },
    ];

    try {
      for (const event of demoEvents) {
        await addDoc(collection(db, 'events'), {
          ...event,
          createdAt: new Date().toISOString()
        });
      }
      alert('Demo tours seeded successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Delete this event?')) {
      try {
        await deleteDoc(doc(db, 'events', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `events/${id}`);
      }
    }
  };

  const handleDeleteMerch = async (id: string) => {
    if (confirm('Delete this product?')) {
      try {
        await deleteDoc(doc(db, 'merchandise', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `merchandise/${id}`);
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
              onClick={() => signInWithPopup(auth, googleProvider)}
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
                {activeTab === 'events' ? <Calendar className="w-5 h-5 text-warm-gold" /> : activeTab === 'merch' ? <ShoppingBag className="w-5 h-5 text-warm-gold" /> : <Send className="w-5 h-5 text-warm-gold" />}
                {activeTab === 'messages' ? 'Fan Inquiries' : `Add New ${activeTab === 'events' ? 'Event' : 'Product'}`}
              </h2>
              
              {activeTab === 'events' ? (
                // ... (form remains the same)
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
                // ... (events list)
                events.length > 0 ? (
                  events.map(event => (
                    <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-[60px]">
                           <p className="text-xl font-bold">{format(new Date(event.date), 'dd')}</p>
                           <p className="text-[10px] uppercase tracking-widest text-zinc-500">{format(new Date(event.date), 'MMM')}</p>
                        </div>
                        <div>
                          <p className="font-bold text-lg">{event.city}</p>
                          <p className="text-sm text-zinc-500 font-light">{event.venue}</p>
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
