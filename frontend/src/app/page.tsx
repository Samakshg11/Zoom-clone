'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Video, Plus, Copy, Check,
  Settings, Home, MessageSquare,
  Info, Calendar, RotateCw,
  Loader2, Hash, Trash2,
  MoreHorizontal, ChevronDown, ChevronRight,
  X, CheckCircle2, Sparkles, Shield, Zap, Send, Layers, Search
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
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [activeTab, setActiveTab] = useState<'home' | 'meetings' | 'chat'>('home');
  const [meetingSearch, setMeetingSearch] = useState('');
  const [meetingFilter, setMeetingFilter] = useState<'all' | 'upcoming' | 'recent'>('upcoming');

  const [showNewMeetingMenu, setShowNewMeetingMenu] = useState(false);
  const [showMoreToolsModal, setShowMoreToolsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Alex Johnson', text: 'Welcome to Zoom Team Chat!', time: '10:14 AM' },
    { id: 2, sender: 'Sarah Connor', text: 'Schedule is set for Q3 Product Review.', time: '10:18 AM' }
  ]);

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

  useEffect(() => {
    const timeout = setTimeout(() => setCurrentTime(new Date()), 0);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    Promise.all([fetchUpcomingMeetings(), fetchRecentMeetings()])
      .then(([upcoming, recent]) => {
        setUpcomingMeetings(upcoming);
        setRecentMeetings(recent);
      })
      .catch((err) => {
        console.error("Failed to load dashboard meetings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, []);

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

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  const handleCopyLink = (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}${meeting.invite_link}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(meeting.meeting_code);
    showToast('✓ Meeting link copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'Demo Host (You)', text: chatInput.trim(), time: 'Just now' }
    ]);
    setChatInput('');
  };

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '12:37 AM';

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Friday, August 14';

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans text-gray-900">
      {/* Toast Notification */}
      <div
        role="alert"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-gray-900 text-white text-xs font-semibold rounded-2xl shadow-2xl flex items-center gap-2 transition-all duration-300 ${
          toast.visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
        {toast.message}
      </div>
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical Navigation Sidebar */}
        <aside className="w-18 bg-[#F7F8FA] border-r border-gray-200/80 flex flex-col items-center justify-between py-4 select-none shrink-0">
          
          {/* Main Navigation Items */}
          <div className="flex flex-col items-center gap-2 w-full px-2">
            
            {/* Home Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer ${
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
              onClick={() => router.push('/schedule')}
              className={`w-full flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer ${
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
              onClick={() => setActiveTab(activeTab === 'chat' ? 'home' : 'chat')}
              className={`w-full flex flex-col items-center justify-center py-2.5 rounded-xl transition-all cursor-pointer ${
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
              onClick={() => setShowMoreToolsModal(true)}
              className="w-full flex flex-col items-center justify-center py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">More</span>
            </button>

          </div>

          {/* Bottom Settings Gear */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 rounded-xl transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex flex-col items-center space-y-8 relative">

          {/* Live Digital Clock & Date */}
          <div className="text-center space-y-1 select-none">
            <h1 suppressHydrationWarning className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1a1a1a]">
              {formattedTime}
            </h1>
            <p suppressHydrationWarning className="text-xs sm:text-sm font-normal text-[#5c5f60]">
              {formattedDate}
            </p>
          </div>

          {/* Quick Action Icons Row */}
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            
            {/* New Meeting */}
            <div className="flex flex-col items-center gap-2 relative">
              <button
                onClick={handleStartInstantMeeting}
                disabled={creatingInstant}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FF742D] hover:bg-[#ff5c00] active:scale-95 text-white flex items-center justify-center shadow-md shadow-orange-500/20 transition-all group cursor-pointer"
                title="Start instant meeting"
              >
                {creatingInstant ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Video className="w-7 h-7 fill-current stroke-none group-hover:scale-105 transition-transform" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNewMeetingMenu(!showNewMeetingMenu)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  <span>New meeting</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showNewMeetingMenu ? 'rotate-180' : ''}`} />
                </button>

                {showNewMeetingMenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setShowNewMeetingMenu(false);
                        handleStartInstantMeeting();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-orange-50 hover:text-[#FF742D] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-[#FF742D]" />
                      <span>Start Instant Meeting</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowNewMeetingMenu(false);
                        handleStartInstantMeeting();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-gray-500" />
                      <span>Start with Video On</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <div className="px-3 py-1.5 text-[11px] text-gray-500 flex items-center justify-between">
                      <span>PMI: 415-892-603</span>
                      <span className="font-semibold text-green-600">Active</span>
                    </div>
                  </div>
                )}
              </div>
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
              You haven&apos;t connected your calendar yet.{' '}
              <Link href="/schedule" className="text-[#0E71EB] font-semibold underline hover:text-[#0059be]">
                Connect now
              </Link>{' '}
              to manage all your meetings and events in one place.
            </p>
          </div>

          {/* Scheduled Meetings Widget Card */}
          <div id="dashboard-meetings" className="w-full max-w-2xl bg-white border border-gray-200/90 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Card Top Title Bar */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-sm text-gray-900">
                <Calendar className="w-4 h-4 text-[#0E71EB]" />
                <span>Upcoming meetings</span>
                {upcomingMeetings.length > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold text-[#0E71EB] bg-blue-50 rounded-full border border-blue-100">
                    {upcomingMeetings.length}
                  </span>
                )}
              </div>
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group flex items-center justify-center disabled:opacity-50 cursor-pointer"
                title="Refresh meetings"
              >
                <RotateCw className={`w-3.5 h-3.5 transition-transform ${loading ? 'animate-spin text-[#0E71EB]' : ''}`} />
              </button>
            </div>

            {/* Search + Filter Bar */}
            <div className="px-4 pb-3 pt-1 border-b border-gray-100 flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-40">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="meeting-search"
                  type="text"
                  value={meetingSearch}
                  onChange={(e) => setMeetingSearch(e.target.value)}
                  placeholder="Search meetings..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E71EB] focus:border-[#0E71EB] transition-all"
                  aria-label="Search meetings"
                />
              </div>
              <div className="flex items-center gap-1" role="group" aria-label="Filter meetings by category">
                {(['upcoming', 'recent', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMeetingFilter(filter)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                      meetingFilter === filter
                        ? 'bg-[#0E71EB] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-pressed={meetingFilter === filter}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Meetings List / Empty State */}
            <div className="p-6">
              {(() => {
                const searchTerm = meetingSearch.toLowerCase().trim();
                const allMeetings = [
                  ...(meetingFilter !== 'recent' ? upcomingMeetings : []),
                  ...(meetingFilter !== 'upcoming' ? recentMeetings : []),
                ];
                const filteredMeetings = searchTerm
                  ? allMeetings.filter(
                      (m) =>
                        m.title.toLowerCase().includes(searchTerm) ||
                        m.meeting_code.toLowerCase().includes(searchTerm)
                    )
                  : meetingFilter === 'all'
                  ? allMeetings
                  : meetingFilter === 'recent'
                  ? recentMeetings
                  : upcomingMeetings;
                return loading ? (
                  <div className="text-center py-8 text-xs text-gray-400 flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#0E71EB]" />
                    <span>Loading meetings...</span>
                  </div>
                ) : filteredMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {filteredMeetings.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 bg-gray-50/70 border border-gray-200/80 rounded-xl flex items-center justify-between gap-4 hover:bg-blue-50/30 hover:border-blue-200 transition-all"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">{m.title}</h4>
                            <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                              m.status === 'live' ? 'bg-red-100 text-red-600' :
                              m.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                              'bg-gray-100 text-gray-500'
                            }`}>{m.status}</span>
                          </div>
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
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                            title="Copy invite link"
                          >
                            {copiedCode === m.meeting_code ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          {m.status !== 'ended' && (
                            <button
                              onClick={() => handleDeleteMeeting(m.meeting_code)}
                              disabled={deletingCode === m.meeting_code}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 disabled:opacity-50 cursor-pointer"
                              title="Remove meeting"
                            >
                              {deletingCode === m.meeting_code ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          {m.status !== 'ended' && (
                            <button
                              onClick={() => {
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem(`zoom_display_name_${m.meeting_code}`, 'Demo Host');
                                }
                                router.push(`/meeting/${m.meeting_code}`);
                              }}
                              className="px-4 py-1.5 bg-[#0E71EB] hover:bg-[#0059be] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                            >
                              Start
                            </button>
                          )}
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
                    <p className="text-xs text-gray-500 font-medium">
                      {meetingSearch ? `No results for "${meetingSearch}"` : 'No meetings found.'}
                    </p>
                  </div>
                );
              })()}
            </div>
            {/* Card Footer Link */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center">
              <button
                onClick={() => router.push('/schedule')}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Open schedule</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

          </div>

        </main>

        {/* Team Chat Slide-over Drawer */}
        {activeTab === 'chat' && (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col z-20 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <MessageSquare className="w-4 h-4 text-[#0E71EB]" />
                <span>Zoom Team Chat</span>
              </div>
              <button
                onClick={() => setActiveTab('home')}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-gray-800">
                    <span>{msg.sender}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{msg.time}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a team message..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0E71EB] focus:bg-white"
              />
              <button
                type="submit"
                className="p-2 bg-[#0E71EB] hover:bg-[#0059be] text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </aside>
        )}

      </div>

      {/* More Tools Modal */}
      {showMoreToolsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-extrabold text-lg">
                <MoreHorizontal className="w-5 h-5 text-[#0E71EB]" />
                <span>Zoom Workplace Tools</span>
              </div>
              <button
                onClick={() => setShowMoreToolsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  alert("🎨 Zoom Whiteboard Opened!");
                  setShowMoreToolsModal(false);
                }}
                className="p-4 bg-purple-50 hover:bg-purple-100/70 border border-purple-100 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
              >
                <Sparkles className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-purple-900">Whiteboard</span>
              </button>

              <button
                onClick={() => {
                  setShowMoreToolsModal(false);
                  setActiveTab('chat');
                }}
                className="p-4 bg-blue-50 hover:bg-blue-100/70 border border-blue-100 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
              >
                <MessageSquare className="w-6 h-6 text-[#0E71EB] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-blue-900">Team Channels</span>
              </button>

              <button
                onClick={() => {
                  alert("☁️ Cloud Recordings & Transcripts");
                  setShowMoreToolsModal(false);
                }}
                className="p-4 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
              >
                <Layers className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-emerald-900">Recordings</span>
              </button>

              <button
                onClick={() => {
                  alert("🧩 App Marketplace Connected");
                  setShowMoreToolsModal(false);
                }}
                className="p-4 bg-amber-50 hover:bg-amber-100/70 border border-amber-100 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer group"
              >
                <Shield className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-amber-900">Apps &amp; Docs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                <Settings className="w-5 h-5 text-[#0E71EB]" />
                <span>Zoom Settings</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-900 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0E71EB] shrink-0 mt-0.5" />
                <span>Logged in as <code className="font-mono">Demo Host</code>. Backend connected to FastAPI &amp; SQLite database.</span>
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-gray-700">
                  <span>Mute mic when joining meeting</span>
                  <input type="checkbox" defaultChecked className="rounded text-[#0E71EB] focus:ring-[#0E71EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-gray-700">
                  <span>Turn off video when joining meeting</span>
                  <input type="checkbox" className="rounded text-[#0E71EB] focus:ring-[#0E71EB]" />
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 bg-[#0E71EB] hover:bg-[#0059be] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
