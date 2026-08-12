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
    <aside className="w-80 bg-[#1E242C] border-l border-gray-800 text-white flex flex-col z-20 shrink-0 h-full animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm">
          <MessageSquare className="w-4 h-4 text-[#2D8CFF]" />
          <span>In-Meeting Chat</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            {msg.isSystem ? (
              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 flex items-start gap-2">
                <Bot className="w-4 h-4 text-[#2D8CFF] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ) : (
              <div className="bg-gray-800/60 p-3 rounded-xl border border-gray-800 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#2D8CFF]">{msg.sender}</span>
                  <span className="text-gray-500 font-mono text-[10px]">{msg.time}</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed break-words">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message here..."
          className="flex-1 px-3.5 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:ring-1 focus:ring-[#2D8CFF]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3.5 py-2 bg-[#2D8CFF] hover:bg-[#0E71EB] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </aside>
  );
}
