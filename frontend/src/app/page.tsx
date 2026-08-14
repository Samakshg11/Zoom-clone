'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Video, Plus, Calendar as CalendarIcon, Copy, Check,
  ChevronDown, ExternalLink, Settings, Home, MessageSquare,
  MoreHorizontal, Info, ChevronLeft, ChevronRight, Play,
  Loader2, Hash, Trash2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { fetchUpcomingMeetings, fetchRecentMeetings, createInstantMeeting, cancelMeeting, Meeting } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingInstant, setCreatingInstant] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'meetings' | 'chat'>('home');

  const handleDeleteMeeting = async (meetingCode: string) => {
    if (!confirm('Remove this scheduled meeting?')) return;
    setDeletingCode(meetingCode);
    const ok = await cancelMeeting(meetingCode);
    if (ok) {
      setUpcomingMeetings((prev) => prev.filter((m) => m.meeting_code !== meetingCode));
    } else {
      alert('Failed to remove meeting. Please try again.');
    }
    setDeletingCode(null);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [upcoming, recent] = await Promise.all([
        fetchUpcomingMeetings(),
        fetchRecentMeetings()
      ]);
      setUpcomingMeetings(upcoming);
      setRecentMeetings(recent);
    } catch (err) {
      console.error("Failed to load dashboard meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInstantMeeting = async () => {
    if (creatingInstant) return;
    setCreatingInstant(true);
    try {
      const meeting = await createInstantMeeting("Instant Meeting");
      if (typeof window !== 'undefined') {
        localStorage.setItem(`zoom_display_name_${meeting.meeting_code}`, 'Demo Host');
      }
      router.push(`/meeting/${meeting.meeting_code}`);
    } catch (err) {
      console.error("Error creating instant meeting:", err);
      alert("Could not start instant meeting. Please try again.");
      setCreatingInstant(false);
    }
  };

  const handleCopyLink = (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}${meeting.invite_link}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(meeting.meeting_code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '12:37 AM';

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Friday, August 14';

  const shortDateHeader = currentTime
    ? currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Aug 14';

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans text-gray-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical Navigation Sidebar */}
        <aside className="w-18 bg-[#F7F8FA] border-r border-gray-200/80 flex flex-col items-center justify-between py-4 select-none shrink-0">
          
          {/* Main Navigation Items */}
          <div className="flex flex-col items-center gap-2 w-full px-2">
            
            {/* Home Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'bg-white shadow-xs border border-gray-200/80 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            {/* Meetings Tab */}
            <button
              onClick={() => router.push('/join')}
              className={`w-full flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${
                activeTab === 'meetings'
                  ? 'bg-white shadow-xs border border-gray-200/80 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Video className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Meetings</span>
            </button>

            {/* Chat Tab */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${
                activeTab === 'chat'
                  ? 'bg-white shadow-xs border border-gray-200/80 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Chat</span>
            </button>

            {/* More Tab */}
            <button
              onClick={() => alert("More tools & apps.")}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-all"
            >
              <MoreHorizontal className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">More</span>
            </button>

          </div>

          {/* Bottom Settings Gear */}
          <button
            onClick={() => router.push('/join')}
            className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 rounded-xl transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex flex-col items-center space-y-8">

          {/* Live Digital Clock & Date */}
          <div className="text-center space-y-1 select-none">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1a1a1a]">
              {formattedTime}
            </h1>
            <p className="text-xs sm:text-sm font-normal text-[#5c5f60]">
              {formattedDate}
            </p>
          </div>

          {/* Quick Action Icons Row */}
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            
            {/* New Meeting */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleStartInstantMeeting}
                disabled={creatingInstant}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FF742D] hover:bg-[#ff5c00] active:scale-95 text-white flex items-center justify-center shadow-md shadow-orange-500/20 transition-all group"
                title="Start instant meeting"
              >
                {creatingInstant ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Video className="w-7 h-7 fill-current stroke-none group-hover:scale-105 transition-transform" />
                )}
              </button>
              <button
                onClick={handleStartInstantMeeting}
                className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                <span>New meeting</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            {/* Join */}
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/join"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0E71EB] hover:bg-[#0059be] active:scale-95 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition-all group"
                title="Join meeting with ID"
              >
                <Plus className="w-8 h-8 stroke-[2.5] group-hover:scale-105 transition-transform" />
              </Link>
              <Link
                href="/join"
                className="text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Join
              </Link>
            </div>

            {/* Schedule */}
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/schedule"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0E71EB] hover:bg-[#0059be] active:scale-95 text-white flex flex-col items-center justify-center shadow-md shadow-blue-500/20 transition-all group relative"
                title="Schedule a future meeting"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider -mb-0.5">AUG</span>
                  <span className="text-lg font-extrabold leading-none">14</span>
                </div>
              </Link>
              <Link
                href="/schedule"
                className="text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                Schedule
              </Link>
            </div>

          </div>

          {/* Connected Calendar Notification Banner */}
          <div className="w-full max-w-2xl bg-[#F0F6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-[#0E71EB] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 leading-relaxed">
              You haven't connected your calendar yet.{' '}
              <Link href="/schedule" className="text-[#0E71EB] font-semibold underline hover:text-[#0059be]">
                Connect now
              </Link>{' '}
              to manage all your meetings and events in one place.
            </p>
          </div>

          {/* Calendar & Scheduled Meetings Widget Card */}
          <div className="w-full max-w-2xl bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Card Top Title Bar */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1 font-semibold text-sm text-gray-900">
                <span>Today, {shortDateHeader}</span>
                <button
                  onClick={() => setShowCalendarMenu((previous) => !previous)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Calendar options"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => router.push('/schedule')}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Open calendar"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Card Toolbar Controls */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-600 relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span>Today</span>
                </button>
                <div className="flex items-center gap-1 text-gray-400">
                  <button
                    onClick={() => shiftViewDate(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Previous day"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => shiftViewDate(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Next day"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowCalendarPanel((previous) => !previous)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Show calendar"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

            </div>

            {/* Meetings List / Empty State */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8 text-xs text-gray-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#0E71EB]" />
                  <span>Loading scheduled meetings...</span>
                </div>
              ) : upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeetings.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 bg-gray-50/70 border border-gray-200/80 rounded-xl flex items-center justify-between gap-4 hover:bg-blue-50/30 hover:border-blue-200 transition-all"
                    >
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{m.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-normal">
                          <span className="font-mono text-gray-400 flex items-center gap-0.5">
                            <Hash className="w-3 h-3" />
                            {m.meeting_code}
                          </span>
                          <span>•</span>
                          <span>
                            {m.scheduled_time
                              ? new Date(m.scheduled_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
                              : 'Flexible Time'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => handleCopyLink(m, e)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                          title="Copy invite link"
                        >
                          {copiedCode === m.meeting_code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(m.meeting_code)}
                          disabled={deletingCode === m.meeting_code}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 disabled:opacity-50"
                          title="Remove meeting"
                        >
                          {deletingCode === m.meeting_code ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              localStorage.setItem(`zoom_display_name_${m.meeting_code}`, 'Demo Host');
                            }
                            router.push(`/meeting/${m.meeting_code}`);
                          }}
                          className="px-4 py-1.5 bg-[#0E71EB] hover:bg-[#0059be] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <div className="w-20 h-20 relative flex items-center justify-center">
                    <svg className="w-16 h-16 text-indigo-300" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 8L48 24H16L32 8Z" fill="#818CF8" fillOpacity="0.4" />
                      <path d="M32 8C24 16 16 24 16 24H48C48 24 40 16 32 8Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M32 24V48" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M20 48H44" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">No meetings scheduled.</p>
                </div>
              )}
            </div>
            {/* Card Footer Link */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center">
              <button
                onClick={() => router.push('/schedule')}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <span>Open schedule</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

          </div>

        </main>

      </div>
    </div>
  );
}


