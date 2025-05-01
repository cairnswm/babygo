import React from 'react';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Mother of two',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'Baby-Go has been a lifesaver for our growing family. I\'ve found amazing deals on hardly used baby clothes and toys. The app is so easy to use and the sellers have all been lovely!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Thomas',
      role: 'New dad',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'As first-time parents, the cost of baby gear was overwhelming. Baby-Go helped us find quality second-hand items at incredible prices. We saved over R5000 on our nursery setup!',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Peterson',
      role: 'Seller',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: 'I upgraded to the Premium plan and it was worth every cent. I\'ve sold all my baby\'s outgrown clothes and toys quickly, and the priority listing feature really works!',
      rating: 4
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-pink-500 font-medium">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What Parents Are Saying</h2>
          <p className="text-gray-600">
            Join thousands of happy parents who are buying and selling on Baby-Go every day.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 bg-gradient-to-r from-pink-500 to-blue-500 rounded-2xl p-10 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">10,000+</p>
              <p className="text-white text-opacity-80">Happy Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50,000+</p>
              <p className="text-white text-opacity-80">Items Sold</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">R5M+</p>
              <p className="text-white text-opacity-80">Money Saved</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">4.8/5</p>
              <p className="text-white text-opacity-80">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;