'use client';

import React from 'react';
import { Mic, MicOff, Video, VideoOff, Crown, Volume2 } from 'lucide-react';

export interface GridParticipant {
  id: string | number;
  name: string;
  isHost?: boolean;
  isSelf?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
  avatarBg?: string;
}

interface ParticipantGridProps {
  participants: GridParticipant[];
  isSelfMuted: boolean;
  isSelfVideoOff: boolean;
}

export default function ParticipantGrid({ participants, isSelfMuted, isSelfVideoOff }: ParticipantGridProps) {

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const defaultBgs = [
    'from-blue-600 to-indigo-700',
    'from-emerald-600 to-teal-700',
    'from-purple-600 to-pink-700',
    'from-amber-600 to-orange-700',
    'from-cyan-600 to-blue-800'
  ];

  return (
    <div className="flex-1 bg-[#1A1E24] p-4 sm:p-6 flex items-center justify-center overflow-hidden">
      
      <div className={`w-full max-w-6xl h-full flex items-center justify-center gap-4 ${
        participants.length === 1 ? 'max-w-3xl max-h-[520px]' :
        participants.length === 2 ? 'grid grid-cols-1 md:grid-cols-2 max-h-[560px]' :
        participants.length <= 4 ? 'grid grid-cols-2 max-h-[600px]' :
        'grid grid-cols-2 md:grid-cols-3 max-h-[640px]'
      }`}>
        
        {participants.map((p, index) => {
          const isMuted = p.isSelf ? isSelfMuted : (p.isMuted ?? false);
          const isVideoOff = p.isSelf ? isSelfVideoOff : (p.isVideoOff ?? true);
          const bgGradient = p.avatarBg || defaultBgs[index % defaultBgs.length];

          return (
            <div
              key={p.id}
              className={`relative w-full h-full min-h-[220px] bg-[#242A32] rounded-2xl border ${
                p.isSpeaking && !isMuted 
                  ? 'border-green-500 shadow-lg shadow-green-500/20 ring-2 ring-green-500/40' 
                  : 'border-gray-800'
              } flex flex-col items-center justify-center p-6 overflow-hidden transition-all group`}
            >
              
              {/* Audio visualizer effect when speaking */}
              {p.isSpeaking && !isMuted && (
                <div className="absolute top-4 right-4 flex items-end gap-1 h-5 px-2.5 py-1 bg-green-950/80 border border-green-700/60 rounded-full">
                  <span className="w-1 bg-green-400 rounded-full bar-1"></span>
                  <span className="w-1 bg-green-400 rounded-full bar-2"></span>
                  <span className="w-1 bg-green-400 rounded-full bar-3"></span>
                </div>
              )}

              {/* Video status placeholder tile */}
              <div className="relative flex flex-col items-center justify-center">
                
                {/* Avatar Circle */}
                <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr ${bgGradient} text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-xl border-2 border-white/10 ${
                  p.isSpeaking && !isMuted ? 'speaking-pulse' : ''
                }`}>
                  <span>{getInitials(p.name)}</span>
                </div>

              </div>

              {/* Bottom Overlay Label */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                
                {/* Name Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/10 truncate max-w-[80%]">
                  {p.isHost && (
                    <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0 fill-current" />
                  )}
                  <span className="truncate">{p.name} {p.isSelf ? '(You)' : ''}</span>
                </div>

                {/* Mic Status Icon */}
                <div className={`p-1.5 rounded-lg border backdrop-blur-md ${
                  isMuted 
                    ? 'bg-red-500/80 border-red-400 text-white' 
                    : 'bg-black/60 border-white/10 text-green-400'
                }`}>
                  {isMuted ? (
                    <MicOff className="w-3.5 h-3.5" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
