import React from 'react';
import { Star } from 'lucide-react';
import { useUserRating } from '../../context/UserRatingContext';
import { Link } from 'react-router-dom';

interface UserRatingsProps {
  userId: string;
  showDetails?: boolean;
}

const UserRatings: React.FC<UserRatingsProps> = ({ userId, showDetails = false }) => {
  const { getUser, getUserRatings } = useUserRating();
  const user = getUser(userId);
  const ratings = getUserRatings(userId);

  if (!user) return null;

  return (
    <div>
      {!showDetails ? (
        <Link to={`/user/${userId}/ratings`} className="flex items-center hover:text-pink-500 transition">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${i < Math.floor(user.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm">
            {user.rating} ({user.totalRatings})
          </span>
        </Link>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`${i < Math.floor(user.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-lg font-medium">
              {user.rating} out of 5
            </span>
            <span className="text-gray-500">
              ({user.totalRatings} ratings)
            </span>
          </div>

          <div className="space-y-4">
            {ratings.map((rating) => {
              const rater = getUser(rating.ratedBy);
              return (
                <div key={rating.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={rater?.avatar}
                        alt={rater?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium">{rater?.name}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{rating.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRatings;