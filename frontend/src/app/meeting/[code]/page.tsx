'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, AlertCircle, Info, ShieldCheck, Grid, Maximize2,
  Home, Video, MessageSquare, MoreHorizontal, Settings, Copy, Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ParticipantGrid, { GridParticipant } from '@/components/MeetingRoom/ParticipantGrid';
import ControlBar from '@/components/MeetingRoom/ControlBar';
import ParticipantsDrawer from '@/components/MeetingRoom/ParticipantsDrawer';
import ChatDrawer from '@/components/MeetingRoom/ChatDrawer';
import { fetchMeetingDetails, endMeeting, Meeting } from '@/lib/api';

export default function MeetingRoomPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const meetingCode = resolvedParams.code;
  const router = useRouter();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Control Bar States
  const [isSelfMuted, setIsSelfMuted] = useState(true);
  const [isSelfVideoOff, setIsSelfVideoOff] = useState(true);

  // Drawer & Stage States
  const [showParticipantsDrawer, setShowParticipantsDrawer] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  // Participants State
  const [gridParticipants, setGridParticipants] = useState<GridParticipant[]>([]);
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState('Demo Host');

  const handleCopyMeetingLink = () => {
    const fullUrl = `${window.location.origin}/join/${meetingCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSelectReaction = (emoji: string) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 3500);
  };

  useEffect(() => {
    async function loadMeeting() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMeetingDetails(meetingCode);
        if (!data) {
          setError(`Meeting code "${meetingCode}" was not found.`);
          setLoading(false);
          return;
        }

        if (data.status === 'ended') {
          setError(`Meeting "${data.title}" has ended.`);
          setLoading(false);
          return;
        }

        let displayName = '';
        if (typeof window !== 'undefined') {
          displayName = localStorage.getItem(`zoom_display_name_${data.meeting_code}`) || '';
        }

        if (!displayName) {
          router.replace(`/join?code=${data.meeting_code}`);
          return;
        }

        setMeeting(data);
        setCurrentUserDisplayName(displayName);

        const participantsList: GridParticipant[] = [
          {
            id: 'self',
            name: displayName,
            isHost: true,
            isSelf: true,
            isMuted: true,
            isVideoOff: true,
            isSpeaking: false
          }
        ];

        if (data.participants && data.participants.length > 0) {
          data.participants.forEach((p, idx) => {
            if (p.display_name !== displayName) {
              participantsList.push({
                id: p.id,
                name: p.display_name,
                isHost: false,
                isMuted: true,
                isVideoOff: true,
                isSpeaking: false
              });
            }
          });
        }

        setGridParticipants(participantsList);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load meeting details.');
      } finally {
        setLoading(false);
      }
    }

    loadMeeting();
  }, [meetingCode, router]);

  const handleLeaveMeeting = async () => {
    if (meetingCode) {
      await endMeeting(meetingCode);
    }
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1d1f] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-[#0E71EB] animate-spin" />
        <p className="text-sm font-semibold text-gray-300">Connecting to Zoom Meeting Room ({meetingCode})...</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-[#1c1d1f] flex flex-col items-center justify-center text-white p-4 font-sans">
        <div className="bg-[#242424] rounded-3xl p-8 max-w-md w-full border border-gray-800 text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-100">Unable to Join Meeting</h2>
          <p className="text-xs text-gray-400 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-[#0E71EB] hover:bg-[#0059be] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#F7F8FA] flex flex-col overflow-hidden font-sans select-none">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Area with Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-[72px] bg-[#F7F8FA] border-r border-gray-200/80 flex flex-col items-center justify-between py-4 select-none shrink-0 z-10">
          <div className="flex flex-col items-center gap-2 w-full px-2">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to leave the meeting?")) {
                  handleLeaveMeeting();
                }
              }}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-all"
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to leave the meeting?")) {
                  handleLeaveMeeting();
                }
              }}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl bg-white shadow-xs border border-gray-200/80 text-gray-900 font-semibold transition-all"
            >
              <Video className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Meetings</span>
            </button>

            <button
              onClick={() => setShowChatDrawer(!showChatDrawer)}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-all"
            >
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Chat</span>
            </button>

            <button
              onClick={() => alert("More tools & apps.")}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-all"
            >
              <MoreHorizontal className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to leave the meeting?")) {
                handleLeaveMeeting();
              }
            }}
            className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 rounded-xl transition-colors"
            
          >
            <Settings className="w-5 h-5" />
          </button>
        </aside>

        {/* Meeting Stage Canvas */}
        <div className="flex-1 bg-[#1C1D1F] flex flex-col overflow-hidden relative pb-[64px]">
          
          {/* Top Bar inside Meeting Canvas */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#141414] text-white border-b border-gray-800 text-xs shrink-0 select-none">
            <div className="flex items-center gap-2 font-medium truncate">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{meeting.title}</span>
              <span className="text-gray-500 font-mono text-[11px] hidden sm:inline">({meeting.meeting_code})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyMeetingLink}
                className="flex items-center gap-1.5 bg-[#2A2B2E] hover:bg-[#3A3B3E] active:bg-[#4A4B4E] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors border border-gray-700 shadow-xs"
                title="Copy Invite Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-300" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <div className="w-px h-4 bg-gray-700 hidden sm:block" />
              <ShieldCheck className="w-4 h-4 text-emerald-500 cursor-pointer"/>
              <Grid className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"/>
              <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"  />
            </div>
          </div>

          {/* Canvas Center View with Tiles */}
          <div className="flex-1 flex overflow-hidden relative">
            <ParticipantGrid
              participants={gridParticipants}
              isSelfMuted={isSelfMuted}
              isSelfVideoOff={isSelfVideoOff}
              activeReaction={activeReaction}
              isSharingScreen={isSharingScreen}
            />

            {/* Side Drawer: Participants */}
            <ParticipantsDrawer
              isOpen={showParticipantsDrawer}
              onClose={() => setShowParticipantsDrawer(false)}
              participants={gridParticipants}
              isSelfMuted={isSelfMuted}
              isSelfVideoOff={isSelfVideoOff}
            />

            {/* Side Drawer: Chat */}
            <ChatDrawer
              isOpen={showChatDrawer}
              onClose={() => setShowChatDrawer(false)}
              currentUser={currentUserDisplayName}
            />
          </div>

          {/* Bottom Toolbar */}
          <ControlBar
            isMuted={isSelfMuted}
            onToggleMute={() => setIsSelfMuted(!isSelfMuted)}
            isVideoOff={isSelfVideoOff}
            onToggleVideo={() => setIsSelfVideoOff(!isSelfVideoOff)}
            participantCount={gridParticipants.length}
            showParticipantsDrawer={showParticipantsDrawer}
            onToggleParticipantsDrawer={() => {
              setShowParticipantsDrawer(!showParticipantsDrawer);
              if (showChatDrawer) setShowChatDrawer(false);
            }}
            showChatDrawer={showChatDrawer}
            onToggleChatDrawer={() => {
              setShowChatDrawer(!showChatDrawer);
              if (showParticipantsDrawer) setShowParticipantsDrawer(false);
            }}
            onLeave={handleLeaveMeeting}
            onSelectReaction={handleSelectReaction}
            isSharingScreen={isSharingScreen}
            onToggleShareScreen={() => setIsSharingScreen(!isSharingScreen)}
          />

        </div>

      </div>

    </div>
  );
}

