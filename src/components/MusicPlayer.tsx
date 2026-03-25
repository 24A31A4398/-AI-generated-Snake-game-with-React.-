import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Nights (AI Generated)",
    artist: "SynthBot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-pink-500",
    shadow: "shadow-[0_0_15px_rgba(236,72,153,0.5)]"
  },
  {
    id: 2,
    title: "Cyberpunk Drift (AI Generated)",
    artist: "AlgoRhythm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "text-cyan-400",
    shadow: "shadow-[0_0_15px_rgba(34,211,238,0.5)]"
  },
  {
    id: 3,
    title: "Digital Horizon (AI Generated)",
    artist: "NeuralNet",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "text-purple-500",
    shadow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]"
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full bg-black border-2 border-[#ff00ff]/30 p-6 shadow-[0_0_30px_rgba(255,0,255,0.1)] relative overflow-hidden screen-tear">
      {/* Static scanlines for player area */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-6 mb-8 relative z-10">
        <div className={`w-20 h-20 bg-black border-2 border-[#ff00ff] flex items-center justify-center ${isPlaying ? 'magenta-glow' : ''} transition-all duration-500`}>
          <Music className={`w-10 h-10 text-[#ff00ff] drop-shadow-[0_0_8px_#ff00ff] ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#ff00ff] font-glitch text-xl truncate tracking-tighter uppercase" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-[#00ffff] text-[10px] font-mono truncate opacity-70 tracking-widest">// SOURCE: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative z-10">
        <div className="h-1 bg-[#00ffff]/20 overflow-hidden">
          <div 
            className="h-full bg-[#00ffff] shadow-[0_0_10px_#00ffff] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between relative z-10">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="transition-all duration-300 p-2 text-[#00ffff] drop-shadow-[0_0_8px_currentColor] opacity-70 hover:opacity-100"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-8">
          <button 
            onClick={prevTrack}
            className="transition-all duration-300 hover:scale-110 transform text-[#ff00ff] drop-shadow-[0_0_8px_currentColor] opacity-70 hover:opacity-100"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`w-16 h-16 bg-black border-2 border-[#00ffff] flex items-center justify-center hover:scale-105 transition-all duration-300 text-[#00ffff] ${isPlaying ? 'cyan-glow' : ''}`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current drop-shadow-[0_0_8px_currentColor]" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1 drop-shadow-[0_0_8px_currentColor]" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="transition-all duration-300 hover:scale-110 transform text-[#ff00ff] drop-shadow-[0_0_8px_currentColor] opacity-70 hover:opacity-100"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="mt-6 text-[8px] font-mono text-[#ff00ff]/40 uppercase tracking-[0.4em] text-center">
        [ AUDIO_STREAM: ENCRYPTED ]
      </div>
    </div>
  );
}
