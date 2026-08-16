'use client';

import React, { useState } from 'react';
import { X, Send, MessageSquare, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  time: string;
  text: string;
  isSystem?: boolean;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
}

export default function ChatDrawer({ isOpen, onClose, currentUser }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Zoom System',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'Encrypted in-meeting chat initialized. Everyone in the room can see messages.',
      isSystem: true
    }
  ]);

  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser || 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: input.trim()
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <aside
      className="w-[320px] bg-[#242424] border-l border-[#444749] text-white flex flex-col z-20 shrink-0 h-full animate-in slide-in-from-right duration-200"
      role="dialog"
      aria-label="In-meeting chat"
      aria-modal="false"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#444749] flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <MessageSquare className="w-4 h-4 text-[#0e71eb]" aria-hidden="true" />
          <span>In-Meeting Chat</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat panel"
          className="text-[#c5c6c8] hover:text-white p-1 rounded-md hover:bg-[#323232]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite" aria-label="Chat messages" aria-relevant="additions">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            {msg.isSystem ? (
              <div className="p-3 bg-[#1a1a1a] border border-[#444749] rounded-lg text-xs text-[#c5c6c8] flex items-start gap-2">
                <Bot className="w-4 h-4 text-[#0e71eb] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ) : (
              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#444749] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#0e71eb]">{msg.sender}</span>
                  <span className="text-[#767575] text-[10px]">{msg.time}</span>
                </div>
                <p className="text-xs text-white leading-relaxed break-words">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#444749] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message here..."
          className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#444749] rounded text-xs text-white placeholder-[#767575] focus:outline-none focus:border-[#0e71eb] focus:ring-1 focus:ring-[#0e71eb]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3.5 py-2 bg-[#0e71eb] hover:bg-[#0059be] disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
}

