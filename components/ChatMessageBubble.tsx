import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Role } from '../types';
import { Bot, User, AlertCircle, Copy } from 'lucide-react';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onCopyCode?: (code: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, onCopyCode }) => {
  const isModel = message.role === Role.MODEL;

  return (
    <div className={`flex gap-3 ${isModel ? 'bg-gray-800/40' : ''} p-4 border-b border-gray-800/50`}>
      <div className="flex-shrink-0 mt-1">
        {isModel ? (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
            <Bot size={16} className="text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User size={16} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-200">
            {isModel ? 'Gemini Tutor' : 'You'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {message.isError ? (
           <div className="text-red-400 flex items-center gap-2 text-sm bg-red-900/20 p-3 rounded border border-red-900/50">
             <AlertCircle size={16} />
             {message.text}
           </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
             <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props} : any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeText = String(children).replace(/\n$/, '');
                    
                    return !inline ? (
                      <div className="relative group my-3 border border-gray-700 rounded-lg overflow-hidden bg-gray-950">
                        <div className="flex justify-between items-center px-3 py-1.5 bg-gray-900 border-b border-gray-800">
                             <span className="text-xs text-gray-400 font-mono">{match ? match[1] : 'code'}</span>
                             {onCopyCode && (
                                <button 
                                    onClick={() => onCopyCode(codeText)}
                                    className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                    title="Copy to Editor"
                                >
                                    <Copy size={12} /> Copy
                                </button>
                             )}
                        </div>
                        <div className="p-3 overflow-x-auto">
                            <code className={className} {...props}>
                            {children}
                            </code>
                        </div>
                      </div>
                    ) : (
                      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
             >
                {message.text}
             </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};