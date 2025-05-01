import React from 'react';
import { useClassified } from '../context/ClassifiedContext';
import ClassifiedItem from './home/ClassifiedItem';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { accessElf } from '../auth/utils/accessElf';
import { ShoppingBag } from 'lucide-react';

const MyAdvertsPage: React.FC = () => {
  const { myAdverts: userAds} = useClassified();

  accessElf.track('My Advertisements Page');

  return (
    <div className="pt-24 pb-12">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Advertisements</h1>
          <Link
            to="/create-ad"
            className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition"
          >
            <Plus size={20} />
            Create New Ad
          </Link>
        </div>

        {userAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userAds.map(ad => (
              <ClassifiedItem key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
              <ShoppingBag size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No advertisements yet</h3>
            <p className="text-gray-600 mb-6">
              Start selling your baby items by creating your first advertisement.
            </p>
            <Link
              to="/create-ad"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition"
            >
              <Plus size={20} />
              Create Your First Ad
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAdvertsPage;