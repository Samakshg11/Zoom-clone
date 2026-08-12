'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, MicOff, Video, VideoOff, Users, MessageSquare, 
  PhoneOff, MonitorUp 
} from 'lucide-react';

interface ControlBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isVideoOff: boolean;
  onToggleVideo: () => void;
  participantCount: number;
  showParticipantsDrawer: boolean;
  onToggleParticipantsDrawer: () => void;
  showChatDrawer: boolean;
  onToggleChatDrawer: () => void;
  onLeave?: () => void;
}

export default function ControlBar({
  isMuted,
  onToggleMute,
  isVideoOff,
  onToggleVideo,
  participantCount,
  showParticipantsDrawer,
  onToggleParticipantsDrawer,
  showChatDrawer,
  onToggleChatDrawer,
  onLeave
}: ControlBarProps) {
  const router = useRouter();

  const handleLeave = () => {
    if (confirm("Are you sure you want to leave and end this meeting?")) {
      if (onLeave) {
        onLeave();
      } else {
        router.push('/');
      }
    }
  };

  const handleShareScreenPlaceholder = () => {
    alert("Screen Sharing active in room.");
  };

  return (
    <footer className="bg-[#16191E] border-t border-gray-800/80 px-4 py-3 text-white flex items-center justify-between z-30 shrink-0 select-none">
      
      {/* Audio & Video Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl hover:bg-gray-800/80 transition-colors ${
            isMuted ? 'text-red-400' : 'text-gray-200 hover:text-white'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 text-green-400" />}
          <span className="text-[10px] font-medium mt-0.5">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        {/* Video Button */}
        <button
          onClick={onToggleVideo}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl hover:bg-gray-800/80 transition-colors ${
            isVideoOff ? 'text-red-400' : 'text-gray-200 hover:text-white'
          }`}
          title={isVideoOff ? 'Start Video' : 'Stop Video'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5 text-red-400" /> : <Video className="w-5 h-5 text-[#2D8CFF]" />}
          <span className="text-[10px] font-medium mt-0.5">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
        </button>

      </div>

      {/* Middle Interactive Toolbar */}
      <div className="flex items-center gap-1 sm:gap-2">
        
        {/* Participants Button */}
        <button
          onClick={onToggleParticipantsDrawer}
          className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-colors ${
            showParticipantsDrawer ? 'bg-[#2D8CFF]/20 text-[#2D8CFF] border border-[#2D8CFF]/40' : 'hover:bg-gray-800/80 text-gray-300 hover:text-white'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-2.5 bg-[#2D8CFF] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {participantCount}
            </span>
          </div>
          <span className="text-[10px] font-medium mt-0.5">Participants</span>
        </button>

        {/* Chat Button */}
        <button
          onClick={onToggleChatDrawer}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-colors ${
            showChatDrawer ? 'bg-[#2D8CFF]/20 text-[#2D8CFF] border border-[#2D8CFF]/40' : 'hover:bg-gray-800/80 text-gray-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Chat</span>
        </button>

        {/* Screen Share Button */}
        <button
          onClick={handleShareScreenPlaceholder}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl hover:bg-gray-800/80 text-green-400 hover:text-green-300 transition-colors"
          title="Share Screen"
        >
          <MonitorUp className="w-5 h-5 text-green-400" />
          <span className="text-[10px] font-medium mt-0.5 text-green-400">Share Screen</span>
        </button>

      </div>

      {/* Leave Meeting Button */}
      <div className="flex items-center">
        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5"
        >
          <PhoneOff className="w-4 h-4 fill-current" />
          <span>Leave</span>
        </button>
      </div>

    </footer>
  );
}
