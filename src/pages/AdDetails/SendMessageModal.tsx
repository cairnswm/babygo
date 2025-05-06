import React, { useState } from "react";
import { X, MessageSquare } from "lucide-react";

const SendMessageModal = ({ sellerDisplayName, onClose, onSendMessage }) => {
  const [messageContent, setMessageContent] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Message {sellerDisplayName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Write your message here..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSendMessage(messageContent);
              setMessageContent("");
            }}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            disabled={!messageContent.trim()}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageModal;