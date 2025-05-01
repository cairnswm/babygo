import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Tag } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-blue-50 transform -skew-y-6 -translate-y-20 z-0" />
      
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Hero content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
                Find & Sell
              </span>
              <br />
              Quality Baby Items
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-lg">
              Connect with local parents to buy and sell second-hand baby goods. Save money and reduce waste with Baby-Go.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
              <Link 
                to="/app"
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-3 rounded-full font-medium text-center hover:shadow-lg transform transition duration-300 hover:scale-105"
              >
                View Adverts
              </Link>
              <Link 
                to="/create-ad"
                className="bg-white text-gray-800 border border-gray-300 px-8 py-3 rounded-full font-medium text-center hover:bg-gray-50 transition duration-300"
              >
                Create Advert
              </Link>
            </div>
            
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-medium">Safe & Secure</h3>
                  <p className="text-gray-500 text-sm">Verified sellers & secure transactions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-medium">Quality Items</h3>
                  <p className="text-gray-500 text-sm">All items rated by condition</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Tag className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-medium">Great Prices</h3>
                  <p className="text-gray-500 text-sm">Up to 70% off retail prices</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="lg:w-1/2 relative">
            <div className="rounded-lg shadow-xl overflow-hidden border-4 border-white max-h-[90vh]">
              <img 
                src="https://images.pexels.com/photos/7479714/pexels-photo-7479714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Mother and baby browsing second-hand items" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-10 -right-4 bg-white rounded-lg shadow-lg p-4 max-w-[200px] transform rotate-3 animate-pulse">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <Tag className="text-pink-500" size={16} />
                </div>
                <p className="ml-2 font-medium text-gray-800">New Listings</p>
              </div>
              <p className="text-sm text-gray-600">100+ new items added this week!</p>
            </div>
            
            <div className="absolute -bottom-8 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-[180px] transform -rotate-2 animate-bounce-slow">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Star className="text-blue-500" size={16} />
                </div>
                <p className="ml-2 font-medium text-gray-800">Save Big</p>
              </div>
              <p className="text-sm text-gray-600">Strollers from R500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;