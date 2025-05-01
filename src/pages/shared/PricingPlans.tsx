import React from 'react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPlans: React.FC = () => {
  return (
      <div className="mx-auto px-2 sm:px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-pink-500 font-medium">Pricing</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600">
            Choose the plan that works best for you, whether you're selling just a few items or running a baby goods business.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Free plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg p-4 sm:p-8 flex flex-col h-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Free</h3>
            <div className="flex items-baseline mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold">R0</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6">
              Perfect for occasional sellers with just a few items to list.
            </p>

            <Link 
              to="/create-ad"
              className="block w-full py-2 sm:py-3 px-2 sm:px-4 bg-gray-100 text-gray-800 text-center rounded-lg font-medium hover:bg-gray-200 transition duration-300 mb-4"
            >
              Get Started
            </Link>
            <div className="border-t border-gray-100 pt-4 sm:pt-6">
              <h4 className="font-medium mb-2 sm:mb-4">Features include:</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Up to 3 active listings</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Basic search visibility</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">In-app messaging</span>
                </li>
                <li className="flex items-start">
                  <X size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Priority listings</span>
                </li>
                <li className="flex items-start">
                  <X size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Advanced analytics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Premium plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-pink-500 relative p-4 sm:p-8 flex flex-col h-full">
            <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium rounded-bl-lg">Popular</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Premium</h3>
            <div className="flex items-baseline mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold">R99</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6">
              For active sellers with multiple items to list every month.
            </p>

            <Link 
              to="/create-ad"
              className="block w-full py-2 sm:py-3 px-2 sm:px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-center rounded-lg font-medium hover:shadow-lg transition duration-300 mb-4"
            >
              Get Started
            </Link>
            <div className="border-t border-gray-100 pt-4 sm:pt-6">
              <h4 className="font-medium mb-2 sm:mb-4">Everything in Free, plus:</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600"><strong>Unlimited</strong> active listings</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Enhanced search visibility</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Verified seller badge</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Basic sales analytics</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Email notifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Shops plan */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg p-4 sm:p-8 flex flex-col h-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Shops</h3>
            <div className="flex items-baseline mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold">R299</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6">
              Perfect for baby shops and professional sellers.
            </p>

            <Link 
              to="/create-ad"
              className="block w-full py-2 sm:py-3 px-2 sm:px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center rounded-lg font-medium hover:shadow-lg transition duration-300 mb-4"
            >
              Get Started
            </Link>
            <div className="border-t border-gray-100 pt-4 sm:pt-6">
              <h4 className="font-medium mb-2 sm:mb-4">Everything in Premium, plus:</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600"><strong>3 Priority</strong> ads included</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Shop profile page</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Advanced analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Priority customer support</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Bulk listing tools</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Priority ad add-on */}
          <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg p-4 sm:p-8 flex flex-col h-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">Priority Ad</h3>
            <div className="flex items-baseline mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold">R100</span>
              <span className="text-gray-500 ml-2">/ad</span>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6">
              Boost any individual listing for maximum exposure and quick sales.
            </p>

            <Link 
              to="/create-ad"
              className="block w-full py-2 sm:py-3 px-2 sm:px-4 bg-blue-500 text-white text-center rounded-lg font-medium hover:bg-blue-600 transition duration-300 mb-4"
            >
              Boost Your Listing
            </Link>
            <div className="border-t border-gray-100 pt-4 sm:pt-6">
              <h4 className="font-medium mb-2 sm:mb-4">Priority features:</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600"><strong>Top placement</strong> in search results</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Highlighted listing with special badge</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Featured in category pages</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">7 days of priority placement</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Performance reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-10 sm:mt-20 max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Frequently Asked Questions</h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Can I upgrade my plan anytime?</h4>
              <p className="text-gray-600">
                Yes, you can upgrade your account any time. Your existing listings will remain active, and you'll immediately gain access to all features of your new plan.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">How does Priority Ad placement work?</h4>
              <p className="text-gray-600">
                Priority Ads are always shown at the top of search results and category pages for 7 days. This significantly increases visibility and chances of selling your item quickly.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h4 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">What's included in the Shops plan?</h4>
              <p className="text-gray-600">
                The Shops plan includes everything in Premium plus 3 priority ad slots, a dedicated shop profile page, advanced analytics, priority support, and bulk listing tools.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PricingPlans;