'use client';

import React, { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const listToRender = participants.map((p) => ({
    id: p.id,
    name: p.name,
    isHost: !!p.isHost,
    isSelf: !!p.isSelf,
    initials: p.name.slice(0, 2).toUpperCase(),
    avatarBg: p.isSelf ? 'bg-[#0e71eb]' : 'bg-[#e2e0f6] text-[#191a2a]',
    isMuted: p.isSelf ? isSelfMuted : (p.isMuted ?? true),
    isVideoOff: p.isSelf ? isSelfVideoOff : (p.isVideoOff ?? true)
  }));

  const filtered = listToRender.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-[320px] bg-[#242424] border-l border-[#444749] flex flex-col shrink-0 h-full z-20 animate-in slide-in-from-right duration-200 text-white">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#444749] flex justify-between items-center">
        <h2 className="font-semibold text-sm text-white">
          Participants ({listToRender.length})
        </h2>
        <button
          onClick={onClose}
          className="text-[#c5c6c8] hover:text-white transition-colors p-1 rounded-md hover:bg-[#323232]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-[#444749]">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-[#767575] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find a participant"
            className="w-full bg-[#1a1a1a] border border-[#444749] rounded pl-8 pr-3 py-2 text-xs text-white placeholder-[#767575] focus:outline-none focus:border-[#0e71eb] focus:ring-1 focus:ring-[#0e71eb] transition-all"
          />
        </div>
      </div>

      {/* Participant List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map((p) => {
          const isMuted = p.isSelf ? isSelfMuted : (p.isMuted ?? true);
          const isVideoOff = p.isSelf ? isSelfVideoOff : (p.isVideoOff ?? true);

          return (
            <div
              key={p.id}
              className="flex items-center justify-between p-2 hover:bg-[#323232] rounded transition-colors group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${p.avatarBg || 'bg-[#0e71eb]'} flex items-center justify-center font-semibold text-xs shrink-0`}>
                  {p.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white flex items-center gap-1.5">
                    {p.name}
                    {p.isHost && (
                      <span className="bg-[#e2e0f6] text-[#2e2f3f] px-1.5 py-0.2 rounded text-[10px] font-semibold">
                        Host
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#c5c6c8]">
                {isMuted ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4 text-green-400" />
                )}
                {isVideoOff ? (
                  <VideoOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Video className="w-4 h-4 text-[#c5c6c8]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#444749] flex items-center gap-2">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              navigator.clipboard.writeText(window.location.href);
              alert("Meeting invite link copied to clipboard!");
            }
          }}
          className="bg-[#0E71EB] hover:bg-[#0059be] text-white font-semibold text-xs py-2 px-3 rounded transition-colors flex-1 text-center"
        >
          Copy Link
        </button>
        <button
          onClick={() => alert("Muted all participants")}
          className="bg-[#e2e0f6] hover:bg-[#d9d8ee] text-[#191a2a] font-semibold text-xs py-2 px-3 rounded transition-colors border border-[#444749] flex-1 text-center"
        >
          Mute All
        </button>
      </div>
    </aside>
  );
}

