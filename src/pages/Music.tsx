import { motion } from 'motion/react';
import { Play, SkipForward, SkipBack, Volume2, Music as MusicIcon, ExternalLink, Youtube } from 'lucide-react';
import { useState } from 'react';

const TRACKS = [
  { title: "Mountain Dreams", duration: "4:20", album: "Summit Echoes", trackId: "3J1fiPiGLoctMaZQQl0DJs" },
  { title: "Path to Kathmandu", duration: "3:45", album: "Summit Echoes", trackId: "3J1fiPiGLoctMaZQQl0DJs" },
  { title: "The Wind's Call", duration: "5:12", album: "Urban Himalayan", trackId: "3J1fiPiGLoctMaZQQl0DJs" },
  { title: "Midnight Tea", duration: "3:58", album: "Single", trackId: "3J1fiPiGLoctMaZQQl0DJs" },
];

export default function Music() {
  const [currentTrack, setCurrentTrack] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Experience Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <span className="text-warm-gold text-[10px] uppercase tracking-[0.4em] font-bold">Sonic Archive</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              CULTURAL <br/> <span className="text-gradient-white">VIBRATIONS.</span>
            </h1>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-10 backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-warm-gold rounded-full flex items-center justify-center text-black">
                 <MusicIcon className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-lg">EXPERIENCE SNIPPETS</h3>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">Listen to the soul of Soch Band</p>
               </div>
             </div>

             <div className="space-y-2">
               {TRACKS.map((track, idx) => (
                 <div 
                  key={idx} 
                  onClick={() => setCurrentTrack(idx)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${currentTrack === idx ? 'bg-white/10 text-white border border-white/10' : 'hover:bg-white/5 text-neutral-500 border border-transparent'}`}
                 >
                   <div className="flex items-center gap-4">
                     <span className="text-[10px] font-mono">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                     <div>
                       <p className="font-bold text-sm">{track.title}</p>
                       <p className="text-[10px] uppercase tracking-widest opacity-60">{track.album}</p>
                     </div>
                   </div>
                   <span className="text-[10px] font-mono opacity-60">{track.duration}</span>
                 </div>
               ))}
             </div>

             {/* Player Mockup */}
             <div className="mt-12 bg-black rounded-2xl p-6 border border-white/10">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <p className="text-[10px] text-warm-gold font-bold uppercase tracking-widest mb-1">Now Playing</p>
                   <p className="font-bold">{TRACKS[currentTrack].title}</p>
                 </div>
                 <Volume2 className="w-5 h-5 text-neutral-600" />
               </div>
               <div className="h-1 bg-neutral-900 rounded-full w-full mb-6 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="h-full bg-warm-gold"
                 />
               </div>
               <div className="flex items-center justify-center gap-8">
                 <SkipBack className="w-5 h-5 text-neutral-600 hover:text-white transition-colors cursor-pointer" />
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-warm-gold transition-colors cursor-pointer">
                   <Play className="w-6 h-6 fill-black" />
                 </div>
                 <SkipForward className="w-5 h-5 text-neutral-600 hover:text-white transition-colors cursor-pointer" />
               </div>
             </div>
          </div>
        </motion.div>

        {/* Full Integration Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:pt-24 space-y-12"
        >
          <div className="aspect-square bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden relative group">
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

          <div className="grid grid-cols-2 gap-4">
            <a 
              href="https://open.spotify.com/artist/3J1fiPiGLoctMaZQQl0DJs" 
              target="_blank" 
              className="p-8 bg-zinc-950 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:border-warm-gold/50 transition-all"
            >
              <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center text-black">
                <MusicIcon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 group-hover:text-white">Spotify</p>
            </a>
            <a 
              href="https://www.youtube.com/channel/UC2diELzRtJ1IqufMwej-4UQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-8 bg-zinc-950 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:border-warm-gold/50 transition-all"
            >
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
                <Youtube className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 group-hover:text-white">YouTube Channel</p>
            </a>
          </div>

          <div className="p-10 border border-warm-gold/10 bg-warm-gold/5 rounded-3xl">
             <p className="text-xl font-light italic leading-relaxed text-neutral-300">
               "Music is the bridge between silence and expression. Join us in this sonic exploration of the high mountains and deeper thoughts."
             </p>
             <div className="mt-6 flex items-center gap-3">
               <div className="w-8 h-[1px] bg-warm-gold"></div>
               <span className="text-[10px] uppercase tracking-widest font-bold text-warm-gold">Soch Band</span>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
