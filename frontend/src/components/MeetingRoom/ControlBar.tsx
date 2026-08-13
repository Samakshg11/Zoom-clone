'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic, MicOff, Video, VideoOff, Users, MessageSquare,
  ChevronUp, ArrowUpFromLine, Smile, Shield, Sparkles, MoreHorizontal, X,
  Hand
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
  onSelectReaction?: (emoji: string) => void;
  isSharingScreen?: boolean;
  onToggleShareScreen?: () => void;
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
  onLeave,
  onSelectReaction,
  isSharingScreen,
  onToggleShareScreen
}: ControlBarProps) {
  const router = useRouter();
  const [showEndModal, setShowEndModal] = useState(false);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showAICompanion, setShowAICompanion] = useState(false);

  const handleEndMeetingForAll = () => {
    setShowEndModal(false);
    if (onLeave) {
      onLeave();
    } else {
      router.push('/');
    }
  };

  const handleLeaveMeetingOnly = () => {
    setShowEndModal(false);
    router.push('/');
  };

  const emojis = ['👏', '👍', '❤️', '😂', '😮', '✋'];

  return (
    <>
      <nav className="fixed bottom-0 left-[72px] right-0 z-40 flex items-center justify-between px-4 py-1.5 bg-[#0a0a0a] shadow-lg h-[64px] border-t border-gray-800 text-white select-none">
        
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
              <span className="text-[10px] font-normal mt-0.5">{isMuted ? 'Unmute' : 'Mute'}</span>
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
              <span className="text-[10px] font-normal mt-0.5">{isVideoOff ? 'Stop Video' : 'Start Video'}</span>
            </button>
            <button className="text-gray-400 hover:text-white px-1">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Group: Toolbar controls */}
        <div className="flex items-center gap-1 sm:gap-3 relative">
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
          <div className="relative">
            <button
              onClick={() => setShowReactionsMenu(!showReactionsMenu)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] transition-all min-w-[56px] ${
                showReactionsMenu ? 'text-[#0E71EB]' : 'text-gray-200'
              }`}
            >
              <Smile className="w-5 h-5" />
              <span className="text-[10px] font-normal mt-0.5">React</span>
            </button>

            {/* Reaction Emoji Picker Modal */}
            {showReactionsMenu && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#242424] border border-[#444749] rounded-2xl p-3 shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      if (onSelectReaction) onSelectReaction(emoji);
                      setShowReactionsMenu(false);
                    }}
                    className="w-9 h-9 rounded-xl hover:bg-[#323232] flex items-center justify-center text-xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share Screen */}
          <button
            onClick={onToggleShareScreen}
            className={`flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] transition-all min-w-[56px] ${
              isSharingScreen ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/50' : 'text-emerald-400'
            }`}
          >
            <div className="bg-emerald-500 text-black p-1 rounded-md mb-0.5">
              <ArrowUpFromLine className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-[10px] font-normal text-white">
              {isSharingScreen ? 'Stop Share' : 'Share'}
            </span>
          </button>

          {/* Host tools */}
          <button
            onClick={() => alert("Host Security Tools: Lock Meeting, Enable Waiting Room, Mute Participants on Entry.")}
            className="hidden md:flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-gray-200 transition-all min-w-[56px]"
          >
            <Shield className="w-5 h-5 text-gray-300" />
            <span className="text-[10px] font-normal mt-0.5">Host tools</span>
          </button>

          {/* Zoom AI */}
          <button
            onClick={() => setShowAICompanion(!showAICompanion)}
            className="hidden md:flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-gray-200 transition-all min-w-[56px]"
          >
            <Sparkles className="w-5 h-5 text-indigo-300" />
            <span className="text-[10px] font-normal mt-0.5">Zoom AI</span>
          </button>

          {/* More */}
          <button
            onClick={() => alert("More options: Record Meeting, Background & Effects, Settings.")}
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-[#1c1d1f] text-gray-200 transition-all min-w-[56px]"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-normal mt-0.5">More</span>
          </button>
        </div>

        {/* Right Group: Red End Button */}
        <div className="flex items-center">
          <button
            onClick={() => setShowEndModal(true)}
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

      {/* Real Zoom End Meeting Dialog Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#242424] rounded-2xl max-w-sm w-full p-6 text-white border border-[#444749] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-white">End meeting or leave?</h3>
              <p className="text-xs text-gray-400">
                You are the host of this meeting. If you leave, you can assign another host or end the meeting for all participants.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleEndMeetingForAll}
                className="w-full py-2.5 bg-[#E02828] hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                End Meeting for All
              </button>
              <button
                onClick={handleLeaveMeetingOnly}
                className="w-full py-2.5 bg-[#323232] hover:bg-[#3e3e3e] text-white font-semibold text-xs rounded-lg transition-colors border border-[#444749]"
              >
                Leave Meeting
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                className="w-full py-2 bg-transparent hover:bg-[#323232] text-gray-400 hover:text-white font-medium text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom AI Companion Modal */}
      {showAICompanion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#242424] rounded-2xl max-w-md w-full p-6 text-white border border-[#444749] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#444749] pb-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Zoom AI Companion</span>
              </div>
              <button onClick={() => setShowAICompanion(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3 bg-[#1a1a1a] rounded-xl border border-[#444749] leading-relaxed">
                ✨ <strong>AI Meeting Summary Active</strong>: Zoom AI is automatically taking notes, action items, and generating live highlights for this room.
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAICompanion(false)}
                className="px-4 py-2 bg-[#0E71EB] hover:bg-[#0059be] text-white text-xs font-semibold rounded-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



