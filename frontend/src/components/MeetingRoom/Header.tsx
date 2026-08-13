'use client';

import React, { useState } from 'react';
import { Lock, LayoutGrid, Info, Check, Copy } from 'lucide-react';

interface MeetingHeaderProps {
  title: string;
  meetingCode: string;
  participantCount: number;
}

export default function Header({ title, meetingCode }: MeetingHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/join/${meetingCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#242424] border-b border-[#444749] shrink-0 h-[48px] text-white">
      {/* Left Title & Security */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-green-500 flex items-center justify-center" title="End-to-End Encrypted">
          <Lock className="w-4 h-4 fill-current stroke-none text-green-500" />
        </span>
        <div className="flex flex-col min-w-0">
          <h1 className="font-semibold text-sm text-white truncate max-w-xs sm:max-w-md">
            {title}
          </h1>
          <span className="text-[11px] text-[#c5c6c8]">
            Meeting ID: {meetingCode}
          </span>
        </div>
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-full hover:bg-[#323232] text-[#c5c6c8] hover:text-white transition-colors flex items-center gap-1.5 text-xs px-2.5 bg-[#1a1a1a] border border-[#444749]"
          title="Copy Meeting Link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
        <button className="p-2 rounded-full hover:bg-[#323232] text-[#c5c6c8] hover:text-white transition-colors flex items-center justify-center" title="View Grid">
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-full hover:bg-[#323232] text-[#c5c6c8] hover:text-white transition-colors flex items-center justify-center" title="Meeting Details">
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

