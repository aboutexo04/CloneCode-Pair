import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Loader2,
  Trash2,
  Code2,
  Terminal,
  Play
} from 'lucide-react';
import { ChatMessage, Role } from '@/types';
import { sendChatMessage } from '@/services/geminiService';
import { ChatMessageBubble } from '@/components/ChatMessageBubble';

const App: React.FC = () => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [editorContent, setEditorContent] = useState<string>('// Start coding here...\n// Gemini will guide you on the left!');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Chat
  useEffect(() => {
    const initialMsg: ChatMessage = {
      id: 'init-1',
      role: Role.MODEL,
      text: "Hi! I'm your Clone Coding Tutor. \n\nWhat would you like to build today? (e.g., *'A simple Login Form'*, *'A Netflix styling clone'*)",
      timestamp: Date.now()
    };
    setMessages([initialMsg]);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(
        [...messages, userMsg],
        userMsg.text,
        editorContent // Send current code context
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "Sorry, I had trouble connecting. Please try again.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    setEditorContent(prev => prev + "\n" + code);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      setEditorContent(value.substring(0, start) + "  " + value.substring(end));

      // We need to defer the cursor update slightly to work with React state update
      setTimeout(() => {
        if (editorRef.current) {
            editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const clearSession = () => {
    if(confirm("Start over? This will clear chat and code.")) {
        setMessages([{
            id: Date.now().toString(),
            role: Role.MODEL,
            text: "Ready to start something new! What shall we build?",
            timestamp: Date.now()
        }]);
        setEditorContent('// Start coding here...');
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans overflow-hidden">

      {/* LEFT PANEL: CHAT */}
      <div className="w-1/2 flex flex-col border-r border-gray-800 bg-gray-900/30">
        {/* Chat Header */}
        <header className="h-14 px-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
          <div className="flex items-center gap-2">
            <Code2 className="text-indigo-400" size={20} />
            <h1 className="font-bold text-gray-200">CloneCode AI</h1>
          </div>
          <button
            onClick={clearSession}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/10 rounded transition-colors"
            title="Reset Session"
          >
            <Trash2 size={18} />
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.map(msg => (
            <ChatMessageBubble
                key={msg.id}
                message={msg}
                onCopyCode={handleCopyCode}
            />
          ))}
          {isLoading && (
              <div className="p-4 flex gap-3 animate-pulse">
                   <div className="w-8 h-8 rounded-full bg-indigo-600/50"></div>
                   <div className="flex-1 space-y-2">
                       <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                       <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                   </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-12 scrollbar-hide"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`absolute right-2 top-2 p-1.5 rounded-md transition-colors
                ${!inputMessage.trim() || isLoading
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-indigo-400 hover:bg-indigo-500/10'
                }
              `}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-2">
            Ask Gemini to review your code or give you the next step.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: CODE EDITOR */}
      <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
        {/* Editor Header */}
        <div className="h-14 px-4 border-b border-[#333] flex items-center justify-between bg-[#252526]">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
             <Terminal size={16} />
             <span className="font-mono">Editor / Playground</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Auto-saved</span>
            {/* Run Button Visual Only */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition-colors opacity-80 cursor-default">
                <Play size={12} fill="currentColor" />
                Practice Mode
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative group">
          <textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 outline-none resize-none leading-relaxed"
            style={{ tabSize: 2 }}
          />
          <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 pointer-events-none">
              Gemini can read this content
          </div>
        </div>

        {/* Editor Status Bar */}
        <div className="bg-[#007acc] text-white px-3 py-1 text-xs flex justify-between">
            <span>TypeScript / React</span>
            <span>Ln {editorContent.split('\n').length}, Col 1</span>
        </div>
      </div>
    </div>
  );
};

export default App;
