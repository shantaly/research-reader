"use client";

import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';

interface TextSelectionSidebarProps {
  selectedText: string;
  currentPage: number;
  arxivId: string;
  onClose: () => void;
}

const TextSelectionSidebar = ({ selectedText, currentPage, arxivId, onClose }: TextSelectionSidebarProps) => {
  const { messages, addMessage } = useChat();
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [contextText, setContextText] = useState('');
  const [showContextInput, setShowContextInput] = useState(false);

  // Filter messages for current paper
  const currentPaperMessages = messages.filter(msg => msg.arxivId === arxivId);

  const handleAction = async (actionType: string) => {
    if (actionType === 'custom' && !customPrompt) {
      setShowPromptInput(true);
      return;
    }

    setLoading(true);
    
    // Add action to chat
    addMessage({
      type: 'action',
      content: selectedText,
      action: actionType,
      customPrompt: actionType === 'custom' ? customPrompt : undefined,
      arxivId
    });

    try {
      const res = await fetch('/api/papers/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          highlightedText: selectedText,
          interactionType: actionType,
          pageLocation: currentPage,
          arxivId,
          customQuestion: actionType === 'custom' ? customPrompt : undefined,
          contextText: contextText || undefined,
          userId: undefined // Optional, will use default in backend
        }),
      });

      if (!res.ok) throw new Error('Failed to process request');
      
      const data = await res.json();
      
      // Add response to chat
      addMessage({
        type: 'response',
        content: data.content || data.ai_response,
        arxivId
      });

      // Reset custom prompt input after successful action
      if (actionType === 'custom') {
        setCustomPrompt('');
        setShowPromptInput(false);
      }
    } catch (error) {
      console.error('Error processing action:', error);
      addMessage({
        type: 'response',
        content: 'Failed to process request. Please try again.',
        arxivId
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      handleAction('custom');
    }
  };

  const actions = [
    { label: 'Explain', type: 'explain', icon: '🔍' },
    { label: 'ELI5', type: 'eli5', icon: '👶' },
    { label: 'Clarify', type: 'clarify', icon: '💡' },
    { label: 'Quiz', type: 'quiz', icon: '❓' },
    { label: 'Custom', type: 'custom', icon: '✨' },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white/95 backdrop-blur-sm shadow-2xl transform transition-all duration-300 ease-in-out overflow-hidden rounded-l-2xl border-l border-gray-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white/50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Research Assistant</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowContextInput(!showContextInput)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showContextInput ? 'Hide Context' : 'Add Context'}
              </button>
              <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Context Input */}
        {showContextInput && (
          <div className="p-4 border-b border-gray-200 bg-white/50">
            <textarea
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              placeholder="Add additional context here..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        )}

        {/* Selected Text Display */}
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="text-xs font-medium text-blue-600 mb-1">Selected Text</div>
          <div className="text-sm text-gray-800">{selectedText}</div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentPaperMessages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.type === 'response' ? 'items-start' : 'items-end'
              }`}
            >
              {message.type === 'action' && (
                <div className="bg-blue-100 text-blue-800 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-sm">
                  <div className="font-medium text-xs text-blue-600 mb-1">
                    {actions.find(a => a.type === message.action)?.icon} {message.action}
                    {message.customPrompt && (
                      <div className="text-gray-600 mt-1">{message.customPrompt}</div>
                    )}
                  </div>
                  {message.content}
                </div>
              )}
              {message.type === 'response' && (
                <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-sm shadow-sm">
                  {message.content}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Section */}
        <div className="border-t border-gray-200 bg-white/50">
          {showPromptInput ? (
            <div className="p-4">
              <div className="mb-3">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCustomSubmit();
                    }
                  }}
                  placeholder="Enter your custom prompt..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowPromptInput(false);
                    setCustomPrompt('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customPrompt.trim() || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-150 ease-in-out disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {actions.map(({ label, type, icon }) => (
                  <button
                    key={type}
                    onClick={() => handleAction(type)}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors duration-150 ease-in-out disabled:opacity-50 shadow-sm hover:shadow"
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextSelectionSidebar; 