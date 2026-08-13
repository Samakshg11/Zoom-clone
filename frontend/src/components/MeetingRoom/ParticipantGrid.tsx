'use client';

import React from 'react';
import { Mic, MicOff, MonitorUp } from 'lucide-react';

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
  activeReaction?: string | null;
  isSharingScreen?: boolean;
}

export default function ParticipantGrid({
  participants,
  isSelfMuted,
  isSelfVideoOff,
  activeReaction,
  isSharingScreen
}: ParticipantGridProps) {
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
  const isVideoOff = activeSpeaker.isSelf ? isSelfVideoOff : (activeSpeaker.isVideoOff ?? true);

  return (
    <div className="flex-1 p-4 flex items-center justify-center overflow-hidden bg-[#1C1D1F] relative">
      
      {/* Screen Share Stage Mode */}
      {isSharingScreen ? (
        <div className="w-full h-full border-2 border-emerald-500 rounded-2xl bg-[#141414] p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative">
          <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <MonitorUp className="w-4 h-4" />
            <span>You are sharing your screen</span>
          </div>
          <div className="w-24 h-24 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <MonitorUp className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Live Screen Share Broadcast</h3>
            <p className="text-xs text-gray-400">Participants can see your application window and desktop screen.</p>
          </div>
        </div>
      ) : (
        /* Video / Profile Stage Mode */
        <div className="relative flex flex-col items-center justify-center">
          {!isVideoOff ? (
            /* Active Video Stream Container */
            <div className="w-72 h-56 sm:w-96 sm:h-72 rounded-2xl bg-[#242A32] border border-gray-700 flex flex-col items-center justify-center text-white relative shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <span className="text-xs text-gray-400 font-medium">Camera Video Feed</span>
            </div>
          ) : (
            /* Profile Avatar Square Tile */
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] border border-purple-400/30 flex flex-col items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-2xl tracking-wider select-none">
              <span>{getInitials(activeSpeaker.name)}</span>
            </div>
          )}
        </div>
      )}

      {/* Floating Reaction Badge */}
      {activeReaction && (
        <div className="absolute top-8 right-8 bg-[#242424] border border-[#444749] text-3xl p-3 rounded-2xl shadow-2xl animate-in zoom-in-75 duration-200 z-30">
          {activeReaction}
        </div>
      )}

      {/* Bottom-left overlay name badge matching Zoom screenshot */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xs px-3 py-1 rounded-md flex items-center gap-2 text-white border border-white/10 shadow-lg z-20">
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



