import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClassified } from '../context/ClassifiedContext';
import { ClassifiedAd } from '..//types';
import ImageUpload from './shared/ImageUpload';
import { accessElf } from '../auth/utils/accessElf';

const EditAdPage: React.FC = () => {
  accessElf.track('Edit Advertisement Page');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, ads, updateAd } = useClassified();
  const [formData, setFormData] = useState<Omit<ClassifiedAd, 'id' | 'posted_date' | 'sellerName'>>({
    title: '',
    description: '',
    price: 0,
    condition: 'New',
    category: categories[0].name,
    location: '',
    images: [],
    isPriority: false,
    status: 'available'
  });

  useEffect(() => {
    const ad = ads.find(ad => ad.id === id);
    if (ad) {
      const { id: _, posted_date: __, sellerName: ___, ...adData } = ad;
      setFormData(adData);
    } else {
      navigate('/app');
    }
  }, [id, ads, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateAd(id, formData);
    navigate('/app');
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Advertisement</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (R)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClassifiedAd['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData({ ...formData, images })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="priority"
              checked={formData.isPriority}
              onChange={(e) => setFormData({ ...formData, isPriority: e.target.checked })}
              className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="priority" className="ml-2 block text-sm text-gray-700">
              Make this a priority ad (R100)
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Update Advertisement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdPage;