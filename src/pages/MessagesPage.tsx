import React, { useState, useEffect } from "react";
import { useMessage, Conversation } from "../context/MessageContext";
import { accessElf } from "../auth/utils/accessElf";
import { combineUrlAndPath } from "../auth/utils/combineUrlAndPath";
import { REACT_APP_FILES } from "../env";
import Button from "../components/Button";
import { useAuth } from "../auth/hooks/useAuth";
import { useParams } from "react-router-dom";

const MessagesPage: React.FC = () => {
  const { messages, getChatUser, sendMessage, markAsRead } = useMessage();
  const { adId, participantId } = useParams<{
    adId?: string;
    participantId?: string;
  }>();
  const [replyContent, setReplyContent] = useState<string>("");
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>();

  const setActiveConversation = (adId: number, participantId: number) => {
    const conversation = messages.find(
      (ad) =>
        ad.ad_id === adId && ad.participant_user_id === participantId
    );
    setSelectedConversation(conversation);
  };

  useEffect(() => {
    if (selectedConversation?.messages?.length) {
      console.log("Marking conversation read", selectedConversation);
      const highestId = Math.max(...selectedConversation.messages.map((msg) => msg.id));
      markAsRead(highestId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    console.log("Ad ID:", adId, "Participant ID:", participantId);
    if (adId && participantId) {
      setActiveConversation(Number(adId), Number(participantId));
    } else {
      setSelectedConversation(undefined);
    }
  }, [adId, participantId]);

  accessElf.track("MessagesPage");

  const getUserName = (user) => {
    if (!user) return "Unknown User";
    return (
      user.username || `${user.firstname} ${user.lastname}` || `User${user.id}`
    );
  };

  const selectedChatUser =  getChatUser(selectedConversation?.participant_user_id);

  const handleSendReply = () => {
    if (replyContent.trim() && selectedAdId && selectedParticipantId) {
      sendMessage(selectedParticipantId, selectedAdId, replyContent);
      setReplyContent("");
    }
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold mb-4">Conversations</h2>
            <div className="space-y-2">
              {messages.map((ad) => {
                const firstMessage = ad.messages[0];
                const chatUser = getChatUser(ad.participant_user_id);

                return (
                  <button
                    key={ad.ad_id + "-" + ad.participant_user_id}
                    onClick={() => { setSelectedConversation(ad); }}
                    className={`w-full flex items-center p-3 rounded-lg transition ${
                      selectedConversation?.ad_id === ad.ad_id && selectedConversation?.participant_user_id === ad.participant_user_id
                        ? "bg-pink-50 text-pink-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {chatUser?.avatar && (
                      <img
                        src={combineUrlAndPath(
                          REACT_APP_FILES,
                          chatUser.avatar
                        )}
                        alt={getUserName(chatUser)}
                        className="w-10 h-10 rounded-full mr-3"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="text-left">
                      <p className="font-medium">{ad.subject}</p>
                      <p className="text-sm text-gray-600">
                        {getUserName(chatUser)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages View */}
          <div className="md:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setSelectedConversation(undefined);
                      }}
                      className="md:hidden mr-2 text-gray-600"
                    >
                      Back
                    </button>
                    {selectedChatUser?.avatar && (
                      <img
                        src={combineUrlAndPath(
                          REACT_APP_FILES,
                          selectedChatUser.avatar
                        )}
                        alt={getUserName(selectedChatUser)}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium">
                        {getUserName(selectedChatUser)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {
                          selectedConversation.subject
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => {
                    const isCurrentUser = Number(message.from_user_id) === Number(user.id);
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isCurrentUser
                              ? "bg-pink-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser ? "text-pink-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input */}
                <div className="p-4 border-t flex items-center">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 border rounded-lg p-2 mr-2"
                  />
                  <Button variant="primary" onClick={handleSendReply}>
                    Send
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">
                  Select a conversation to view messages
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
