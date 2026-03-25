import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] selection:bg-[#ff00ff] selection:text-white relative overflow-hidden">
      <div className="static-noise" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 border-b border-[#ff00ff]/30 pb-8 screen-tear">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-black magenta-glow rounded-none transform -rotate-3">
              <Gamepad2 className="w-10 h-10 text-[#ff00ff] drop-shadow-[0_0_10px_#ff00ff]" />
            </div>
            <div>
              <h1 
                className="text-6xl md:text-8xl font-glitch tracking-tighter uppercase text-[#ff00ff] glitch-text"
                data-text="SYSTEM_SNAKE"
              >
                SYSTEM_SNAKE
              </h1>
              <p className="text-[#00ffff] font-mono text-xs tracking-[0.3em] uppercase opacity-70">
                // PROTOCOL_v2.5_ACTIVE
              </p>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex flex-col items-end bg-black cyan-glow p-4 rounded-none transform rotate-1">
            <span className="text-[#ff00ff] font-mono uppercase tracking-[0.2em] text-[10px] mb-1">DATA_HARVESTED</span>
            <span 
              className="text-7xl md:text-8xl font-digital text-[#00ffff] glitch-text leading-none"
              data-text={score.toString().padStart(5, '0')}
            >
              {score.toString().padStart(5, '0')}
            </span>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black border-2 border-[#00ffff]/50 p-2">
              <SnakeGame onScoreChange={setScore} />
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-mono text-[#ff00ff]/50 uppercase tracking-widest">
              <span>[ CORE_TEMP: 42°C ]</span>
              <span>[ MEMORY_LEAK: DETECTED ]</span>
              <span>[ UPLINK: STABLE ]</span>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-black cyan-glow p-1">
              <MusicPlayer />
            </div>
            
            <div className="bg-black magenta-glow p-6 space-y-4">
              <h2 className="text-[#ff00ff] font-glitch text-2xl uppercase tracking-wider" data-text="TERMINAL_LOG">TERMINAL_LOG</h2>
              <div className="font-mono text-[10px] space-y-2 opacity-80">
                <p className="text-[#00ffff]">&gt; INITIALIZING NEURAL LINK...</p>
                <p className="text-[#00ffff]">&gt; CALIBRATING SENSORY INPUT...</p>
                <p className="text-[#ff00ff]">&gt; WARNING: REALITY DISTORTION DETECTED</p>
                <p className="text-[#00ffff]">&gt; STATUS: NOMINAL</p>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
