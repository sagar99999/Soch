import { motion } from 'motion/react';
import { Music as MusicIcon, Youtube } from 'lucide-react';

export default function Music() {
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
            <p className="text-xl md:text-2xl font-medium text-warm-gold/80 leading-relaxed max-w-xl">
              A seamless fusion of traditional Nepali folk melodies and modern musical arrangements, dedicated to preserving our rich cultural heritage while pushing sonic boundaries for global audiences.
            </p>
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
