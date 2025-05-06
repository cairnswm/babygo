import { ClassifiedAd, Category, Message } from '../types';

// Update the CURRENT_USER_ID to be user-1
export const CURRENT_USER_ID = 'user-1';

export const categories: Category[] = [
  { id: '1', name: 'Clothing', icon: 'shirt' },
  { id: '2', name: 'Toys', icon: 'toy-brick' },
  { id: '3', name: 'Furniture', icon: 'bed' },
  { id: '4', name: 'Strollers', icon: 'baby' },
  { id: '5', name: 'Accessories', icon: 'bookmark' },
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'] as const;
const locations = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'];

// Generate a list of random user IDs
const userIds = Array.from({ length: 20 }, (_, i) => `user-${i + 1}`);

// Generate mock messages
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    fromUserId: 'user-2',
    toUserId: CURRENT_USER_ID,
    adId: 'ad-1',
    content: "Hi! Is the baby stroller still available?",
    createdAt: new Date(2024, 1, 15, 10, 30).toISOString(),
    read: true
  },
  {
    id: 'msg-2',
    fromUserId: CURRENT_USER_ID,
    toUserId: 'user-2',
    adId: 'ad-1',
    content: "Yes, it's still available! When would you like to see it?",
    createdAt: new Date(2024, 1, 15, 10, 35).toISOString(),
    read: true
  },
  {
    id: 'msg-3',
    fromUserId: 'user-2',
    toUserId: CURRENT_USER_ID,
    adId: 'ad-1',
    content: "Great! Could we meet tomorrow afternoon?",
    createdAt: new Date(2024, 1, 15, 10, 40).toISOString(),
    read: false
  },
  {
    id: 'msg-4',
    fromUserId: 'user-3',
    toUserId: CURRENT_USER_ID,
    adId: 'ad-2',
    content: "Hello! I'm interested in the baby clothes you posted. Are they still available?",
    createdAt: new Date(2024, 1, 16, 9, 15).toISOString(),
    read: false
  },
  {
    id: 'msg-5',
    fromUserId: 'user-4',
    toUserId: CURRENT_USER_ID,
    adId: 'ad-3',
    content: "Hi there! Would you consider a lower price for the crib?",
    createdAt: new Date(2024, 1, 16, 14, 20).toISOString(),
    read: false
  },
  {
    id: 'msg-6',
    fromUserId: CURRENT_USER_ID,
    toUserId: 'user-4',
    adId: 'ad-3',
    content: "Hi! What price did you have in mind?",
    createdAt: new Date(2024, 1, 16, 15, 45).toISOString(),
    read: true
  }
];

function generateClassifiedAds(count: number): ClassifiedAd[] {
  const ads: ClassifiedAd[] = [];
  
  const clothingItems = [
    'Baby Onesie', 'Winter Jacket', 'Summer Dress', 'Baby Shoes', 
    'Infant Socks', 'Newborn Clothes Set', 'Toddler Pants', 'Baby Hat',
    'Baby Swimsuit', 'Sleeping Bag', 'Mittens', 'Baby Boots'
  ];
  
  const toysItems = [
    'Building Blocks', 'Plush Teddy Bear', 'Baby Rattle', 'Activity Gym',
    'Baby Books', 'Musical Toy', 'Shape Sorter', 'Stacking Rings',
    'Toy Cars', 'Sensory Toys', 'Wooden Puzzle', 'Bath Toys'
  ];
  
  const furnitureItems = [
    'Crib', 'Changing Table', 'Baby Dresser', 'Rocking Chair',
    'High Chair', 'Toddler Bed', 'Bassinet', 'Play Pen',
    'Baby Swing', 'Nursing Chair', 'Baby Gate', 'Bookshelf'
  ];
  
  const strollerItems = [
    'Jogging Stroller', 'Double Stroller', 'Travel System', 'Umbrella Stroller',
    'Lightweight Stroller', 'Pram', 'Car Seat Combo', 'All-Terrain Stroller',
    'Convertible Stroller', 'Compact Folding Stroller', 'Bassinet Stroller', 'Sit and Stand Stroller'
  ];
  
  const accessoryItems = [
    'Diaper Bag', 'Baby Monitor', 'Bottle Warmer', 'Nursing Pillow',
    'Baby Carrier', 'Swaddle Blankets', 'Bibs', 'Pacifiers',
    'Breast Pump', 'Bottle Set', 'Sterilizer', 'Changing Mat'
  ];
  
  const categoryProducts = {
    '1': clothingItems,
    '2': toysItems,
    '3': furnitureItems,
    '4': strollerItems,
    '5': accessoryItems,
  };
  
  // Generate random ads
  for (let i = 0; i < count; i++) {
    const categoryId = String(Math.floor(Math.random() * 5) + 1);
    const category = categories.find(c => c.id === categoryId)!;
    const products = categoryProducts[categoryId as keyof typeof categoryProducts];
    const productName = products[Math.floor(Math.random() * products.length)];
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    let basePrice = 0;
    
    // Set base price ranges by category
    switch (categoryId) {
      case '1': // Clothing
        basePrice = Math.floor(Math.random() * 300) + 50;
        break;
      case '2': // Toys
        basePrice = Math.floor(Math.random() * 400) + 100;
        break;
      case '3': // Furniture
        basePrice = Math.floor(Math.random() * 2000) + 500;
        break;
      case '4': // Strollers
        basePrice = Math.floor(Math.random() * 3000) + 1000;
        break;
      case '5': // Accessories
        basePrice = Math.floor(Math.random() * 500) + 100;
        break;
    }
    
    // Adjust price based on condition
    let priceAdjustment = 1.0;
    switch (condition) {
      case 'New': priceAdjustment = 1.0; break;
      case 'Like New': priceAdjustment = 0.8; break;
      case 'Good': priceAdjustment = 0.6; break;
      case 'Fair': priceAdjustment = 0.4; break;
      case 'Poor': priceAdjustment = 0.25; break;
    }
    
    const finalPrice = Math.round(basePrice * priceAdjustment);
    
    // Generate random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Make some ads priority (approximately 10%)
    const priority = Math.random() < 0.1;
    
    // Random location
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Random seller name
    const firstNames = ['Sarah', 'John', 'Emma', 'Michael', 'Sophia', 'David', 'Olivia', 'James', 'Ava', 'Daniel'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Clark'];
    const sellerName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    // Generate email and phone
    const email = `${sellerName.toLowerCase().replace(' ', '.')}@example.com`;
    const phone = `+27${Math.floor(Math.random() * 900000000 + 100000000)}`;
    
    // Assign a random user ID from the pool (make some ads belong to the current user)
    const userId = Math.random() < 0.1 ? CURRENT_USER_ID : userIds[Math.floor(Math.random() * userIds.length)];
    
    // Generate product image URL from Pexels based on category
    let imageKeyword = '';
    switch (categoryId) {
      case '1': imageKeyword = 'baby+clothes'; break;
      case '2': imageKeyword = 'baby+toys'; break;
      case '3': imageKeyword = 'baby+furniture'; break;
      case '4': imageKeyword = 'baby+stroller'; break;
      case '5': imageKeyword = 'baby+accessories'; break;
    }
    
    // Create random number of images (1-3)
    const imageCount = Math.floor(Math.random() * 3) + 1;
    const images = Array(imageCount).fill(0).map((_, i) => 
      `https://source.unsplash.com/random/300x300?${imageKeyword}&sig=${i+Math.random()*1000}`
    );
    
    // Generate item description
    const ageRanges = ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-3 years', '3+years'];
    const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];
    const brands = ['Carter\'s', 'Pampers', 'Fisher-Price', 'Graco', 'Baby Bjorn', 'Chicco', 'Huggies', 'Gerber', 'Johnson & Johnson'];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const descriptions = [
      `${condition} ${productName} for ${ageRange}. ${brand} brand, barely used.`,
      `${brand} ${productName} in ${condition.toLowerCase()} condition. Perfect for babies ${ageRange}.`,
      `Selling my baby's ${productName}. ${condition} condition, from ${brand}.`,
      `${condition} ${brand} ${productName}. Great for ${ageRange}, no damages.`,
      `Beautiful ${productName} from ${brand}. In ${condition.toLowerCase()} condition, suitable for ${ageRange}.`
    ];
    
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    ads.push({
      id: `ad-${i+1}`,
      title: `${condition} ${productName} - ${ageRange}`,
      description,
      price: finalPrice,
      condition: condition as any,
      category: category.name,
      images,
      location,
      posted_date: date.toISOString(),
      priority,
      userId,
      favorite: categoryId === '4',
      status: 'available' // All demo data is available by default
    });
  }
  
  // Sort: priority ads first, then by date (newest first)
  return ads.sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
  });
}

export const classifiedAds = generateClassifiedAds(100);