/**
 * Auction categories data and configuration
 */

// Main auction categories
export const AUCTION_CATEGORIES = [
  {
    id: 'livestock',
    name: 'المواشي والحيوانات',
    nameEn: 'Livestock & Animals',
    icon: '🐄',
    description: 'أبقار، أغنام، ماعز، خيول، وجميع أنواع المواشي',
    color: 'emerald',
    isActive: true,
    order: 1,
    subcategories: [
      {
        id: 'cattle',
        name: 'الأبقار',
        nameEn: 'Cattle',
        icon: '🐄',
        description: 'أبقار حلوب وأبقار لحم بجميع أنواعها'
      },
      {
        id: 'sheep',
        name: 'الأغنام',
        nameEn: 'Sheep',
        icon: '🐑',
        description: 'أغنام نعيمي وحري وسواكني وغيرها'
      },
      {
        id: 'goats',
        name: 'الماعز',
        nameEn: 'Goats',
        icon: '🐐',
        description: 'ماعز شامي وماعز أردني وماعز محلي'
      },
      {
        id: 'camels',
        name: 'الإبل',
        nameEn: 'Camels',
        icon: '🐪',
        description: 'إبل مجاهيم ووضح وصفر وغيرها'
      },
      {
        id: 'horses',
        name: 'الخيول',
        nameEn: 'Horses',
        icon: '🐎',
        description: 'خيول عربية أصيلة وخيول السباق'
      },
      {
        id: 'poultry',
        name: 'الدواجن',
        nameEn: 'Poultry',
        icon: '🐓',
        description: 'دجاج، ديك، أوز، بط وجميع أنواع الدواجن'
      }
    ]
  },
  {
    id: 'vehicles',
    name: 'المركبات',
    nameEn: 'Vehicles',
    icon: '🚗',
    description: 'سيارات، دراجات نارية، شاحنات ومقطورات',
    color: 'blue',
    isActive: true,
    order: 2,
    subcategories: [
      {
        id: 'cars',
        name: 'السيارات',
        nameEn: 'Cars',
        icon: '🚗',
        description: 'سيارات جديدة ومستعملة بجميع الأنواع'
      },
      {
        id: 'motorcycles',
        name: 'الدراجات النارية',
        nameEn: 'Motorcycles',
        icon: '🏍️',
        description: 'دراجات نارية رياضية وعادية'
      },
      {
        id: 'trucks',
        name: 'الشاحنات',
        nameEn: 'Trucks',
        icon: '🚛',
        description: 'شاحنات نقل وشاحنات ثقيلة'
      },
      {
        id: 'trailers',
        name: 'المقطورات',
        nameEn: 'Trailers',
        icon: '🚚',
        description: 'مقطورات نقل ومقطورات خاصة'
      },
      {
        id: 'buses',
        name: 'الحافلات',
        nameEn: 'Buses',
        icon: '🚌',
        description: 'حافلات نقل عام وحافلات مدرسية'
      }
    ]
  },
  {
    id: 'real_estate',
    name: 'العقارات',
    nameEn: 'Real Estate',
    icon: '🏠',
    description: 'أراضي، منازل، شقق، ومحلات تجارية',
    color: 'amber',
    isActive: true,
    order: 3,
    subcategories: [
      {
        id: 'residential',
        name: 'السكني',
        nameEn: 'Residential',
        icon: '🏠',
        description: 'منازل، شقق، فيلات سكنية'
      },
      {
        id: 'commercial',
        name: 'التجاري',
        nameEn: 'Commercial',
        icon: '🏢',
        description: 'محلات تجارية، مكاتب، مستودعات'
      },
      {
        id: 'lands',
        name: 'الأراضي',
        nameEn: 'Lands',
        icon: '🌍',
        description: 'أراضي زراعية وسكنية وتجارية'
      },
      {
        id: 'farms',
        name: 'المزارع',
        nameEn: 'Farms',
        icon: '🌾',
        description: 'مزارع زراعية ومزارع مواشي'
      }
    ]
  },
  {
    id: 'machinery',
    name: 'المعدات والآلات',
    nameEn: 'Machinery & Equipment',
    icon: '🚜',
    description: 'معدات زراعية، صناعية، وآلات البناء',
    color: 'orange',
    isActive: true,
    order: 4,
    subcategories: [
      {
        id: 'agricultural',
        name: 'المعدات الزراعية',
        nameEn: 'Agricultural Equipment',
        icon: '🚜',
        description: 'جرارات، حاصدات، معدات الري'
      },
      {
        id: 'construction',
        name: 'معدات البناء',
        nameEn: 'Construction Equipment',
        icon: '🏗️',
        description: 'حفارات، رافعات، خلاطات'
      },
      {
        id: 'industrial',
        name: 'المعدات الصناعية',
        nameEn: 'Industrial Equipment',
        icon: '⚙️',
        description: 'معدات التصنيع والإنتاج'
      },
      {
        id: 'generators',
        name: 'المولدات',
        nameEn: 'Generators',
        icon: '🔌',
        description: 'مولدات كهربائية بأحجام مختلفة'
      }
    ]
  },
  {
    id: 'antiques',
    name: 'التحف والأثريات',
    nameEn: 'Antiques & Artifacts',
    icon: '🏺',
    description: 'تحف، أثريات، مخطوطات، وقطع تراثية',
    color: 'purple',
    isActive: true,
    order: 5,
    subcategories: [
      {
        id: 'manuscripts',
        name: 'المخطوطات',
        nameEn: 'Manuscripts',
        icon: '📜',
        description: 'مخطوطات عربية وإسلامية قديمة'
      },
      {
        id: 'pottery',
        name: 'الفخاريات',
        nameEn: 'Pottery',
        icon: '🏺',
        description: 'أواني وأدوات فخارية أثرية'
      },
      {
        id: 'jewelry',
        name: 'المجوهرات التراثية',
        nameEn: 'Heritage Jewelry',
        icon: '💎',
        description: 'مجوهرات وحلي تراثية'
      },
      {
        id: 'weapons',
        name: 'الأسلحة التراثية',
        nameEn: 'Heritage Weapons',
        icon: '⚔️',
        description: 'سيوف وخناجر تراثية للعرض'
      }
    ]
  },
  {
    id: 'art',
    name: 'الفنون واللوحات',
    nameEn: 'Art & Paintings',
    icon: '🎨',
    description: 'لوحات فنية، منحوتات، وأعمال فنية',
    color: 'pink',
    isActive: true,
    order: 6,
    subcategories: [
      {
        id: 'paintings',
        name: 'اللوحات',
        nameEn: 'Paintings',
        icon: '🖼️',
        description: 'لوحات زيتية ومائية وأكريليك'
      },
      {
        id: 'sculptures',
        name: 'المنحوتات',
        nameEn: 'Sculptures',
        icon: '🗿',
        description: 'منحوتات خشبية وحجرية ومعدنية'
      },
      {
        id: 'calligraphy',
        name: 'الخط العربي',
        nameEn: 'Arabic Calligraphy',
        icon: '✍️',
        description: 'لوحات خط عربي ونسخ قرآنية'
      }
    ]
  },
  {
    id: 'collectibles',
    name: 'المقتنيات',
    nameEn: 'Collectibles',
    icon: '🏆',
    description: 'طوابع، عملات، ساعات، وأدوات نادرة',
    color: 'indigo',
    isActive: true,
    order: 7,
    subcategories: [
      {
        id: 'stamps',
        name: 'الطوابع',
        nameEn: 'Stamps',
        icon: '📮',
        description: 'طوابع بريدية نادرة وقديمة'
      },
      {
        id: 'coins',
        name: 'العملات',
        nameEn: 'Coins',
        icon: '🪙',
        description: 'عملات قديمة ونادرة'
      },
      {
        id: 'watches',
        name: 'الساعات',
        nameEn: 'Watches',
        icon: '⌚',
        description: 'ساعات فاخرة وعتيقة'
      },
      {
        id: 'books',
        name: 'الكتب النادرة',
        nameEn: 'Rare Books',
        icon: '📚',
        description: 'كتب نادرة وطبعات محدودة'
      }
    ]
  },
  {
    id: 'electronics',
    name: 'الإلكترونيات',
    nameEn: 'Electronics',
    icon: '📱',
    description: 'أجهزة كمبيوتر، هواتف، وأجهزة إلكترونية',
    color: 'cyan',
    isActive: true,
    order: 8,
    subcategories: [
      {
        id: 'computers',
        name: 'أجهزة الكمبيوتر',
        nameEn: 'Computers',
        icon: '💻',
        description: 'أجهزة كمبيوتر مكتبية ومحمولة'
      },
      {
        id: 'phones',
        name: 'الهواتف الذكية',
        nameEn: 'Smartphones',
        icon: '📱',
        description: 'هواتف ذكية وأجهزة لوحية'
      },
      {
        id: 'gaming',
        name: 'أجهزة الألعاب',
        nameEn: 'Gaming Consoles',
        icon: '🎮',
        description: 'أجهزة ألعاب وإكسسوارات'
      }
    ]
  },
  {
    id: 'other',
    name: 'أخرى',
    nameEn: 'Other',
    icon: '📦',
    description: 'فئات أخرى متنوعة',
    color: 'gray',
    isActive: true,
    order: 999,
    subcategories: [
      {
        id: 'miscellaneous',
        name: 'متنوعات',
        nameEn: 'Miscellaneous',
        icon: '📦',
        description: 'أصناف متنوعة أخرى'
      }
    ]
  }
];

// Popular categories (shown on homepage)
export const POPULAR_CATEGORIES = [
  'livestock',
  'vehicles',
  'real_estate',
  'machinery',
  'antiques',
  'art'
];

// Category colors for UI
export const CATEGORY_COLORS = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-100',
    accent: 'bg-emerald-500'
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100',
    accent: 'bg-blue-500'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-100',
    accent: 'bg-amber-500'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-100',
    accent: 'bg-orange-500'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100',
    accent: 'bg-purple-500'
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200',
    hover: 'hover:bg-pink-100',
    accent: 'bg-pink-500'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-100',
    accent: 'bg-indigo-500'
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-100',
    accent: 'bg-cyan-500'
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
    accent: 'bg-gray-500'
  }
};

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object
 */
export const getCategoryById = (categoryId) => {
  return AUCTION_CATEGORIES.find(cat => cat.id === categoryId) || null;
};

/**
 * Get subcategory by ID
 * @param {string} categoryId - Category ID
 * @param {string} subcategoryId - Subcategory ID
 * @returns {Object|null} Subcategory object
 */
export const getSubcategoryById = (categoryId, subcategoryId) => {
  const category = getCategoryById(categoryId);
  if (!category || !category.subcategories) return null;
  
  return category.subcategories.find(sub => sub.id === subcategoryId) || null;
};

/**
 * Get category name in Arabic
 * @param {string} categoryId - Category ID
 * @returns {string} Arabic category name
 */
export const getCategoryName = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.name : 'غير محدد';
};

/**
 * Get subcategory name in Arabic
 * @param {string} categoryId - Category ID
 * @param {string} subcategoryId - Subcategory ID
 * @returns {string} Arabic subcategory name
 */
export const getSubcategoryName = (categoryId, subcategoryId) => {
  const subcategory = getSubcategoryById(categoryId, subcategoryId);
  return subcategory ? subcategory.name : 'غير محدد';
};

/**
 * Get category icon
 * @param {string} categoryId - Category ID
 * @returns {string} Category icon emoji
 */
export const getCategoryIcon = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.icon : '📦';
};

/**
 * Get category color theme
 * @param {string} categoryId - Category ID
 * @returns {Object} Color theme object
 */
export const getCategoryColors = (categoryId) => {
  const category = getCategoryById(categoryId);
  const colorName = category ? category.color : 'gray';
  return CATEGORY_COLORS[colorName] || CATEGORY_COLORS.gray;
};

/**
 * Get active categories only
 * @returns {Array} Active categories
 */
export const getActiveCategories = () => {
  return AUCTION_CATEGORIES.filter(cat => cat.isActive);
};

/**
 * Get categories sorted by order
 * @returns {Array} Sorted categories
 */
export const getSortedCategories = () => {
  return AUCTION_CATEGORIES.sort((a, b) => a.order - b.order);
};

/**
 * Get popular categories
 * @returns {Array} Popular category objects
 */
export const getPopularCategories = () => {
  return POPULAR_CATEGORIES.map(id => getCategoryById(id)).filter(Boolean);
};

/**
 * Search categories by name
 * @param {string} query - Search query
 * @returns {Array} Matching categories
 */
export const searchCategories = (query) => {
  if (!query || !query.trim()) return [];
  
  const searchTerm = query.trim().toLowerCase();
  const results = [];
  
  AUCTION_CATEGORIES.forEach(category => {
    // Search in category name
    if (category.name.toLowerCase().includes(searchTerm) ||
        category.nameEn.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm)) {
      results.push({ ...category, type: 'category' });
    }
    
    // Search in subcategories
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        if (subcategory.name.toLowerCase().includes(searchTerm) ||
            subcategory.nameEn.toLowerCase().includes(searchTerm) ||
            subcategory.description.toLowerCase().includes(searchTerm)) {
          results.push({ 
            ...subcategory, 
            type: 'subcategory', 
            parentCategory: category 
          });
        }
      });
    }
  });
  
  return results;
};

/**
 * Get category breadcrumb
 * @param {string} categoryId - Category ID
 * @param {string} subcategoryId - Subcategory ID (optional)
 * @returns {Array} Breadcrumb items
 */
export const getCategoryBreadcrumb = (categoryId, subcategoryId = null) => {
  const breadcrumb = [{ name: 'المزادات', url: '/' }];
  
  const category = getCategoryById(categoryId);
  if (category) {
    breadcrumb.push({ 
      name: category.name, 
      url: `/auctions?category=${categoryId}` 
    });
    
    if (subcategoryId) {
      const subcategory = getSubcategoryById(categoryId, subcategoryId);
      if (subcategory) {
        breadcrumb.push({ 
          name: subcategory.name, 
          url: `/auctions?category=${categoryId}&subcategory=${subcategoryId}` 
        });
      }
    }
  }
  
  return breadcrumb;
};

/**
 * Get category statistics (would be fetched from API in real app)
 * @param {string} categoryId - Category ID
 * @returns {Object} Category statistics
 */
export const getCategoryStats = (categoryId) => {
  // Mock data - would come from API
  const mockStats = {
    livestock: { activeAuctions: 45, totalBids: 1250, avgPrice: 25000 },
    vehicles: { activeAuctions: 32, totalBids: 890, avgPrice: 85000 },
    real_estate: { activeAuctions: 18, totalBids: 560, avgPrice: 450000 },
    machinery: { activeAuctions: 25, totalBids: 420, avgPrice: 125000 },
    antiques: { activeAuctions: 12, totalBids: 380, avgPrice: 15000 },
    art: { activeAuctions: 8, totalBids: 290, avgPrice: 8500 },
    collectibles: { activeAuctions: 15, totalBids: 340, avgPrice: 3500 },
    electronics: { activeAuctions: 28, totalBids: 680, avgPrice: 4200 }
  };
  
  return mockStats[categoryId] || { activeAuctions: 0, totalBids: 0, avgPrice: 0 };
};

export default AUCTION_CATEGORIES;