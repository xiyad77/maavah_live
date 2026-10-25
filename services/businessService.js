/**
 * Maavah Live - Local Business Directory Service
 * Categorized repository of local island businesses, cafes, shops, and services.
 * Location: Maavah, Laamu Atoll, Maldives
 */

const businesses = [
  // Shops
  {
    id: 'tenstar-traders',
    name: 'Tenstar Traders',
    category: 'Shops',
    categorySlug: 'shops',
    mobile: '7686335',
    callNumber: '+9607686335',
    tagline: 'General Merchant, Provisions & Island Retail',
    location: 'Maavah, Laamu Atoll',
    badge: 'Shop'
  },
  {
    id: 'js-elacha',
    name: 'JS Elacha',
    category: 'Shops',
    categorySlug: 'shops',
    mobile: '9857762',
    callNumber: '+9609857762',
    tagline: 'Retail Goods, Groceries & Everyday Essentials',
    location: 'Maavah, Laamu Atoll',
    badge: 'Shop'
  },
  {
    id: 'elacha-duo',
    name: 'Elacha Duo',
    category: 'Shops',
    categorySlug: 'shops',
    mobile: '9857762',
    callNumber: '+9609857762',
    tagline: 'Local Variety Store & Consumer Goods',
    location: 'Maavah, Laamu Atoll',
    badge: 'Shop'
  },

  // Cafe/restaurants
  {
    id: 'relaxzone',
    name: 'RelaxZone',
    category: 'Cafe/restaurants',
    categorySlug: 'cafe-restaurants',
    mobile: '9804449',
    callNumber: '+9609804449',
    tagline: 'Island Cafe & Dining, Short Eats & Refreshments',
    location: 'Maavah, Laamu Atoll',
    badge: 'Cafe'
  },
  {
    id: 'harbourclub',
    name: 'Harbourclub',
    category: 'Cafe/restaurants',
    categorySlug: 'cafe-restaurants',
    mobile: '744889',
    callNumber: '+960744889',
    tagline: 'Harbour View Cafe, Coffee & Local Food',
    location: 'Harbour Area, Maavah',
    badge: 'Cafe'
  },
  {
    id: 'skylight',
    name: 'Skylight',
    category: 'Cafe/restaurants',
    categorySlug: 'cafe-restaurants',
    mobile: '9986952',
    callNumber: '+9609986952',
    tagline: 'Restaurant & Eatery, Dine-In & Takeaway',
    location: 'Maavah, Laamu Atoll',
    badge: 'Restaurant'
  }
];

const categories = [
  { slug: 'all', name: 'All Categories' },
  { slug: 'shops', name: 'Shops' },
  { slug: 'cafe-restaurants', name: 'Cafe/restaurants' },
  { slug: 'others', name: 'Others' }
];

/**
 * Filter businesses by category and/or query string
 */
function getBusinesses(category = 'all', searchQuery = '') {
  let list = [...businesses];

  if (category && category !== 'all') {
    list = list.filter(b => b.categorySlug.toLowerCase() === category.toLowerCase());
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.mobile.includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.tagline && b.tagline.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Get category list with active counts
 */
function getCategories() {
  return categories.map(cat => {
    let count = 0;
    if (cat.slug === 'all') {
      count = businesses.length;
    } else {
      count = businesses.filter(b => b.categorySlug === cat.slug).length;
    }
    return {
      ...cat,
      count
    };
  });
}

function getAllBusinesses() {
  return businesses;
}

module.exports = {
  businesses,
  categories,
  getBusinesses,
  getCategories,
  getAllBusinesses
};
