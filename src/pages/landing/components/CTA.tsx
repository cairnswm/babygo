import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto px-4">
        <div className="bg-gradient-to-br from-pink-500 to-blue-500 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Happy baby with toys" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            {/* Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Buying & Selling?
              </h2>
              <p className="text-white text-opacity-90 mb-8 text-lg">
                Join our community of parents today and discover great deals on quality baby items. Your baby's next favorite toy could be just a click away.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/app" 
                  className="bg-white text-pink-500 px-6 py-3 rounded-full font-medium inline-flex items-center justify-center hover:bg-gray-100 transition duration-300"
                >
                  Open App
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link 
                  to="/pricing" 
                  className="bg-transparent text-white border border-white px-6 py-3 rounded-full font-medium inline-flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition duration-300"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;