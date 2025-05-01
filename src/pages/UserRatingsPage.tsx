import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserRating } from '../context/UserRatingContext';
import UserRatings from './shared/UserRatings';
import { ArrowLeft } from 'lucide-react';
import { accessElf } from '../auth/utils/accessElf';

const UserRatingsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getUser } = useUserRating();
  const user = userId ? getUser(userId) : null;

  accessElf.track('User Ratings Page', userId);

  if (!user) {
    return (
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800">User not found</h1>
          <Link
            to="/app"
            className="mt-4 inline-flex items-center text-pink-500 hover:text-pink-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/app"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Listings
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>

          <UserRatings userId={user.id} showDetails />
        </div>
      </div>
    </div>
  );
};

export default UserRatingsPage;