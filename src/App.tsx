/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Pause, SkipForward, SkipBack, Volume2, X, Minus, Maximize, Monitor, Disc3, FolderOpen } from 'lucide-react';

const releases = [
  { id: 9, type: 'UNDERGROUND RELEASE RADAR', title: 'MERCY', artist: 'KAYO, NULO, QUAKE MATTHEWS', cover: 'https://picsum.photos/seed/mercy/200/200', isFeatured: true },
  { id: 1, type: 'EP (2 TRACKS)', title: 'B4SS', artist: 'MAXXWELL', cover: 'https://picsum.photos/seed/b4ss/200/200' },
  { id: 2, type: 'ALBUM (16 TRACKS)', title: 'I WAS CHANGED BY IT', artist: 'DOLLBREAKER', cover: 'https://picsum.photos/seed/dollbreaker/200/200' },
  { id: 3, type: 'ALBUM (15 TRACKS)', title: 'A DAY IN THE LIFE', artist: 'SOS BENJI', cover: 'https://picsum.photos/seed/sosbenji/200/200' },
  { id: 4, type: 'ALBUM (9 TRACKS)', title: 'OBSERVATIONS', artist: 'G_SMOOTH', cover: 'https://picsum.photos/seed/gsmooth/200/200' },
  { id: 5, type: 'SINGLE', title: 'REKKON*', artist: 'BARRYMOR', cover: 'https://picsum.photos/seed/barrymor/200/200' },
  { id: 6, type: 'SINGLE', title: 'TRIGGER YOU', artist: 'MON\'ET', cover: 'https://picsum.photos/seed/monet/200/200' },
  { id: 7, type: 'SINGLE', title: 'HOT CAKEZ', artist: 'CAM XI', cover: 'https://picsum.photos/seed/camxi/200/200' },
  { id: 8, type: 'SINGLE', title: 'QUAD A GRASS', artist: 'RED NS', cover: 'https://picsum.photos/seed/redns/200/200' },
];

function useDraggable(initialPosition = { x: 100, y: 50 }) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return { position, handleMouseDown };
}

const WaveBars = ({ isPlaying, reverse }: { isPlaying: boolean, reverse?: boolean }) => {
  const bars = [...Array(10)].map((_, i) => {
    const delay = reverse ? (9 - i) * 0.1 : i * 0.1;
    const duration = 0.7 + (i % 4) * 0.15;
    return (
      <div
        key={i}
        className="w-1.5 bg-cyan-500/80 shadow-[0_0_5px_rgba(6,182,212,0.6)]"
        style={{
          height: isPlaying ? '15%' : '5%',
          animation: isPlaying ? `wave ${duration}s ease-in-out infinite ${delay}s` : 'none',
          transition: 'height 0.3s ease'
        }}
      />
    );
  });
  return (
    <div className="flex items-end gap-[2px] h-24 px-2 flex-1 justify-center z-0 pb-10">
      {bars}
    </div>
  );
};

export default function App() {
  const [selectedRelease, setSelectedRelease] = useState(releases[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowOpen, setWindowOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [time, setTime] = useState(new Date());

  const { position, handleMouseDown } = useDraggable({ x: 100, y: 40 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#008080]">
      {/* Desktop Icons */}
      <div className="flex-1 p-4 flex flex-col gap-4 items-start">
        <div 
          className="flex flex-col items-center gap-1 w-20 cursor-pointer group"
          onDoubleClick={() => { setWindowOpen(true); setMinimized(false); }}
        >
          <Monitor size={32} className="text-white drop-shadow-md" />
          <span className="text-white text-xs text-center bg-transparent group-hover:bg-[#000080] px-1">Release Radar</span>
        </div>
        <div className="flex flex-col items-center gap-1 w-20 cursor-pointer group">
          <FolderOpen size={32} className="text-white drop-shadow-md" />
          <span className="text-white text-xs text-center bg-transparent group-hover:bg-[#000080] px-1">My Music</span>
        </div>
      </div>

      {/* Window */}
      {windowOpen && !minimized && (
        <div 
          className="absolute w-[440px] aspect-[4/5] bg-[#d4d0c8] win-outset p-[3px] flex flex-col shadow-lg"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
          {/* Title Bar */}
          <div 
            className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white px-1 py-0.5 flex justify-between items-center select-none cursor-default"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-1">
              <Monitor size={14} />
              <span className="font-bold text-xs tracking-wide">Atlantic Waves - Release Radar</span>
            </div>
            <div className="flex gap-[2px]">
              <button className="win-btn w-4 h-4 flex items-center justify-center" onClick={() => setMinimized(true)}>
                <Minus size={10} strokeWidth={3} />
              </button>
              <button className="win-btn w-4 h-4 flex items-center justify-center">
                <Maximize size={10} strokeWidth={3} />
              </button>
              <button className="win-btn w-4 h-4 flex items-center justify-center" onClick={() => setWindowOpen(false)}>
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Menu Bar */}
          <div className="flex gap-2 px-2 py-1 text-xs border-b border-gray-400/30">
            <span className="hover:bg-[#0a246a] hover:text-white px-1 cursor-default">File</span>
            <span className="hover:bg-[#0a246a] hover:text-white px-1 cursor-default">Edit</span>
            <span className="hover:bg-[#0a246a] hover:text-white px-1 cursor-default">View</span>
            <span className="hover:bg-[#0a246a] hover:text-white px-1 cursor-default">Play</span>
            <span className="hover:bg-[#0a246a] hover:text-white px-1 cursor-default">Help</span>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-2 p-2 flex-1 overflow-hidden">
            
            {/* Banner */}
            <div className="bg-[#000080] text-white p-2 win-inset flex items-center gap-4 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 scanlines pointer-events-none opacity-50"></div>
              <Disc3 size={32} className="text-cyan-400 animate-spin-slow z-10 shrink-0" />
              <div className="z-10">
                <h2 className="font-bold text-sm text-cyan-300 tracking-wider">RELEASE RADAR</h2>
                <p className="text-[10px] leading-tight text-blue-100">DIVE INTO NEW MUSIC RELEASES FROM KAYO, QUAKE MATTHEWS, JRDN AND MORE UNDERGROUND TALENT FROM EAST COAST CANADIAN ARTISTS</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1 overflow-hidden">
              {/* Top Panel - Player/Details */}
              <div className="w-full flex flex-col gap-2 h-[200px] shrink-0">
                {/* Visualizer / Cover Art */}
                <div className="win-inset bg-black flex-1 flex items-center justify-between relative overflow-hidden">
                  <WaveBars isPlaying={isPlaying} />
                  <img 
                    src={selectedRelease.cover} 
                    alt="Cover" 
                    className={`h-full aspect-square object-cover z-10 ${isPlaying ? 'opacity-90' : 'opacity-60 grayscale-[50%]'}`}
                  />
                  <WaveBars isPlaying={isPlaying} reverse />
                  {/* Glitch overlay effect */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none z-20"></div>
                  <div className="absolute inset-0 scanlines pointer-events-none opacity-40 z-20"></div>
                  
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-green-400 font-mono text-[10px] p-1.5 border border-green-500/30 shadow-[0_0_5px_rgba(0,255,0,0.2)] z-30">
                    <div className="flex justify-between">
                      <span>{isPlaying ? '▶ PLAYING' : '■ STOPPED'}</span>
                      <span>{isPlaying ? '00:14 / 03:42' : '00:00 / 00:00'}</span>
                    </div>
                    <div className="truncate mt-1 text-green-300">{selectedRelease.artist}</div>
                    <div className="truncate font-bold">{selectedRelease.title}</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button className="win-btn p-1" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button className="win-btn p-1" onClick={() => setIsPlaying(false)}>
                    <Square size={14} />
                  </button>
                  <button className="win-btn p-1">
                    <SkipBack size={14} />
                  </button>
                  <button className="win-btn p-1">
                    <SkipForward size={14} />
                  </button>
                  
                  <div className="flex-1 win-inset h-6 bg-white flex items-center px-1 relative">
                    {/* Fake progress bar */}
                    {isPlaying && (
                      <div className="absolute left-1 top-1 bottom-1 bg-[#0a246a] w-1/3"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Panel - Playlist */}
              <div className="w-full win-inset bg-white flex flex-col flex-1 overflow-hidden">
                {/* List Header */}
                <div className="flex bg-[#d4d0c8] text-[10px] font-bold">
                  <div className="w-5/12 px-1 win-outset py-0.5 truncate">Title</div>
                  <div className="w-4/12 px-1 win-outset py-0.5 truncate">Artist</div>
                  <div className="w-3/12 px-1 win-outset py-0.5 truncate">Type</div>
                </div>
                
                {/* List Items */}
                <div className="flex-1 overflow-y-auto bg-white">
                  {releases.map((release) => (
                    <div 
                      key={release.id}
                      className={`flex text-[10px] px-1 py-0.5 cursor-pointer ${selectedRelease.id === release.id ? 'bg-[#0a246a] text-white border border-dotted border-white/50' : 'hover:bg-[#e5f3ff] border border-transparent'}`}
                      onClick={() => setSelectedRelease(release)}
                      onDoubleClick={() => setIsPlaying(true)}
                    >
                      <div className="w-5/12 truncate pr-1 flex items-center gap-1">
                        {release.isFeatured && <Disc3 size={10} className="text-yellow-500 shrink-0" />}
                        <span className="truncate">{release.title}</span>
                      </div>
                      <div className="w-4/12 truncate pr-1">{release.artist}</div>
                      <div className="w-3/12 truncate">{release.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="win-inset bg-[#d4d0c8] px-2 py-0.5 mt-1 text-[10px] flex justify-between text-gray-600">
            <span>{releases.length} object(s)</span>
            <span>{selectedRelease.type}</span>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="h-7 bg-[#d4d0c8] w-full border-t border-white shadow-[inset_0_1px_#dfdfdf] flex items-center px-1 gap-1 z-50 mt-auto">
        <button className="win-btn flex items-center gap-1 px-2 py-0.5 font-bold h-5/6">
          <Monitor size={14} className="text-blue-800" />
          <span className="italic pr-1">Start</span>
        </button>
        <div className="w-[2px] h-5/6 bg-gray-400 border-r border-white mx-1"></div>
        
        {/* Open Windows in Taskbar */}
        {windowOpen && (
          <button 
            className={`win-btn flex items-center gap-1 px-2 py-0.5 w-40 h-5/6 truncate ${!minimized ? 'win-inset bg-[#e0deda]' : ''}`}
            onClick={() => setMinimized(!minimized)}
          >
            <Monitor size={12} />
            <span className="truncate text-[10px] font-bold">Atlantic Waves - Relea...</span>
          </button>
        )}

        <div className="flex-1"></div>

        {/* System Tray */}
        <div className="win-inset px-2 py-0.5 h-5/6 flex items-center gap-2">
          <Volume2 size={12} />
          <span className="text-[10px]">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
    </div>
  );
}
