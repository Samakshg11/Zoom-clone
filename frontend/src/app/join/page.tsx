'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Video, ArrowLeft, Loader2, AlertCircle, User, KeyRound,
  Home, MessageSquare, MoreHorizontal, Settings
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { fetchMeetingDetails, joinMeeting } from '@/lib/api';

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [meetingInput, setMeetingInput] = useState('');
  const [displayName, setDisplayName] = useState('Demo Guest');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const codeParam = searchParams.get('code') || searchParams.get('meeting');
    if (codeParam) {
      setMeetingInput(codeParam);
    }
  }, [searchParams]);

  const extractCode = (input: string): string => {
    let clean = input.trim();
    if (clean.includes('/join/')) {
      clean = clean.split('/join/')[1];
    }
    return clean.split('?')[0].trim();
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const code = extractCode(meetingInput);
    if (!code) {
      setErrorMessage('Please enter a valid meeting code or invite link.');
      return;
    }
    const cleanName = displayName.trim();
    if (!cleanName) {
      setErrorMessage('Please enter your display name.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Validate meeting exists
      const meeting = await fetchMeetingDetails(code);
      if (!meeting) {
        setErrorMessage(`Meeting code "${code}" was not found or has expired.`);
        setLoading(false);
        return;
      }

      if (meeting.status === 'ended') {
        setErrorMessage(`Meeting "${meeting.title}" has already ended.`);
        setLoading(false);
        return;
      }

      // Step 2: Call Join API
      await joinMeeting(code, cleanName);

      // Save display name locally for the meeting room
      if (typeof window !== 'undefined') {
        localStorage.setItem(`zoom_display_name_${meeting.meeting_code}`, cleanName);
      }

      // Step 3: Redirect to meeting room
      router.push(`/meeting/${meeting.meeting_code}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Unable to join meeting. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full my-8 px-4">
      <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#0E71EB] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-1 text-[#0E71EB] font-bold text-sm">
            <Video className="w-4 h-4 fill-current" />
            <span>Zoom Join</span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-gray-900">Join a Meeting</h1>
          <p className="text-xs text-gray-500">Enter meeting ID or invite link to enter the room</p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-2.5 font-medium animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-5">
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Meeting ID or Invite Link *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={meetingInput}
                onChange={(e) => setMeetingInput(e.target.value)}
                placeholder="e.g. 982-415-307"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0E71EB] focus:bg-white transition-all text-gray-900 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Your Display Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0E71EB] focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0E71EB] hover:bg-[#0059be] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating Meeting...</span>
                </>
              ) : (
                <span>Join Meeting</span>
              )}
            </button>
          </div>

        </form>

        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            By joining, you agree to the Zoom Terms of Service.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function JoinPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-[72px] bg-[#F7F8FA] border-r border-gray-200/80 flex flex-col items-center justify-between py-4 select-none shrink-0">
          <div className="flex flex-col items-center gap-2 w-full px-2">
            
            <button
              onClick={() => router.push('/')}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-all"
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button
              onClick={() => router.push('/join')}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl bg-white shadow-xs border border-gray-200/80 text-gray-900 font-semibold transition-all"
            >
              <Video className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Meetings</span>
            </button>

            <button
              onClick={() => alert("Chat drawer.")}
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
            onClick={() => router.push('/')}
            className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 rounded-xl transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-6 h-6 text-[#0E71EB] animate-spin" />
            </div>
          }>
            <JoinContent />
          </Suspense>
        </main>

      </div>
    </div>
  );
}

