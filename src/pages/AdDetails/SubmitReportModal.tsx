import React, { useState } from "react";
import { X } from "lucide-react";

const SubmitReportModal = ({ onClose, onSubmitReport }) => {
  const [reportReason, setReportReason] = useState("inappropriate");
  const [reportDescription, setReportDescription] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Report Advertisement</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for reporting
          </label>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="inappropriate">Inappropriate Content</option>
            <option value="spam">Spam</option>
            <option value="scam">Potential Scam</option>
            <option value="offensive">Offensive Content</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Please provide more details
          </label>
          <textarea
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            placeholder="Describe why you're reporting this advertisement..."
            className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
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
              onSubmitReport(reportReason, reportDescription);
              setReportReason("inappropriate");
              setReportDescription("");
            }}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            disabled={!reportDescription.trim()}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitReportModal;