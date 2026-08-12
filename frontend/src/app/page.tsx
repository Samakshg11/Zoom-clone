'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Video, Plus, Calendar, MonitorUp, Copy, Check, 
  RefreshCw, Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { fetchUpcomingMeetings, fetchRecentMeetings, createInstantMeeting, Meeting } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingInstant, setCreatingInstant] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Instant Meeting Creation Handler — directly redirects to /meeting/[code]
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Flexible Time';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F9FA] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Simple Time-aware Greeting */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {getGreeting()}, <span className="text-[#2D8CFF]">Demo Host</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage and launch your video calls</p>
          </div>

          <button
            onClick={loadDashboardData}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Compact 4-Button Action Row (Zoom Desktop Style) */}
        <section className="bg-white rounded-2xl p-6 border border-gray-200/70 shadow-2xs">
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            
            {/* Button 1: New Meeting */}
            <button
              onClick={handleStartInstantMeeting}
              disabled={creatingInstant}
              className="group flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-hidden"
            >
              <div className="w-14 h-14 bg-[#FFF0EB] text-[#FF742D] group-hover:bg-[#FF742D] group-hover:text-white rounded-2xl flex items-center justify-center shadow-xs transition-all mb-2">
                {creatingInstant ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Video className="w-6 h-6 fill-current stroke-none" />
                )}
              </div>
              <span className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900">
                {creatingInstant ? 'Starting...' : 'New Meeting'}
              </span>
            </button>

            {/* Button 2: Join Meeting */}
            <Link
              href="/join"
              className="group flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-hidden"
            >
              <div className="w-14 h-14 bg-[#EBF4FF] text-[#2D8CFF] group-hover:bg-[#2D8CFF] group-hover:text-white rounded-2xl flex items-center justify-center shadow-xs transition-all mb-2">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900">
                Join
              </span>
            </Link>

            {/* Button 3: Schedule Meeting */}
            <Link
              href="/schedule"
              className="group flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-hidden"
            >
              <div className="w-14 h-14 bg-[#FAEEDA] text-[#854F0B] group-hover:bg-[#854F0B] group-hover:text-white rounded-2xl flex items-center justify-center shadow-xs transition-all mb-2">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900">
                Schedule
              </span>
            </Link>

            {/* Button 4: Share Screen */}
            <button
              onClick={() => router.push('/join')}
              className="group flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-hidden"
            >
              <div className="w-14 h-14 bg-[#E6F4EA] text-[#107C41] group-hover:bg-[#107C41] group-hover:text-white rounded-2xl flex items-center justify-center shadow-xs transition-all mb-2">
                <MonitorUp className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900">
                Share screen
              </span>
            </button>

          </div>
        </section>

        {/* Clean 2-Column Section for Upcoming and Recent Meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upcoming Meetings Column */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Upcoming Meetings</h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-[#2D8CFF] rounded-full">
                  {upcomingMeetings.length}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 text-center text-xs text-gray-400">
                Loading meetings...
              </div>
            ) : upcomingMeetings.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 text-center text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-600">No upcoming meetings</p>
                <p className="text-[11px] text-gray-400">Schedule a meeting to see it listed here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-2xs hover:border-blue-200 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 font-normal">
                        <span className="font-mono text-gray-400">{m.meeting_code}</span>
                        <span>•</span>
                        <span>{formatDate(m.scheduled_time)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleCopyLink(m, e)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy Link"
                      >
                        {copiedCode === m.meeting_code ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            localStorage.setItem(`zoom_display_name_${m.meeting_code}`, 'Demo Host');
                          }
                          router.push(`/meeting/${m.meeting_code}`);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#2D8CFF] hover:bg-[#0E71EB] text-white shadow-2xs transition-colors"
                      >
                        Start Meeting
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Meetings Column */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Recent Meetings</h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {recentMeetings.length}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 text-center text-xs text-gray-400">
                Loading history...
              </div>
            ) : recentMeetings.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200/70 text-center text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-600">No recent meetings</p>
                <p className="text-[11px] text-gray-400">Your completed meetings will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-xl p-4 border border-gray-200/70 shadow-2xs transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 font-normal">
                        <span className="font-mono text-gray-400">{m.meeting_code}</span>
                        <span>•</span>
                        <span>{formatDate(m.created_at)}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => router.push(`/join?code=${m.meeting_code}`)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Join Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

      </main>
    </div>
  );
}
