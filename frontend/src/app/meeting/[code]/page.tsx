'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/MeetingRoom/Header';
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
  const [isSelfMuted, setIsSelfMuted] = useState(false);
  const [isSelfVideoOff, setIsSelfVideoOff] = useState(false);

  // Drawer States
  const [showParticipantsDrawer, setShowParticipantsDrawer] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  // Participants State
  const [gridParticipants, setGridParticipants] = useState<GridParticipant[]>([]);
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState('Demo Host');

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

        // Direct Access Guard: check if user completed join flow with display name
        let displayName = '';
        if (typeof window !== 'undefined') {
          displayName = localStorage.getItem(`zoom_display_name_${data.meeting_code}`) || '';
        }

        // If direct access without display name, redirect to join screen
        if (!displayName) {
          router.replace(`/join?code=${data.meeting_code}`);
          return;
        }

        setMeeting(data);
        setCurrentUserDisplayName(displayName);

        // Build grid participants list
        const participantsList: GridParticipant[] = [
          {
            id: 'self',
            name: displayName,
            isHost: true,
            isSelf: true,
            isMuted: false,
            isVideoOff: false,
            isSpeaking: false,
            avatarBg: 'from-blue-600 to-indigo-700'
          }
        ];

        if (data.participants && data.participants.length > 0) {
          data.participants.forEach((p, idx) => {
            if (p.display_name !== displayName) {
              participantsList.push({
                id: p.id,
                name: p.display_name,
                isHost: false,
                isMuted: idx % 2 === 0,
                isVideoOff: true,
                isSpeaking: idx === 0,
                avatarBg: idx % 2 === 0 ? 'from-purple-600 to-pink-700' : 'from-emerald-600 to-teal-700'
              });
            }
          });
        }

        if (participantsList.length === 1) {
          participantsList.push(
            {
              id: 'p2',
              name: 'Sarah Chen',
              isHost: false,
              isMuted: false,
              isVideoOff: true,
              isSpeaking: true,
              avatarBg: 'from-emerald-600 to-teal-700'
            },
            {
              id: 'p3',
              name: 'Alex Rivera',
              isHost: false,
              isMuted: true,
              isVideoOff: true,
              isSpeaking: false,
              avatarBg: 'from-purple-600 to-pink-700'
            }
          );
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

  // Simulate active speaker shifts
  useEffect(() => {
    if (gridParticipants.length <= 1) return;
    const interval = setInterval(() => {
      setGridParticipants((prev) => {
        return prev.map((p) => {
          if (p.isSelf) return p;
          const shouldSpeak = Math.random() > 0.5;
          return { ...p, isSpeaking: !p.isMuted && shouldSpeak };
        });
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [gridParticipants.length]);

  const handleLeaveMeeting = async () => {
    if (meetingCode) {
      await endMeeting(meetingCode);
    }
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#16191E] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-[#2D8CFF] animate-spin" />
        <p className="text-sm font-semibold text-gray-300">Connecting to Zoom Meeting Room ({meetingCode})...</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-[#16191E] flex flex-col items-center justify-center text-white p-4 font-sans">
        <div className="bg-[#242A32] rounded-3xl p-8 max-w-md w-full border border-gray-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-100">Unable to Join Meeting</h2>
          <p className="text-xs text-gray-400 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-[#2D8CFF] hover:bg-[#0E71EB] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#1A1E24] flex flex-col overflow-hidden font-sans">
      
      {/* Top Header */}
      <Header
        title={meeting.title}
        meetingCode={meeting.meeting_code}
        participantCount={gridParticipants.length}
      />

      {/* Main View Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Center Participant Tile Grid */}
        <ParticipantGrid
          participants={gridParticipants}
          isSelfMuted={isSelfMuted}
          isSelfVideoOff={isSelfVideoOff}
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

      {/* Bottom Control Toolbar */}
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
      />

    </div>
  );
}
