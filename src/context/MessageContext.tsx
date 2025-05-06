import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Message } from "../types";
import { CURRENT_USER_ID, mockMessages } from "../data/mockData";
import { useAuth } from "../auth/hooks/useAuth";
import { useTenant } from "../auth/hooks/useTenant";
import { combineUrlAndPath } from "../auth/utils/combineUrlAndPath";
import { REACT_APP_BABYGO_API, REACT_APP_TENANT_API } from "../env";
import { useClassified } from "./ClassifiedContext";

export interface Conversation {
  ad_id: number;
  subject: string;
  participant_user_id: number;
  messages: {
    id: number;
    from_user_id: number;
    to_user_id: number;
    content: string;
    created_at: string;
    read_flag: number;
    reply_to_message_id: number | null;
  }[];
}


interface MessageContextType {
  messages: Conversation[];
  sendMessage: (toUserId: string, adId: string, content: string) => void;
  getUserMessages: (userId: string) => Message[];
  getAdMessages: (adId: string) => Message[];
  markAsRead: (messageId: string | number) => void;
  getUnreadCount: () => number;
  getChatUser: (userId: string) => any;
  chatUsers: any[];
  getConversationsForAd: (adId: number) => Conversation[];
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Conversation[]>([]);
  const [chatUsers, setChatUsers] = useState([]);

  const { user, token } = useAuth();
  const { tenant } = useTenant();

  const headers = {
    Authorization: `Bearer ${token}`,
    APP_ID: tenant,
    "Content-Type": "application/json",
  };

  const { getSeller } = useClassified();

  const fetchChatUsers = async (ids: (string | number)[]) => {
    const userPromises = ids.map((id) =>
      fetch(combineUrlAndPath(REACT_APP_TENANT_API, `api.php/user/${id}`), {
        headers,
      }).then((response) => response.json())
    );

    try {
      const users = await Promise.all(userPromises);
      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<string, any>);
      setChatUsers(userMap);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  };

  const getChatUser = (userId: string) => {
    const user = chatUsers[userId];
    return user;
  };

  useEffect(() => {
    if (user) {
      fetch(
        combineUrlAndPath(
          REACT_APP_BABYGO_API,
          `api/api.php/user/${user.id}/messages`
        ),
        {
          headers,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
          const ids = new Set<string>();
          data.forEach((ad) => {
            ad.messages.forEach((msg) => {
              ids.add(msg.from_user_id);
              ids.add(msg.to_user_id);
            });
          });

          fetchChatUsers([...ids]);
        })
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [user, token]);

  const sendMessage = (toUserId: string, adId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      fromUserId: CURRENT_USER_ID,
      toUserId,
      adId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const lastMessage = messages
      .filter((msg) => msg.adId === adId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

    fetch(combineUrlAndPath(REACT_APP_BABYGO_API, "api/api.php/messages"), {
      method: "POST",
      headers,
      body: JSON.stringify({
        to_user_id: toUserId,
        ad_id: adId,
        content,
        reply_to_message_id: lastMessage?.id || null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  const getUserMessages = (userId: string) =>
    messages
      .filter(
        (msg) =>
          (msg.fromUserId === CURRENT_USER_ID && msg.toUserId === userId) ||
          (msg.toUserId === CURRENT_USER_ID && msg.fromUserId === userId)
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  const getAdMessages = (adId: string) =>
    messages
      .filter((msg) => msg.adId === adId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  const markAsRead = (messageId: string | number) => {
    fetch(combineUrlAndPath(REACT_APP_BABYGO_API, `api/api.php/messages/${messageId}/read`), {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error("Error marking message as read:", error));
  };

  
 const getConversationsForAd = (adId: number): Conversation[] => {
  return messages.filter(
    (conversation) =>
      conversation.ad_id === adId
  );
};

  const getUnreadCount = () =>
    messages.filter((msg) => msg.toUserId === CURRENT_USER_ID && !msg.read)
      .length;

  const value = {
    messages,
    sendMessage,
    getUserMessages,
    getAdMessages,
    markAsRead,
    getUnreadCount,
    chatUsers,
    getChatUser,
    getConversationsForAd
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
