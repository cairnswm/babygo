import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useClassified } from "../../context/ClassifiedContext";
import { useUserRating } from "../../context/UserRatingContext";
import { useMessage } from "../../context/MessageContext";
import { useReport } from "../../context/ReportContext";
import {
  Heart,
  MapPin,
  Tag,
  Calendar,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Flag,
} from "lucide-react";
import UserRatings from "../shared/UserRatings";
import { accessElf } from "../../auth/utils/accessElf";
import { useAuth } from "../../auth/hooks/useAuth";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { ClassifiedAd } from "../../types";
import { useCachedItem } from "../../context/useCacheItem";
import { REACT_APP_FILES } from "../../env";
import { combineUrlAndPath } from "../../auth/utils/combineUrlAndPath";
import MessageIcon from "../home/MessageIcon";
import ConditionBadge from "../../components/ConditionBadge";

const AdDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  accessElf.track("Advertisement Details Page", id);
  const navigate = useNavigate();
  const { ads, deleteAd, isCurrentUserAd, getSeller } = useClassified();
  const { getUser } = useUserRating();
  const { sendMessage, getConversationsForAd } = useMessage();
  const { addReport } = useReport();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [reportReason, setReportReason] = useState("inappropriate");
  const [reportDescription, setReportDescription] = useState("");
  const { user } = useAuth();
  const [seller, setSeller] = useState();

  const [ad, setAd] = useState<ClassifiedAd | undefined>();

  const conversations = getConversationsForAd(Number(id));
  const hasMessages = conversations && conversations.length > 0;

  const isMyAd = ad?.user_id === user?.id;

  const fetchSellerData = async (userId: string) => {
    const sellerData = await getSeller(userId);
    setSeller(sellerData);
  };

  useEffect(() => {
    const tad = ads.find((ad) => Number(ad.id) === Number(id));
    console.log("Finding Advert", id, tad, ads);
    if (tad) {
      setAd(tad);
      fetchSellerData(tad.user_id);
    }
  }, [id, ads]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      deleteAd(ad.id);
      navigate("/app");
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? ad.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === ad.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isFullscreen) {
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "Escape") setIsFullscreen(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageContent.trim()) {
      sendMessage(ad.user_id, ad.id, messageContent);
      setMessageContent("");
      setShowMessageModal(false);
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportDescription.trim()) {
      addReport(ad.id, reportReason, reportDescription);
      setReportReason("inappropriate");
      setReportDescription("");
      setShowReportModal(false);
      alert("Thank you for your report. We will review it shortly.");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useScrollToTop();

  if (!ad) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Advertisement not found
          </h1>
          <button
            onClick={() => navigate("/app")}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const sellerDisplayName = seller?.username
    ? seller.username
    : seller?.firstname && seller?.lastname
    ? `${seller.firstname} ${seller.lastname}`
    : seller?.id
    ? `User${seller.id}`
    : "Unknown";

  return (
    <>
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {ad.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {ad.location}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date(ad.posted_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            {isCurrentUserAd(ad.id) ? (
              <div className="flex gap-2">
                <Link
                  to={`/edit-ad/${ad.id}`}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              user &&
              user?.id !== seller?.id && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition flex items-center gap-2"
                >
                  <Flag size={20} />
                  <span className="text-sm">Report Ad</span>
                </button>
              )
            )}
          </div>

          {isMyAd && (
            <div className="mb-4">
                <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-300 text-black rounded-lg hover:bg-blue-600 hover:text-white transition">
                  Sold
                </button>
                <button className="px-4 py-2 bg-red-300 text-black rounded-lg hover:bg-red-600 hover:text-white transition">
                  Remove
                </button>
                <button className="px-4 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-600 hover:text-white transition">
                  Priority
                </button>
                </div>
            </div>
          )}

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div
                className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer relative group"
                onClick={() => setIsFullscreen(true)}
              >
                <img
                  src={"/"+ad.images[currentImageIndex]}
                  alt={ad.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view fullscreen
                  </span>
                </div>
              </div>
              {ad.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {ad.images.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-opacity ${
                        index === currentImageIndex
                          ? "ring-2 ring-pink-500"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={"/"+image}
                        alt={`${ad.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-pink-600">
                  R{ad.price}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex px-4 py-2 rounded-full transition">
                    <MessageIcon adId={ad.id} title="" staticPosition />
                  </div>
                  <button className="p-2 rounded-full hover:bg-pink-50 transition flex items-center justify-center">
                    <Heart
                      size={24}
                      className="text-gray-600 hover:text-pink-500"
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <ConditionBadge condition={ad.item_condition} />
                <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center">
                  <Tag size={14} className="mr-1" />
                  {ad.category}
                </span>
                {ad.priority && (
                  <span className="text-sm bg-gradient-to-r from-pink-500 to-blue-500 text-white px-3 py-1 rounded-full">
                    Priority Ad
                  </span>
                )}
              </div>

              <div className="prose">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{ad.description}</p>
              </div>

              {/* Seller Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Seller Information
                </h3>
                {seller && (
                  <div className="space-y-3">
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {seller.avatar && (
                          <img
                            src={combineUrlAndPath(
                              REACT_APP_FILES,
                              seller.avatar
                            )}
                            alt={sellerDisplayName}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{sellerDisplayName}</p>
                          <UserRatings userId={seller.id} />
                        </div>
                      </div>
                      {user && user?.id !== seller?.id && (
                        <button
                          onClick={() => setShowMessageModal(true)}
                          className={`${
                            user
                              ? "bg-pink-500 hover:bg-pink-600"
                              : "bg-gray-300"
                          } text-white px-4 py-2 rounded-full transition`}
                          disabled={!user || isCurrentUserAd(ad.id)}
                        >
                          <div className="flex items-center gap-2 ">
                            <MessageSquare size={18} />
                            Message
                          </div>
                          {user ? null : (
                            <p className="text-xs">Login to message</p>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Gallery */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            <X size={32} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={handlePrevImage}
          >
            <ChevronLeft size={48} />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={handleNextImage}
          >
            <ChevronRight size={48} />
          </button>

          <img
            src={ad.images[currentImageIndex]}
            alt={ad.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {ad.images.length}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Message {sellerDisplayName}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSendMessage}>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                  disabled={!messageContent.trim()}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Report Advertisement</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitReport}>
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
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                  disabled={!reportDescription.trim()}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdDetailsPage;
