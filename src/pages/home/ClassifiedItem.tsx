import React from "react";
import { Heart, MapPin, Tag, Star, Edit, Trash2 } from "lucide-react";
import { ClassifiedAd } from "../../../project/src/types";
import { Link, useNavigate } from "react-router-dom";
import { useClassified } from "../../context/ClassifiedContext";
import MessageIcon from "./MessageIcon";
import { useAuth } from "../../auth/hooks/useAuth";
import ConditionBadge from "../../components/ConditionBadge";

interface ClassifiedItemProps {
  ad: ClassifiedAd;
}

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "New":
      return "bg-green-100 text-green-800";
    case "Like New":
      return "bg-teal-100 text-teal-800";
    case "Good":
      return "bg-blue-100 text-blue-800";
    case "Fair":
      return "bg-yellow-100 text-yellow-800";
    case "Poor":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "available":
      return { color: "bg-green-100 text-green-800", text: "Available" };
    case "pending":
      return { color: "bg-yellow-100 text-yellow-800", text: "Pending" };
    case "sold":
      return { color: "bg-red-100 text-red-800", text: "Sold" };
    case "removed":
      return { color: "bg-gray-100 text-gray-800", text: "Removed" };
    default:
      return { color: "bg-gray-100 text-gray-800", text: status };
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
};

const ClassifiedItem: React.FC<ClassifiedItemProps> = ({ ad }) => {
  const { deleteAd, isCurrentUserAd, toggleFavorite } = useClassified();
  const navigate = useNavigate();
  const canEdit = isCurrentUserAd(ad.id);
  const { user} = useAuth();

  const handleAdClick = () => {
    navigate(`/ad/${ad.id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      deleteAd(ad.id);
    }
  };

  if (ad.status === "removed" && ad.user_id !== user?.id) return null;

  return (
    <div
      className={`rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-300 ${
        ad.priority ? "ring-2 ring-pink-500 relative" : ""
      } cursor-pointer relative`}
      onClick={handleAdClick}
    >
      {/* Sold Overlay */}
      {(ad.status === "sold" || ad.status === "removed") && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-4xl font-bold py-2 px-8 rotate-[-35deg] shadow-lg opacity-90">
            {ad.status === "sold" ? "SOLD" : "REMOVED"}
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={"/" + (ad.images[0] ?? "NONE")}
          alt={ad.title}
          className={`w-full h-full object-cover transition duration-500 hover:scale-110 ${
            ad.status === "sold" ? "opacity-50" : ""
          }`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(ad.id);
          }}
          className={`absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition text-gray-600`}
        >
          {ad.favorite ? <Heart fill="red" size={24} /> : <Heart size={24} />}
        </button>
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <MessageIcon adId={ad.id} />
          {ad.priority === 1 && (
            <div className="bg-gradient-to-r from-pink-500 to-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Priority
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-1">
            {ad.title}
          </h3>
          <span className="font-bold text-lg text-pink-600">R{ad.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {ad.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <ConditionBadge condition={ad.item_condition} />
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center">
            <Tag size={12} className="mr-1" />
            {ad.category}
          </span>
          {ad.status !== "available" && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                getStatusBadge(ad.status).color
              }`}
            >
              {getStatusBadge(ad.status).text}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <MapPin size={12} className="mr-1" />
            {ad.location} 
          </div>
          <span>{formatRelativeTime(ad.posted_date)}</span>
        </div>

        {/* Edit and Delete buttons - only show for current user's ads */}
        {canEdit && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
            <Link
              to={`/edit-ad/${ad.id}`}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifiedItem;
