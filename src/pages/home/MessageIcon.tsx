import React, { useState, useRef, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../context/MessageContext'

interface MessageIconProps {
  adId: number;
  title?: string;
  staticPosition?: boolean;
}

const MessageIcon: React.FC<MessageIconProps> = ({ adId, title = "", staticPosition = false }) => {
  const { getChatUser, getConversationsForAd } = useMessage();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const conversations = getConversationsForAd(adId);

  const getUserName = (user) => {
    if (!user) return "Unknown User";
    return (
      user.username || `${user.firstname} ${user.lastname}` || `User${user.id}`
    );
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Ad ID:", adId, "Conversations:", conversations);
    if (conversations.length === 1) {
      const singleConversation = conversations[0];
      console.log("Navigate for single conversation:", singleConversation);
      navigate(`/messages/${adId}/${singleConversation.participant_user_id}`);
    } else {
      console.log("Toggle dropdown for multiple conversations:", conversations);
      setShowDropdown(!showDropdown);
    }
  };

  const handleParticipantClick = (e, participantId: number) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/messages/${adId}/${participantId}`);
  };

  if (!conversations || conversations.length === 0) {
    return null; // No conversations to display
  }

  const totalUnreadCount = conversations.reduce((count, conversation) => {
    const messages = conversation.messages || [];
    return count + messages.filter((msg) => msg.read_flag === 0).length;
  }, 0);

  const buttonClass = 'relative p-2 rounded-full hover:bg-opacity-100 transition text-gray-600 bg-white bg-opacity-90';

  return (
    <div className="relative" ref={dropdownRef}>
      <button className={buttonClass} onClick={handleIconClick}>
        <Mail size={24} /> {title}
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {totalUnreadCount}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="absolute top-10 right-0 bg-white shadow-md rounded-md w-56">
          {conversations.map((conversation) => {
            const messages = conversation.messages || [];
            const participantName = getUserName(getChatUser(conversation.participant_user_id));
            const unreadCount = messages.filter((msg) => msg.read_flag === 0).length;
            return (
              <div
                key={conversation.participant_user_id}
                className="flex items-center justify-between gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={(e) => handleParticipantClick(e, conversation.participant_user_id)}
              >
                <span className="truncate max-w-[150px] text-sm text-gray-800" title={participantName}>{participantName}</span>
                {unreadCount > 0 && (
                  <span className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default MessageIcon;