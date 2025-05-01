import { User, UserRating } from '../types';
import { CURRENT_USER_ID } from './mockData';

// Generate mock users
const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];
  
  // Add current user
  users.push({
    id: CURRENT_USER_ID,
    name: 'Current User',
    email: 'current.user@example.com',
    phone: '+27123456789',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    joinedDate: new Date(2024, 0, 1).toISOString(),
    rating: 4.5,
    totalRatings: 12
  });

  // Generate random users
  for (let i = 1; i <= count; i++) {
    const id = `user-${i}`;
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const number = Math.floor(Math.random() * 100) + 1;
    
    users.push({
      id,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      phone: `+27${Math.floor(Math.random() * 900000000 + 100000000)}`,
      avatar: `https://randomuser.me/api/portraits/${gender}/${number}.jpg`,
      joinedDate: new Date(2024, 0, Math.floor(Math.random() * 90)).toISOString(),
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3.0 and 5.0
      totalRatings: Math.floor(Math.random() * 50) + 1
    });
  }

  return users;
};

// Generate mock ratings
const generateMockRatings = (users: User[]): UserRating[] => {
  const ratings: UserRating[] = [];
  
  const comments = [
    'Great seller! Very responsive and item was as described.',
    'Quick response and smooth transaction.',
    'Item was in perfect condition.',
    'Good communication but delivery was a bit slow.',
    'Excellent service and fast shipping.',
    'Very professional and friendly.',
    'Item was not exactly as described but still good.',
    'Would definitely buy from this seller again!',
    'Fair price and good condition.',
    'Responsive seller and great deal.'
  ];

  users.forEach(user => {
    // Generate 1-5 ratings for each user
    const ratingCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < ratingCount; i++) {
      // Get a random rater (excluding the user being rated)
      let rater;
      do {
        rater = users[Math.floor(Math.random() * users.length)];
      } while (rater.id === user.id);

      const rating: UserRating = {
        id: `rating-${user.id}-${i}`,
        userId: user.id,
        ratedBy: rater.id,
        rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
        comment: comments[Math.floor(Math.random() * comments.length)],
        createdAt: new Date(2024, 0, Math.floor(Math.random() * 90)).toISOString()
      };

      ratings.push(rating);
    }
  });

  return ratings;
};

export const mockUsers = generateMockUsers(20);
export const mockRatings = generateMockRatings(mockUsers);