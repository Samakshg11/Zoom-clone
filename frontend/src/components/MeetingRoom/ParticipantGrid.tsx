'use client';

import React from 'react';
import { Mic, MicOff } from 'lucide-react';

export interface GridParticipant {
  id: string | number;
  name: string;
  isHost?: boolean;
  isSelf?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
  avatarBg?: string;
  imageUrl?: string;
}

interface ParticipantGridProps {
  participants: GridParticipant[];
  isSelfMuted: boolean;
  isSelfVideoOff: boolean;
}

export default function ParticipantGrid({ participants, isSelfMuted }: ParticipantGridProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const activeSpeaker = participants[0] || {
    id: 'self',
    name: 'Demo Host',
    isHost: true,
    isSelf: true
  };

  const isMuted = activeSpeaker.isSelf ? isSelfMuted : (activeSpeaker.isMuted ?? true);

  return (
    <div className="flex-1 p-4 flex items-center justify-center overflow-hidden bg-[#1C1D1F] relative">
      
      {/* Center Profile / Logo Tile */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] border border-purple-400/30 flex flex-col items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-2xl tracking-wider select-none">
          <span>{getInitials(activeSpeaker.name)}</span>
        </div>
      </div>

      {/* Bottom-left overlay name badge matching Zoom screenshot */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xs px-3 py-1 rounded-md flex items-center gap-2 text-white border border-white/10 shadow-lg">
        {isMuted ? (
          <MicOff className="w-3.5 h-3.5 text-red-500 shrink-0" />
        ) : (
          <Mic className="w-3.5 h-3.5 text-green-400 shrink-0" />
        )}
        <span className="text-xs font-semibold tracking-wide">
          {activeSpeaker.name}
        </span>
      </div>

    </div>
  );
}


