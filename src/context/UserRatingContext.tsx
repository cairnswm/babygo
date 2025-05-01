import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRating } from '../types';
import { mockUsers, mockRatings } from '../data/mockUsers';

interface UserRatingContextType {
  users: User[];
  ratings: UserRating[];
  getUser: (id: string) => User | undefined;
  getUserRatings: (userId: string) => UserRating[];
  addRating: (rating: Omit<UserRating, 'id' | 'createdAt'>) => void;
}

const UserRatingContext = createContext<UserRatingContextType | undefined>(undefined);

export const UserRatingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [ratings, setRatings] = useState<UserRating[]>(mockRatings);

  const getUser = (id: string) => users.find(user => user.id === id);

  const getUserRatings = (userId: string) => 
    ratings.filter(rating => rating.userId === userId);

  const addRating = (ratingData: Omit<UserRating, 'id' | 'createdAt'>) => {
    const newRating: UserRating = {
      ...ratingData,
      id: `rating-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setRatings(prev => [newRating, ...prev]);

    // Update user's average rating
    setUsers(prev => prev.map(user => {
      if (user.id === ratingData.userId) {
        const userRatings = [...getUserRatings(user.id), newRating];
        const avgRating = userRatings.reduce((acc, r) => acc + r.rating, 0) / userRatings.length;
        return {
          ...user,
          rating: Number(avgRating.toFixed(1)),
          totalRatings: userRatings.length
        };
      }
      return user;
    }));
  };

  const value = {
    users,
    ratings,
    getUser,
    getUserRatings,
    addRating
  };

  return (
    <UserRatingContext.Provider value={value}>
      {children}
    </UserRatingContext.Provider>
  );
};

export const useUserRating = (): UserRatingContextType => {
  const context = useContext(UserRatingContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};