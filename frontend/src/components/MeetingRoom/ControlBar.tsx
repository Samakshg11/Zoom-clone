'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic, MicOff, Video, VideoOff, Users, MessageSquare,
  ChevronUp, ArrowUpFromLine, Smile, Shield, Sparkles, MoreHorizontal, X
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
    if (confirm("Are you sure you want to end this meeting?")) {
      if (onLeave) {
        onLeave();
      } else {
        router.push('/');
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-[72px] right-0 z-50 flex items-center justify-between px-4 py-1.5 bg-[#0a0a0a] shadow-lg h-[64px] border-t border-gray-800 text-white select-none">
      
      {/* Left Group: Audio & Video with dark pill background */}
      <div className="flex items-center gap-2">
        {/* Audio */}
        <div className="flex items-center bg-[#1c1d1f] hover:bg-[#2a2b2e] rounded-lg p-1 transition-colors">
          <button
            onClick={onToggleMute}
            className={`flex flex-col items-center justify-center px-2 py-1 ${
              isMuted ? 'text-red-500' : 'text-white'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5 text-white" />}
            <span className="text-[10px] font-normal mt-0.5">Audio</span>
          </button>
          <button className="text-gray-400 hover:text-white px-1">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video */}
        <div className="flex items-center bg-[#1c1d1f] hover:bg-[#2a2b2e] rounded-lg p-1 transition-colors">
          <button
            onClick={onToggleVideo}
            className={`flex flex-col items-center justify-center px-2 py-1 ${
              isVideoOff ? 'text-red-500' : 'text-white'
            }`}
            title={isVideoOff ? 'Start Video' : 'Stop Video'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5 text-red-500" /> : <Video className="w-5 h-5 text-white" />}
            <span className="text-[10px] font-normal mt-0.5">Video</span>
          </button>
          <button className="text-gray-400 hover:text-white px-1">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Group: Toolbar controls */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Participants */}
        <button
          onClick={onToggleParticipantsDrawer}
          className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] transition-all min-w-[56px] ${
            showParticipantsDrawer ? 'text-[#0E71EB]' : 'text-gray-200'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-gray-700 text-white text-[9px] font-bold px-1 rounded-full">
              {participantCount}
            </span>
          </div>
          <span className="text-[10px] font-normal mt-0.5">Participants</span>
        </button>

        {/* Chat */}
        <button
          onClick={onToggleChatDrawer}
          className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] transition-all min-w-[56px] ${
            showChatDrawer ? 'text-[#0E71EB]' : 'text-gray-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-normal mt-0.5">Chat</span>
        </button>

        {/* React */}
        <button
          onClick={() => alert("Reactions menu.")}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-gray-200 transition-all min-w-[56px]"
        >
          <Smile className="w-5 h-5" />
          <span className="text-[10px] font-normal mt-0.5">React</span>
        </button>

        {/* Share */}
        <button
          onClick={() => alert("Screen sharing active.")}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-emerald-400 transition-all min-w-[56px]"
        >
          <div className="bg-emerald-500 text-black p-1 rounded-md mb-0.5">
            <ArrowUpFromLine className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-[10px] font-normal text-white">Share</span>
        </button>

        {/* Host tools */}
        <button
          onClick={() => alert("Host tools menu.")}
          className="hidden md:flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-gray-200 transition-all min-w-[56px]"
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] font-normal mt-0.5">Host tools</span>
        </button>

        {/* Zoom AI */}
        <button
          onClick={() => alert("Zoom AI companion active.")}
          className="hidden md:flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-gray-200 transition-all min-w-[56px]"
        >
          <Sparkles className="w-5 h-5 text-indigo-300" />
          <span className="text-[10px] font-normal mt-0.5">Zoom AI</span>
        </button>

        {/* More */}
        <button
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-gray-200 transition-all min-w-[56px]"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-normal mt-0.5">More</span>
        </button>
      </div>

      {/* Right Group: Red End Button */}
      <div className="flex items-center">
        <button
          onClick={handleLeave}
          className="flex flex-col items-center justify-center text-red-500 hover:text-red-400 transition-colors p-1"
          title="End Meeting"
        >
          <div className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md mb-0.5">
            <X className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-[10px] font-semibold text-white">End</span>
        </button>
      </div>

    </nav>
  );
}


