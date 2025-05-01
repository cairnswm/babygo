import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '../types';
import { CURRENT_USER_ID, mockMessages } from '../data/mockData';

interface MessageContextType {
  messages: Message[];
  sendMessage: (toUserId: string, adId: string, content: string) => void;
  getUserMessages: (userId: string) => Message[];
  getAdMessages: (adId: string) => Message[];
  markAsRead: (messageId: string) => void;
  getUnreadCount: () => number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const sendMessage = (toUserId: string, adId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      fromUserId: CURRENT_USER_ID,
      toUserId,
      adId,
      content,
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const getUserMessages = (userId: string) =>
    messages.filter(msg => 
      (msg.fromUserId === CURRENT_USER_ID && msg.toUserId === userId) ||
      (msg.toUserId === CURRENT_USER_ID && msg.fromUserId === userId)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getAdMessages = (adId: string) =>
    messages.filter(msg => msg.adId === adId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const getUnreadCount = () =>
    messages.filter(msg => msg.toUserId === CURRENT_USER_ID && !msg.read).length;

  const value = {
    messages,
    sendMessage,
    getUserMessages,
    getAdMessages,
    markAsRead,
    getUnreadCount
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};