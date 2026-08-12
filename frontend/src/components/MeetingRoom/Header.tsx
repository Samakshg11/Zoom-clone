'use client';

import React, { useState, useEffect } from 'react';
import { Video, Copy, Check, Clock } from 'lucide-react';

interface MeetingHeaderProps {
  title: string;
  meetingCode: string;
  participantCount: number;
}

export default function Header({ title, meetingCode, participantCount }: MeetingHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/join/${meetingCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="bg-[#16191E] border-b border-gray-800/80 px-6 py-3 text-white flex items-center justify-between z-30 shrink-0">
      
      {/* Left Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 bg-blue-950/80 border border-blue-700/50 text-[#2D8CFF] text-xs px-2.5 py-1 rounded-full font-medium shrink-0">
          <Video className="w-3.5 h-3.5 fill-current stroke-none" />
          <span>Active Meeting</span>
        </div>

        <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>

        <div className="min-w-0">
          <h1 className="font-bold text-sm text-gray-100 truncate max-w-xs sm:max-w-md">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
            <span>ID: {meetingCode}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Timer */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800/60 px-3 py-1.5 rounded-xl border border-gray-700/50 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#2D8CFF]" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>

        {/* Copy Invite Link */}
        <button
          onClick={handleCopyLink}
          className="px-3.5 py-1.5 bg-[#2D8CFF] hover:bg-[#0E71EB] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Invite</span>
            </>
          )}
        </button>
      </div>

    </header>
  );
}
