'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft, Clock, CheckCircle2, Loader2, Copy, Check, Video } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createScheduledMeeting, Meeting } from '@/lib/api';

export default function SchedulePage() {
  const router = useRouter();

  // Format Date object into local YYYY-MM-DDTHH:mm string for <input type="datetime-local">
  const formatLocalForInput = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Default to tomorrow at 10:00 AM in the user's local timezone
  const getDefaultDateTime = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return formatLocalForInput(d);
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState(getDefaultDateTime());
  const [durationMins, setDurationMins] = useState(30);

  const [loading, setLoading] = useState(false);
  const [scheduledMeeting, setScheduledMeeting] = useState<Meeting | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Please enter a meeting topic.');
      return;
    }

    const selectedDate = new Date(scheduledTime);
    if (isNaN(selectedDate.getTime())) {
      setError('Please select a valid date and time.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse local input and convert to UTC ISO string for consistent storage
      const isoTime = selectedDate.toISOString();
      const meeting = await createScheduledMeeting({
        title: cleanTitle,
        description: description.trim() || undefined,
        scheduled_time: isoTime,
        duration_mins: Number(durationMins)
      });

      setScheduledMeeting(meeting);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to schedule meeting.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!scheduledMeeting) return;
    const fullUrl = `${window.location.origin}${scheduledMeeting.invite_link}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FA] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#2D8CFF] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-1 text-[#2D8CFF] font-bold text-sm">
              <Calendar className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </div>
          </div>

          {!scheduledMeeting ? (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-gray-900">Schedule a Zoom Meeting</h1>
                <p className="text-xs text-gray-500">Configure meeting topic, start time, and duration</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Meeting Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Product Roadmap & Planning"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2D8CFF] focus:bg-white transition-all text-gray-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Description / Agenda (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide context or instructions for participants..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-normal focus:outline-hidden focus:ring-2 focus:ring-[#2D8CFF] focus:bg-white transition-all text-gray-900"
                  />
                </div>

                {/* Date Time & Duration Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Start Date & Time (Local Time) *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="datetime-local"
                        required
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2D8CFF] focus:bg-white transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Duration
                    </label>
                    <select
                      value={durationMins}
                      onChange={(e) => setDurationMins(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2D8CFF] focus:bg-white transition-all text-gray-900"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>1 Hour</option>
                      <option value={90}>1.5 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <Link
                    href="/"
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#2D8CFF] hover:bg-[#0E71EB] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scheduling...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Save & Schedule</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </>
          ) : (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-gray-900">Meeting Scheduled!</h2>
                <p className="text-xs text-gray-500">Your meeting has been added to the upcoming schedule.</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Topic</span>
                  <p className="font-bold text-base text-gray-900">{scheduledMeeting.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Meeting ID</span>
                    <p className="font-mono font-bold text-sm text-[#2D8CFF]">{scheduledMeeting.meeting_code}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Duration</span>
                    <p className="font-semibold text-xs text-gray-700">{scheduledMeeting.duration_mins} Minutes</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Invite URL</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}${scheduledMeeting.invite_link}`}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-600"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => router.push(`/meeting/${scheduledMeeting.meeting_code}`)}
                  className="px-6 py-2.5 bg-[#2D8CFF] hover:bg-[#0E71EB] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <Video className="w-4 h-4 fill-current" />
                  <span>Start Meeting Now</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
