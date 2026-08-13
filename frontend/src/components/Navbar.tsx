'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ChevronLeft, ChevronRight, History, Settings,
  CheckCircle2, X, Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="bg-[#EBF0F5] border-b border-gray-200/90 h-12 px-4 flex items-center justify-between sticky top-0 z-40 select-none">
        
        {/* Left: Brand Logo & Navigation History */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-bold text-[18px] tracking-tight text-[#0E71EB]">zoom</span>
            <span className="font-[#1a1a1a] text-[18px] font-[#2e2f3f] tracking-tight text-gray-900">Workplace</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 ml-3 text-gray-500">
            <button
              onClick={() => router.back()}
              className="p-1 hover:text-gray-800 hover:bg-gray-200/70 rounded transition-colors"
              title="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.forward()}
              className="p-1 hover:text-gray-800 hover:bg-gray-200/70 rounded transition-colors"
              title="Go forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:text-gray-800 hover:bg-gray-200/70 rounded transition-colors"
              title="History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ⌘ + K"
              className="w-full bg-[#DFE5EB] hover:bg-[#D5DCE4] focus:bg-white border border-transparent focus:border-[#0E71EB] rounded-lg pl-9 pr-4 py-1 text-xs text-gray-800 placeholder-gray-500 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Upgrade to Pro features.")}
            className="bg-[#0E71EB] hover:bg-[#0059be] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>Upgrade</span>
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            title="User profile"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border border-white flex items-center justify-center font-bold text-xs text-white shadow-xs hover:opacity-90 transition-opacity"
          >
            DH
          </button>
        </div>

      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                <Settings className="w-5 h-5 text-[#0E71EB]" />
                <span>Zoom App Settings</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
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
                className="px-5 py-2 bg-[#0E71EB] hover:bg-[#0059be] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

