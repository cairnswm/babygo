import React from 'react';
import { Tag, CreditCard, Search, Shield, Star, Users, ShoppingBag, AlertCircle } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-pink-500 font-medium">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">The Easiest Way to Buy & Sell Baby Items</h2>
          <p className="text-gray-600">
            Baby-Go connects parents looking to buy quality second-hand baby items with those wanting to sell items their children have outgrown.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition duration-300 transform hover:-translate-y-1">
            <div className="bg-pink-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="text-pink-500" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
            <p className="text-gray-600">
              Create listings for your baby's outgrown items in minutes with our easy-to-use app.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition duration-300 transform hover:-translate-y-1">
            <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              <Search className="text-blue-500" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse & Find</h3>
            <p className="text-gray-600">
              Search for specific items or browse by category to discover great deals near you.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition duration-300 transform hover:-translate-y-1">
            <div className="bg-green-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              <Users className="text-green-500" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">
              Message sellers directly through our secure messaging system to arrange pickup.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition duration-300 transform hover:-translate-y-1">
            <div className="bg-yellow-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
              <Star className="text-yellow-500" size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
            <p className="text-gray-600">
              Leave feedback after transactions to help build our trusted community of parents.
            </p>
          </div>
        </div>

        {/* Trusted platform section */}
        <div className="mt-20 bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-pink-500 font-medium">Why Choose Baby-Go</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">A Trusted Platform for Parents</h2>
              <p className="text-gray-600 mb-6">
                We've created Baby-Go with parents' needs in mind. Our platform offers a safe, convenient way to buy and sell baby items at great prices.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <Shield className="text-pink-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure Platform</h3>
                    <p className="text-gray-600 text-sm">
                      Verified user profiles and secure messaging to ensure safe transactions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <AlertCircle className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Quality Assurance</h3>
                    <p className="text-gray-600 text-sm">
                      All items are clearly rated by condition so you know exactly what you're getting.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <Tag className="text-green-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Affordable Prices</h3>
                    <p className="text-gray-600 text-sm">
                      Find quality baby items at fraction of retail prices, saving you money.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7479733/pexels-photo-7479733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Baby clothes and toys" 
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 max-w-[180px]">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <CreditCard className="text-pink-500" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Save up to</p>
                    <p className="text-xl font-bold text-pink-500">70%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;