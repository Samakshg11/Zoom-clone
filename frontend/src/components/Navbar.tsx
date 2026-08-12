'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Video, Settings, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40 px-6 py-3 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#2D8CFF] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-[#0E71EB] transition-all">
              <Video className="w-5 h-5 fill-current stroke-none" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-gray-900 group-hover:text-[#2D8CFF] transition-colors">
                zoom<span className="text-[#2D8CFF] font-light">clone</span>
              </span>
            </div>
          </Link>

          {/* User Profile & Settings */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSettingsModal(true)}
              title="Settings"
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="h-5 w-px bg-gray-200"></div>

            {/* Default Logged In User Avatar */}
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/80 rounded-full py-1 px-2.5">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-semibold flex items-center justify-center text-xs shadow-2xs">
                  DH
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <span className="text-xs font-semibold text-gray-800 pr-1">Demo Host</span>
            </div>

          </div>

        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                <Settings className="w-5 h-5 text-[#2D8CFF]" />
                <span>Zoom App Settings</span>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-900 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D8CFF] shrink-0 mt-0.5" />
                <span>Default user active (`Demo Host`). Backend connected to FastAPI & SQLite database.</span>
              </div>
              
              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-gray-700">
                  <span>Mute mic when joining meeting</span>
                  <input type="checkbox" defaultChecked className="rounded text-[#2D8CFF] focus:ring-[#2D8CFF]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer py-1 text-xs font-medium text-gray-700">
                  <span>Turn off video when joining meeting</span>
                  <input type="checkbox" className="rounded text-[#2D8CFF] focus:ring-[#2D8CFF]" />
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 bg-[#2D8CFF] hover:bg-[#0E71EB] text-white text-xs font-semibold rounded-xl transition-colors"
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
