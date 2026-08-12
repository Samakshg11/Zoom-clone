'use client';

import React from 'react';
import { X, Mic, MicOff, Video, VideoOff, Crown, UserCheck } from 'lucide-react';
import { GridParticipant } from './ParticipantGrid';

interface ParticipantsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  participants: GridParticipant[];
  isSelfMuted: boolean;
  isSelfVideoOff: boolean;
}

export default function ParticipantsDrawer({
  isOpen,
  onClose,
  participants,
  isSelfMuted,
  isSelfVideoOff
}: ParticipantsDrawerProps) {
  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-[#1E242C] border-l border-gray-800 text-white flex flex-col z-20 shrink-0 h-full animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm">
          <span>Participants</span>
          <span className="text-xs bg-[#2D8CFF] text-white px-2 py-0.5 rounded-full">
            {participants.length}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {participants.map((p) => {
          const isMuted = p.isSelf ? isSelfMuted : (p.isMuted ?? false);
          const isVideoOff = p.isSelf ? isSelfVideoOff : (p.isVideoOff ?? true);

          return (
            <div
              key={p.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-800/40 hover:bg-gray-800/80 border border-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-200 truncate">
                      {p.name}
                    </span>
                    {p.isSelf && (
                      <span className="text-[10px] text-gray-400">(Me)</span>
                    )}
                  </div>
                  {p.isHost && (
                    <span className="text-[9px] text-yellow-400 flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5 fill-current" />
                      Host
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                {isMuted ? (
                  <MicOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Mic className="w-4 h-4 text-green-400" />
                )}
                {isVideoOff ? (
                  <VideoOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Video className="w-4 h-4 text-[#2D8CFF]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 flex justify-between gap-2">
        <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl">
          Mute All
        </button>
        <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl">
          Invite
        </button>
      </div>

    </aside>
  );
}
