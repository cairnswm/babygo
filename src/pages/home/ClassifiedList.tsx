import React, { useState } from 'react';
import { useClassified } from '../../context/ClassifiedContext';
import ClassifiedItem from './ClassifiedItem';
import { Search, SlidersHorizontal, Plus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClassifiedList: React.FC = () => {
  const { 
    filteredAds, 
    categories, 
    searchTerm, 
    setSearchTerm
  } = useClassified();
  
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<{min: number, max: number | null}>({min: 0, max: null});
  const [conditionFilter, setConditionFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [favoritesFilter, setFavoritesFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Conditions for filtering
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  
  // Toggle condition filter
  const toggleCondition = (condition: string) => {
    if (conditionFilter.includes(condition)) {
      setConditionFilter(conditionFilter.filter(c => c !== condition));
    } else {
      setConditionFilter([...conditionFilter, condition]);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Apply all filters
  const filteredAndSortedAds = filteredAds
    // Apply price range filter
    .filter(ad => {
      if (priceRange.min > 0 && ad.price < priceRange.min) return false;
      if (priceRange.max && ad.price > priceRange.max) return false;
      return true;
    })
    // Apply condition filter
    .filter(ad => {
      if (conditionFilter.length === 0) return true;
      return conditionFilter.includes(ad.condition);
    })
    // Apply favorites filter
    .filter(ad => {
      if (!favoritesFilter) return true;
      return ad.favorite === true;
    })
    // Apply category filter
    .filter(ad => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(ad.category);
    })
    // Apply sorting
    .sort((a, b) => {
      // Priority ads always come first
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      
      // Then apply selected sort
      switch (sortBy) {
        case 'newest':
          return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
        case 'oldest':
          return new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime();
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const FilterPanel: React.FC = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                <input 
                  type="number" 
                  placeholder="Min"
                  min="0"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                  className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  min="0"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value) || null})}
                  className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Condition</h3>
            <div className="flex flex-wrap gap-2">
              {conditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => toggleCondition(condition)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    conditionFilter.includes(condition)
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.name)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category.name)
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Favorites</h3>
            <button
              onClick={() => setFavoritesFilter(!favoritesFilter)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                favoritesFilter
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition`}
            >
              <Heart size={16} /> Favorites
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              setPriceRange({min: 0, max: null});
              setConditionFilter([]);
              setSelectedCategories([]);
              setFavoritesFilter(false);
            }}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
          >
            Reset
          </button>
          <button
            onClick={() => setFilterMenuOpen(false)}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-16 pb-12 px-4">
      {/* Search and filter header */}
      <div className="my-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Sort and filter buttons */}
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
            
            <button 
              className="px-4 py-3 rounded-lg border border-gray-300 bg-white flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden md:inline">Filters</span>
            </button>

            <Link
              to="/create-ad"
              className="px-4 py-3 rounded-lg bg-pink-500 text-white flex items-center gap-2 hover:bg-pink-600 transition"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add Advert</span>
            </Link>
          </div>
        </div>

        {/* Filter panel */}
        {filterMenuOpen && <FilterPanel />}
        
        {/* Results count */}
        <div className="text-gray-600">
          Showing {filteredAndSortedAds.length} items
          {searchTerm ? ` matching "${searchTerm}"` : ''}
        </div>
      </div>

      {/* Classified ads grid */}
      {filteredAndSortedAds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedAds.map(ad => (
            <ClassifiedItem key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
            <Search size={24} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any baby items matching your criteria.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setPriceRange({min: 0, max: null});
              setConditionFilter([]);
              setSelectedCategories([]);
            }}
            className="text-pink-500 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassifiedList;