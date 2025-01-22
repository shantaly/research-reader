"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  type: 'action' | 'response';
  content: string;
  action?: string;
  customPrompt?: string;
  timestamp: Date;
  arxivId: string; // To separate chats for different papers
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addMessages: (messages: Omit<ChatMessage, 'id' | 'timestamp'>[]) => void;
  clearChat: (arxivId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsed.map((msg: Omit<ChatMessage, 'timestamp'> & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addMessages = (newMessages: Omit<ChatMessage, 'id' | 'timestamp'>[]) => {
    const messagesWithIds = newMessages.map(message => ({
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }));
    setMessages(prev => [...prev, ...messagesWithIds]);
  };

  const clearChat = (arxivId: string) => {
    setMessages(prev => prev.filter(message => message.arxivId !== arxivId));
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, addMessages, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 