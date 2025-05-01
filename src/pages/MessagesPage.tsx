import React, { useState } from 'react';
import { useMessage } from '../context/MessageContext';
import { useUserRating } from '../context/UserRatingContext';
import { useClassified } from '../context/ClassifiedContext';
import { ArrowLeft } from 'lucide-react';
import { accessElf } from '../auth/utils/accessElf';

const MessagesPage: React.FC = () => {
  const { messages, sendMessage, getUserMessages } = useMessage();
  const { getUser } = useUserRating();
  const { ads } = useClassified();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  accessElf.track("View Messages Page")

  // Get unique users and their latest message
  const userLatestMessages = [...new Set(messages.map(msg => 
    msg.fromUserId === 'user-1' ? msg.toUserId : msg.fromUserId
  ))].map(userId => {
    const userMessages = getUserMessages(userId);
    return {
      userId,
      latestMessage: userMessages[userMessages.length - 1]
    };
  });

  const selectedUserMessages = selectedUserId ? getUserMessages(selectedUserId) : [];
  const selectedUser = selectedUserId ? getUser(selectedUserId) : null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && replyContent.trim()) {
      // Get the latest message's adId to continue the conversation about the same item
      const latestMessage = selectedUserMessages[selectedUserMessages.length - 1];
      sendMessage(selectedUserId, latestMessage.adId, replyContent);
      setReplyContent('');
    }
  };

  const getAdTitle = (adId: string) => {
    const ad = ads.find(ad => ad.id === adId);
    return ad?.title || 'Unknown Item';
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users list */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold mb-4">Conversations</h2>
            <div className="space-y-2">
              {userLatestMessages.map(({ userId, latestMessage }) => {
                const user = getUser(userId);
                if (!user || !latestMessage) return null;
                
                const unreadCount = messages.filter(msg => 
                  msg.fromUserId === userId && !msg.read
                ).length;
                
                return (
                  <button
                    key={userId}
                    onClick={() => setSelectedUserId(userId)}
                    className={`w-full flex items-start p-3 rounded-lg transition ${
                      selectedUserId === userId 
                        ? 'bg-pink-50 text-pink-600' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3 text-left">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        Re: {getAdTitle(latestMessage.adId)}
                      </p>
                      {unreadCount > 0 && (
                        <span className="text-sm text-pink-500">
                          {unreadCount} new {unreadCount === 1 ? 'message' : 'messages'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="md:col-span-2">
            {selectedUser ? (
              <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <button
                      onClick={() => setSelectedUserId(null)}
                      className="md:hidden mr-2 text-gray-600"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{selectedUser.name}</p>
                      {selectedUserMessages.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Re: {getAdTitle(selectedUserMessages[0].adId)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedUserMessages.map(message => {
                    const isCurrentUser = message.fromUserId === 'user-1';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-pink-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply form */}
                <form onSubmit={handleSendReply} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;