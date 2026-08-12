'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Copy, Check, Play, Loader2, Sparkles } from 'lucide-react';
import { createInstantMeeting, Meeting } from '@/lib/api';

interface InstantMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstantMeetingModal({ isOpen, onClose }: InstantMeetingModalProps) {
  const router = useRouter();
  const [meetingTitle, setMeetingTitle] = useState('Instant Huddle');
  const [loading, setLoading] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState<Meeting | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setLoading(true);
    try {
      const meeting = await createInstantMeeting(meetingTitle);
      setCreatedMeeting(meeting);
    } catch (err) {
      console.error(err);
      alert('Failed to generate instant meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdMeeting) return;
    const fullUrl = `${window.location.origin}${createdMeeting.invite_link}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStartNow = () => {
    if (!createdMeeting) return;
    router.push(`/meeting/${createdMeeting.meeting_code}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/30">
              <Video className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">Start Instant Meeting</h3>
              <p className="text-xs text-gray-500">Generate a live room code instantly</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {!createdMeeting ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Meeting Topic
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="e.g. Quick Standup"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2D8CFF] focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#2D8CFF] shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                Clicking <strong>Generate Room</strong> will automatically create a unique 9-digit Zoom code (`xxx-xxx-xxx`) and copyable invite link for instant joining.
              </p>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="px-6 py-2.5 bg-[#2D8CFF] hover:bg-[#0E71EB] text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 fill-current" />
                    <span>Generate Room</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-widest block mb-1">
                Meeting Room Ready
              </span>
              <span className="text-3xl font-extrabold text-gray-900 tracking-wider font-mono">
                {createdMeeting.meeting_code}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Invite Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}${createdMeeting.invite_link}`}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleStartNow}
                className="px-6 py-2.5 bg-[#2D8CFF] hover:bg-[#0E71EB] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Enter Meeting Room</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
