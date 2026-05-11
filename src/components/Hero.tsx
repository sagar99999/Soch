import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505] flex items-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black opacity-60"></div>
        <img
          src="https://i.scdn.co/image/ab6761670000ecd443c88fb1b53ee89b2a2bdabf"
          alt="Soch Band Official"
          className="w-full h-full object-cover mix-blend-overlay opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 px-10 md:px-20 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="text-warm-gold text-[10px] md:text-sm font-medium tracking-[0.4em] uppercase mb-6 block">
            Official Artist Page
          </span>
          <h1 className="text-6xl md:text-[10rem] font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            <span className="text-warm-gold">सोच</span><br/>
            <span className="text-gradient-white">BAND</span>
          </h1>
          
          <div className="border-l-2 border-warm-gold pl-6 mb-10 max-w-md">
            <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed italic">
              "Melding contemporary Nepali soul with global rock rhythms—this is the evolution of the Himalayan soundscape."
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <button className="px-10 py-5 bg-white text-black font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-warm-gold transition-all w-full md:w-auto">
              Watch Latest Session
            </button>
            <button className="px-10 py-5 bg-transparent border border-white text-white font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all w-full md:w-auto">
              Listen on Spotify
            </button>
          </div>
        </motion.div>
      </div>

      {/* Micro-Interaction Indicator */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4">
        <span className="text-[10px] tracking-widest text-neutral-500 uppercase rotate-90 origin-right translate-y-full">Scroll</span>
        <div className="w-[1px] h-20 bg-gradient-to-t from-warm-gold to-transparent"></div>
      </div>
    </section>
  );
}
