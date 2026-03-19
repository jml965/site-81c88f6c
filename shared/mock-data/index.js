// Mock data for Mazad Motion platform
import { AUCTION_VIDEOS } from '../assets/videos/index.js';
import { JEWELRY_IMAGES, ART_IMAGES, ANTIQUE_IMAGES, WATCH_IMAGES, CAR_IMAGES, AVATARS } from '../assets/images/index.js';

// Base configuration
export const PLATFORM_CONFIG = {
  name: 'مزاد موشن',
  nameEn: 'Mazad Motion',
  domain: 'mazadmotion.com',
  supportEmail: 'support@mazadmotion.com',
  phoneNumber: '+966123456789',
  address: 'الرياض، المملكة العربية السعودية',
  currency: 'SAR',
  timezone: 'Asia/Riyadh',
  language: 'ar',
  rtl: true
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  BIDDER: 'bidder',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
};

// Auction statuses
export const AUCTION_STATUSES = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  ACTIVE: 'active',
  PAUSED: 'paused',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended'
};

// Bid statuses
export const BID_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  OUTBID: 'outbid',
  WINNING: 'winning',
  WON: 'won',
  LOST: 'lost'
};

// Categories
export const CATEGORIES = [
  {
    id: '1',
    nameAr: 'المجوهرات والأحجار الكريمة',
    nameEn: 'Jewelry & Gemstones',
    slug: 'jewelry',
    description: 'مجوهرات فاخرة وأحجار كريمة وساعات ثمينة',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    icon: '💎',
    isActive: true,
    sortOrder: 1,
    auctionsCount: 25
  },
  {
    id: '2',
    nameAr: 'الفنون واللوحات',
    nameEn: 'Art & Paintings',
    slug: 'art',
    description: 'لوحات فنية وتحف ومنحوتات',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    icon: '🎨',
    isActive: true,
    sortOrder: 2,
    auctionsCount: 18
  },
  {
    id: '3',
    nameAr: 'التحف والآثار',
    nameEn: 'Antiques & Artifacts',
    slug: 'antiques',
    description: 'قطع أثرية وتحف تاريخية نادرة',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    icon: '🏺',
    isActive: true,
    sortOrder: 3,
    auctionsCount: 12
  },
  {
    id: '4',
    nameAr: 'السيارات الكلاسيكية',
    nameEn: 'Classic Cars',
    slug: 'cars',
    description: 'سيارات كلاسيكية ونادرة',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
    icon: '🚗',
    isActive: true,
    sortOrder: 4,
    auctionsCount: 8
  },
  {
    id: '5',
    nameAr: 'الساعات الفاخرة',
    nameEn: 'Luxury Watches',
    slug: 'watches',
    description: 'ساعات فاخرة ونادرة من أفضل الماركات',
    image: 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=400&h=300&fit=crop',
    icon: '⌚',
    isActive: true,
    sortOrder: 5,
    auctionsCount: 15
  },
  {
    id: '6',
    nameAr: 'العملات والطوابع',
    nameEn: 'Coins & Stamps',
    slug: 'coins',
    description: 'عملات نادرة وطوابع تاريخية',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=300&fit=crop',
    icon: '🪙',
    isActive: true,
    sortOrder: 6,
    auctionsCount: 6
  }
];

// Mock users
export const USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@mazadmotion.com',
    firstName: 'مدير',
    lastName: 'النظام',
    fullName: 'مدير النظام',
    role: USER_ROLES.ADMIN,
    avatar: AVATARS.admin,
    phoneNumber: '+966501234567',
    isVerified: true,
    isActive: true,
    joinedAt: '2023-01-01T00:00:00Z',
    lastLoginAt: '2023-12-01T10:30:00Z',
    bidCount: 0,
    wonAuctions: 0,
    rating: 5.0,
    location: 'الرياض، السعودية'
  },
  {
    id: '2',
    username: 'collector_ahmed',
    email: 'ahmed@example.com',
    firstName: 'أحمد',
    lastName: 'الجمعة',
    fullName: 'أحمد الجمعة',
    role: USER_ROLES.BIDDER,
    avatar: AVATARS.user1,
    phoneNumber: '+966502345678',
    isVerified: true,
    isActive: true,
    joinedAt: '2023-03-15T09:00:00Z',
    lastLoginAt: '2023-12-01T08:45:00Z',
    bidCount: 45,
    wonAuctions: 8,
    rating: 4.8,
    location: 'جدة، السعودية'
  },
  {
    id: '3',
    username: 'fatima_arts',
    email: 'fatima@example.com',
    firstName: 'فاطمة',
    lastName: 'النور',
    fullName: 'فاطمة النور',
    role: USER_ROLES.SELLER,
    avatar: AVATARS.user2,
    phoneNumber: '+966503456789',
    isVerified: true,
    isActive: true,
    joinedAt: '2023-02-20T14:30:00Z',
    lastLoginAt: '2023-12-01T11:20:00Z',
    bidCount: 12,
    wonAuctions: 3,
    rating: 4.9,
    location: 'الدمام، السعودية',
    sellerInfo: {
      businessName: 'معرض النور للفنون',
      businessLicense: 'CR123456789',
      specialties: ['فنون', 'لوحات', 'منحوتات'],
      yearsOfExperience: 12,
      auctionsHosted: 23,
      successRate: 96.5
    }
  },
  {
    id: '4',
    username: 'omar_watches',
    email: 'omar@example.com',
    firstName: 'عمر',
    lastName: 'الساعات',
    fullName: 'عمر الساعات',
    role: USER_ROLES.SELLER,
    avatar: AVATARS.user3,
    phoneNumber: '+966504567890',
    isVerified: true,
    isActive: true,
    joinedAt: '2023-04-10T16:00:00Z',
    lastLoginAt: '2023-12-01T09:15:00Z',
    bidCount: 8,
    wonAuctions: 2,
    rating: 4.7,
    location: 'الرياض، السعودية',
    sellerInfo: {
      businessName: 'معرض الساعات الفاخرة',
      businessLicense: 'CR987654321',
      specialties: ['ساعات فاخرة', 'ساعات كلاسيكية'],
      yearsOfExperience: 8,
      auctionsHosted: 18,
      successRate: 94.2
    }
  },
  {
    id: '5',
    username: 'sarah_collector',
    email: 'sarah@example.com',
    firstName: 'سارة',
    lastName: 'العتيبي',
    fullName: 'سارة العتيبي',
    role: USER_ROLES.BIDDER,
    avatar: AVATARS.user4,
    phoneNumber: '+966505678901',
    isVerified: true,
    isActive: true,
    joinedAt: '2023-06-05T11:45:00Z',
    lastLoginAt: '2023-12-01T07:30:00Z',
    bidCount: 32,
    wonAuctions: 6,
    rating: 4.6,
    location: 'مكة المكرمة، السعودية'
  }
];

// Mock auctions
export const AUCTIONS = [
  {
    id: '1',
    title: 'قلادة الماس الأزرق النادرة',
    titleEn: 'Rare Blue Diamond Necklace',
    description: 'قلادة فاخرة من الماس الأزرق النادر، تزن 15 قيراط، من تصميم دار المجوهرات العالمية تيفاني. القطعة معتمدة من معهد الأحجار الكريمة الأمريكي ومصحوبة بشهادة الأصالة.',
    categoryId: '1',
    categoryName: 'المجوهرات والأحجار الكريمة',
    sellerId: '3',
    sellerName: 'فاطمة النور',
    sellerRating: 4.9,
    startPrice: 50000,
    currentPrice: 85000,
    minBidIncrement: 1000,
    reservePrice: 75000,
    buyNowPrice: null,
    status: AUCTION_STATUSES.ACTIVE,
    startTime: '2023-12-01T18:00:00Z',
    endTime: '2023-12-01T20:00:00Z',
    duration: 120, // minutes
    timeRemaining: 3600, // seconds
    videoUrl: AUCTION_VIDEOS.jewelry_1.url,
    videoThumbnail: AUCTION_VIDEOS.jewelry_1.thumbnail,
    videoDuration: AUCTION_VIDEOS.jewelry_1.duration,
    images: [
      JEWELRY_IMAGES.diamond_necklace,
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop'
    ],
    condition: 'ممتاز',
    conditionDetails: 'حالة ممتازة، لم تُستخدم من قبل',
    authenticity: 'معتمد',
    certificateNumber: 'GIA-2023-BD-001',
    provenance: 'مجموعة خاصة',
    measurements: '45 سم طول السلسلة، 3 سم عرض القلادة',
    weight: '25 جرام',
    material: 'ذهب أبيض عيار 18 قيراط، ماس أزرق',
    viewCount: 1250,
    watchlistCount: 89,
    bidCount: 24,
    participantCount: 12,
    isHot: true,
    isFeatured: true,
    isReserveMetBool: true,
    shippingInfo: {
      weight: '0.5 kg',
      dimensions: '10x10x5 cm',
      shippingCost: 50,
      freeShipping: true,
      internationalShipping: true
    },
    location: 'الرياض، السعودية',
    timezone: 'Asia/Riyadh',
    tags: ['ماس', 'تيفاني', 'نادر', 'فاخر', 'أزرق'],
    createdAt: '2023-11-25T10:00:00Z',
    updatedAt: '2023-12-01T15:30:00Z'
  },
  {
    id: '2',
    title: 'لوحة الغروب الذهبي للفنان محمد الراشد',
    titleEn: 'Golden Sunset Painting by Mohammed Al-Rashed',
    description: 'لوحة زيتية رائعة تجسد منظر الغروب الذهبي، من أعمال الفنان السعودي المعاصر محمد الراشد. اللوحة مرسومة على قماش من الكتان بحجم 80x120 سم، وهي من المجموعة المحدودة للفنان.',
    categoryId: '2',
    categoryName: 'الفنون واللوحات',
    sellerId: '3',
    sellerName: 'فاطمة النور',
    sellerRating: 4.9,
    startPrice: 15000,
    currentPrice: 28000,
    minBidIncrement: 500,
    reservePrice: 25000,
    buyNowPrice: null,
    status: AUCTION_STATUSES.ACTIVE,
    startTime: '2023-12-01T19:00:00Z',
    endTime: '2023-12-01T21:30:00Z',
    duration: 150,
    timeRemaining: 7200,
    videoUrl: AUCTION_VIDEOS.art_1.url,
    videoThumbnail: AUCTION_VIDEOS.art_1.thumbnail,
    videoDuration: AUCTION_VIDEOS.art_1.duration,
    images: [
      ART_IMAGES.abstract_painting,
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&h=600&fit=crop'
    ],
    condition: 'ممتاز',
    conditionDetails: 'حالة ممتازة، محفوظة في إطار واقٍ من الأشعة',
    authenticity: 'معتمد',
    certificateNumber: 'MR-2023-GS-001',
    provenance: 'ورشة الفنان مباشرة',
    measurements: '80 x 120 سم',
    weight: '5 كجم مع الإطار',
    material: 'زيت على قماش كتان',
    viewCount: 856,
    watchlistCount: 67,
    bidCount: 18,
    participantCount: 9,
    isHot: true,
    isFeatured: false,
    isReserveMetBool: true,
    shippingInfo: {
      weight: '7 kg',
      dimensions: '90x130x10 cm',
      shippingCost: 100,
      freeShipping: false,
      internationalShipping: true
    },
    location: 'الدمام، السعودية',
    timezone: 'Asia/Riyadh',
    tags: ['فن معاصر', 'محمد الراشد', 'غروب', 'زيت', 'كتان'],
    createdAt: '2023-11-28T14:00:00Z',
    updatedAt: '2023-12-01T16:45:00Z'
  },
  {
    id: '3',
    title: 'ساعة رولكس ديتونا الذهبية 1995',
    titleEn: 'Rolex Daytona Gold 1995',
    description: 'ساعة رولكس ديتونا الأصلية من الذهب الأصفر عيار 18 قيراط، موديل 1995، مرجع 116528. الساعة في حالة ممتازة ومصحوبة بالصندوق الأصلي وأوراق الضمان.',
    categoryId: '5',
    categoryName: 'الساعات الفاخرة',
    sellerId: '4',
    sellerName: 'عمر الساعات',
    sellerRating: 4.7,
    startPrice: 80000,
    currentPrice: 95000,
    minBidIncrement: 2000,
    reservePrice: 90000,
    buyNowPrice: 120000,
    status: AUCTION_STATUSES.ACTIVE,
    startTime: '2023-12-01T20:00:00Z',
    endTime: '2023-12-01T22:00:00Z',
    duration: 120,
    timeRemaining: 10800,
    videoUrl: AUCTION_VIDEOS.watch_1.url,
    videoThumbnail: AUCTION_VIDEOS.watch_1.thumbnail,
    videoDuration: AUCTION_VIDEOS.watch_1.duration,
    images: [
      WATCH_IMAGES.luxury_rolex,
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&h=600&fit=crop'
    ],
    condition: 'ممتاز',
    conditionDetails: 'حالة ممتازة، خدمة حديثة من رولكس',
    authenticity: 'معتمد',
    certificateNumber: 'RLX-1995-DT-116528',
    provenance: 'مجموعة خاصة، مشتراة من وكيل رولكس المعتمد',
    measurements: '40 مم قطر الوجه',
    weight: '150 جرام',
    material: 'ذهب أصفر عيار 18 قيراط، زجاج ياقوتي',
    viewCount: 2340,
    watchlistCount: 145,
    bidCount: 31,
    participantCount: 15,
    isHot: true,
    isFeatured: true,
    isReserveMetBool: true,
    shippingInfo: {
      weight: '1 kg',
      dimensions: '20x20x15 cm',
      shippingCost: 75,
      freeShipping: true,
      internationalShipping: true
    },
    location: 'الرياض، السعودية',
    timezone: 'Asia/Riyadh',
    tags: ['رولكس', 'ديتونا', 'ذهب', '1995', 'نادر'],
    createdAt: '2023-11-30T09:00:00Z',
    updatedAt: '2023-12-01T17:20:00Z'
  },
  {
    id: '4',
    title: 'مزهرية صينية من عهد أسرة تشينغ',
    titleEn: 'Chinese Qing Dynasty Vase',
    description: 'مزهرية صينية نادرة من عهد أسرة تشينغ (القرن 18)، مصنوعة من البورسلان الأزرق والأبيض. القطعة في حالة ممتازة ومعتمدة من خبراء الآثار الصينية.',
    categoryId: '3',
    categoryName: 'التحف والآثار',
    sellerId: '3',
    sellerName: 'فاطمة النور',
    sellerRating: 4.9,
    startPrice: 25000,
    currentPrice: 45000,
    minBidIncrement: 1000,
    reservePrice: 40000,
    buyNowPrice: null,
    status: AUCTION_STATUSES.ACTIVE,
    startTime: '2023-12-02T17:00:00Z',
    endTime: '2023-12-02T19:30:00Z',
    duration: 150,
    timeRemaining: 86400, // tomorrow
    videoUrl: AUCTION_VIDEOS.antique_1.url,
    videoThumbnail: AUCTION_VIDEOS.antique_1.thumbnail,
    videoDuration: AUCTION_VIDEOS.antique_1.duration,
    images: [
      ANTIQUE_IMAGES.vintage_vase,
      'https://images.unsplash.com/photo-1610639489426-3a7d837e7963?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
    ],
    condition: 'ممتاز',
    conditionDetails: 'حالة ممتازة، بدون شروخ أو ترميم',
    authenticity: 'معتمد',
    certificateNumber: 'QING-1750-VAS-001',
    provenance: 'مجموعة خاصة، مشتراة من مزاد دولي',
    measurements: '35 سم ارتفاع، 20 سم قطر',
    weight: '3 كجم',
    material: 'بورسلان صيني أصلي',
    viewCount: 678,
    watchlistCount: 52,
    bidCount: 8,
    participantCount: 6,
    isHot: false,
    isFeatured: false,
    isReserveMetBool: true,
    shippingInfo: {
      weight: '5 kg',
      dimensions: '40x40x45 cm',
      shippingCost: 150,
      freeShipping: false,
      internationalShipping: true
    },
    location: 'جدة، السعودية',
    timezone: 'Asia/Riyadh',
    tags: ['صيني', 'تشينغ', 'بورسلان', 'آثار', 'نادر'],
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2023-12-01T15:00:00Z'
  },
  {
    id: '5',
    title: 'فيراري 250 GTO 1962 كلاسيكية',
    titleEn: 'Ferrari 250 GTO 1962 Classic',
    description: 'فيراري 250 GTO كلاسيكية من عام 1962، واحدة من 39 سيارة فقط تم إنتاجها. السيارة مرممة بالكامل وتحمل شهادة الأصالة من فيراري. محرك V12 بحجم 3 لتر.',
    categoryId: '4',
    categoryName: 'السيارات الكلاسيكية',
    sellerId: '4',
    sellerName: 'عمر الساعات',
    sellerRating: 4.7,
    startPrice: 25000000,
    currentPrice: 25000000,
    minBidIncrement: 100000,
    reservePrice: 30000000,
    buyNowPrice: null,
    status: AUCTION_STATUSES.PENDING,
    startTime: '2023-12-05T20:00:00Z',
    endTime: '2023-12-05T23:00:00Z',
    duration: 180,
    timeRemaining: null,
    videoUrl: AUCTION_VIDEOS.car_1.url,
    videoThumbnail: AUCTION_VIDEOS.car_1.thumbnail,
    videoDuration: AUCTION_VIDEOS.car_1.duration,
    images: [
      CAR_IMAGES.classic_ferrari,
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    condition: 'ممتاز',
    conditionDetails: 'مرممة بالكامل، جميع القطع أصلية',
    authenticity: 'معتمد',
    certificateNumber: 'FER-1962-250GTO-3987',
    provenance: 'مجموعة خاصة، مشتراة من مزاد باريت جاكسون',
    measurements: 'طول 4.1 متر، عرض 1.68 متر',
    weight: '880 كجم',
    material: 'هيكل معدني، محرك V12',
    viewCount: 5670,
    watchlistCount: 234,
    bidCount: 0,
    participantCount: 0,
    isHot: true,
    isFeatured: true,
    isReserveMetBool: false,
    shippingInfo: {
      weight: '900 kg',
      dimensions: '4.5x2x1.3 m',
      shippingCost: 5000,
      freeShipping: false,
      internationalShipping: true
    },
    location: 'الرياض، السعودية',
    timezone: 'Asia/Riyadh',
    tags: ['فيراري', '250 GTO', 'كلاسيكية', '1962', 'نادر جداً'],
    createdAt: '2023-11-20T12:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z'
  }
];

// Mock bids
export const BIDS = [
  {
    id: '1',
    auctionId: '1',
    bidderId: '2',
    bidderName: 'أحمد الجمعة',
    bidderAvatar: AVATARS.user1,
    amount: 85000,
    previousAmount: 82000,
    increment: 3000,
    status: BID_STATUSES.WINNING,
    timestamp: '2023-12-01T15:45:00Z',
    timeInAuction: 105, // seconds into auction
    isAutoBid: false,
    bidderRating: 4.8,
    bidderBidCount: 45
  },
  {
    id: '2',
    auctionId: '1',
    bidderId: '5',
    bidderName: 'سارة العتيبي',
    bidderAvatar: AVATARS.user4,
    amount: 82000,
    previousAmount: 78000,
    increment: 4000,
    status: BID_STATUSES.OUTBID,
    timestamp: '2023-12-01T15:30:00Z',
    timeInAuction: 90,
    isAutoBid: false,
    bidderRating: 4.6,
    bidderBidCount: 32
  },
  {
    id: '3',
    auctionId: '2',
    bidderId: '2',
    bidderName: 'أحمد الجمعة',
    bidderAvatar: AVATARS.user1,
    amount: 28000,
    previousAmount: 26500,
    increment: 1500,
    status: BID_STATUSES.WINNING,
    timestamp: '2023-12-01T16:20:00Z',
    timeInAuction: 80,
    isAutoBid: true,
    bidderRating: 4.8,
    bidderBidCount: 45
  },
  {
    id: '4',
    auctionId: '3',
    bidderId: '5',
    bidderName: 'سارة العتيبي',
    bidderAvatar: AVATARS.user4,
    amount: 95000,
    previousAmount: 92000,
    increment: 3000,
    status: BID_STATUSES.WINNING,
    timestamp: '2023-12-01T17:10:00Z',
    timeInAuction: 70,
    isAutoBid: false,
    bidderRating: 4.6,
    bidderBidCount: 32
  }
];

// Mock comments
export const COMMENTS = [
  {
    id: '1',
    auctionId: '1',
    userId: '2',
    username: 'أحمد الجمعة',
    userAvatar: AVATARS.user1,
    userRating: 4.8,
    content: 'قطعة رائعة! الماس الأزرق نادر جداً وهذه القلادة تستحق كل ريال.',
    timestamp: '2023-12-01T14:30:00Z',
    likesCount: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        userId: '3',
        username: 'فاطمة النور',
        userAvatar: AVATARS.user2,
        content: 'شكراً لك أحمد، نحن نفتخر بعرض أجمل القطع في معرضنا.',
        timestamp: '2023-12-01T14:35:00Z',
        likesCount: 5,
        isLiked: true
      }
    ]
  },
  {
    id: '2',
    auctionId: '1',
    userId: '5',
    username: 'سارة العتيبي',
    userAvatar: AVATARS.user4,
    userRating: 4.6,
    content: 'هل يمكن رؤية شهادة الأصالة بوضوح أكثر؟',
    timestamp: '2023-12-01T15:00:00Z',
    likesCount: 3,
    isLiked: false,
    replies: []
  },
  {
    id: '3',
    auctionId: '2',
    userId: '2',
    username: 'أحمد الجمعة',
    userAvatar: AVATARS.user1,
    userRating: 4.8,
    content: 'أعمال محمد الراشد دائماً مميزة، خاصة لوحات المناظر الطبيعية.',
    timestamp: '2023-12-01T15:45:00Z',
    likesCount: 8,
    isLiked: true,
    replies: []
  }
];

// Mock messages
export const CONVERSATIONS = [
  {
    id: '1',
    participantIds: ['2', '3'],
    participantNames: ['أحمد الجمعة', 'فاطمة النور'],
    lastMessage: 'شكراً لك، سأنتظر وصول القلادة',
    lastMessageTime: '2023-12-01T16:30:00Z',
    unreadCount: 0,
    isActive: true,
    auctionId: '1',
    auctionTitle: 'قلادة الماس الأزرق النادرة'
  },
  {
    id: '2',
    participantIds: ['5', '4'],
    participantNames: ['سارة العتيبي', 'عمر الساعات'],
    lastMessage: 'هل الضمان ساري المفعول؟',
    lastMessageTime: '2023-12-01T14:15:00Z',
    unreadCount: 1,
    isActive: true,
    auctionId: '3',
    auctionTitle: 'ساعة رولكس ديتونا الذهبية 1995'
  }
];

export const MESSAGES = [
  {
    id: '1',
    conversationId: '1',
    senderId: '2',
    senderName: 'أحمد الجمعة',
    receiverId: '3',
    content: 'مرحباً، هل يمكنني معرفة المزيد عن تاريخ هذه القلادة؟',
    timestamp: '2023-12-01T14:00:00Z',
    isRead: true,
    messageType: 'text'
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '3',
    senderName: 'فاطمة النور',
    receiverId: '2',
    content: 'أهلاً وسهلاً، هذه القلادة من مجموعة تيفاني المحدودة من عام 2020، وهي قطعة فريدة.',
    timestamp: '2023-12-01T14:05:00Z',
    isRead: true,
    messageType: 'text'
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '2',
    senderName: 'أحمد الجمعة',
    receiverId: '3',
    content: 'شكراً لك، سأنتظر وصول القلادة',
    timestamp: '2023-12-01T16:30:00Z',
    isRead: true,
    messageType: 'text'
  }
];

// Mock notifications
export const NOTIFICATIONS = [
  {
    id: '1',
    userId: '2',
    type: 'bid_outbid',
    title: 'تم تجاوز مزايدتك',
    message: 'تم تجاوز مزايدتك في مزاد "قلادة الماس الأزرق النادرة" بمبلغ 85,000 ريال',
    auctionId: '1',
    auctionTitle: 'قلادة الماس الأزرق النادرة',
    timestamp: '2023-12-01T15:45:00Z',
    isRead: false,
    isImportant: true,
    actionUrl: '/auctions/1'
  },
  {
    id: '2',
    userId: '5',
    type: 'auction_ending_soon',
    title: 'المزاد ينتهي قريباً',
    message: 'المزاد "ساعة رولكس ديتونا الذهبية 1995" ينتهي خلال 30 دقيقة',
    auctionId: '3',
    auctionTitle: 'ساعة رولكس ديتونا الذهبية 1995',
    timestamp: '2023-12-01T17:30:00Z',
    isRead: false,
    isImportant: true,
    actionUrl: '/auctions/3'
  },
  {
    id: '3',
    userId: '3',
    type: 'new_message',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من أحمد الجمعة حول مزاد "قلادة الماس الأزرق النادرة"',
    conversationId: '1',
    timestamp: '2023-12-01T16:30:00Z',
    isRead: true,
    isImportant: false,
    actionUrl: '/messages/1'
  }
];

// Mock reports
export const REPORTS = [
  {
    id: '1',
    reporterId: '5',
    reporterName: 'سارة العتيبي',
    reportedType: 'auction',
    reportedId: '1',
    reportedTitle: 'قلادة الماس الأزرق النادرة',
    reportedUserId: '3',
    reportedUserName: 'فاطمة النور',
    reason: 'معلومات مضللة',
    description: 'الوصف لا يتطابق مع الصور المعروضة',
    status: 'pending',
    priority: 'medium',
    timestamp: '2023-12-01T10:00:00Z',
    reviewedBy: null,
    reviewedAt: null,
    resolution: null
  }
];

// Mock follows
export const FOLLOWS = [
  {
    id: '1',
    followerId: '2',
    followeeId: '3',
    followeeType: 'seller',
    followeeName: 'فاطمة النور',
    timestamp: '2023-11-15T09:00:00Z'
  },
  {
    id: '2',
    followerId: '5',
    followeeId: '1',
    followeeType: 'auction',
    followeeName: 'قلادة الماس الأزرق النادرة',
    timestamp: '2023-12-01T11:30:00Z'
  }
];

// Mock likes
export const LIKES = [
  {
    id: '1',
    userId: '2',
    targetType: 'auction',
    targetId: '1',
    timestamp: '2023-12-01T12:00:00Z'
  },
  {
    id: '2',
    userId: '5',
    targetType: 'comment',
    targetId: '1',
    timestamp: '2023-12-01T14:45:00Z'
  }
];

// System settings
export const SYSTEM_SETTINGS = {
  platform: {
    name: PLATFORM_CONFIG.name,
    description: 'منصة مزادات فيديو متقدمة للمعروضات الفاخرة والنادرة',
    logo: 'https://images.unsplash.com/photo-1635776062043-223faf322554?w=200&h=80&fit=crop',
    favicon: 'https://images.unsplash.com/photo-1635776062043-223faf322554?w=32&h=32&fit=crop',
    supportEmail: PLATFORM_CONFIG.supportEmail,
    supportPhone: PLATFORM_CONFIG.phoneNumber
  },
  auction: {
    minBidIncrement: 100,
    maxAuctionDuration: 1440, // 24 hours in minutes
    minAuctionDuration: 30, // 30 minutes
    bidExtensionTime: 5, // minutes
    reservePriceRequired: false,
    buyNowEnabled: true,
    autoBidEnabled: true,
    maxAutoBidAmount: 1000000
  },
  media: {
    maxVideoSize: 500, // MB
    maxImageSize: 10, // MB
    allowedVideoFormats: ['.mp4', '.mov', '.avi'],
    allowedImageFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    videoQuality: ['240p', '360p', '480p', '720p', '1080p'],
    thumbnailSize: { width: 400, height: 300 }
  },
  user: {
    verificationRequired: true,
    minAge: 18,
    maxBidsPerAuction: 100,
    bidHistoryRetention: 365, // days
    accountDeletionGracePeriod: 30 // days
  },
  fees: {
    sellerCommission: 0.05, // 5%
    buyerPremium: 0.03, // 3%
    paymentProcessingFee: 0.025, // 2.5%
    withdrawalFee: 25 // SAR
  }
};

// Helper functions
export const getAuctionById = (id) => AUCTIONS.find(auction => auction.id === id);
export const getUserById = (id) => USERS.find(user => user.id === id);
export const getCategoryById = (id) => CATEGORIES.find(category => category.id === id);
export const getBidsByAuctionId = (auctionId) => BIDS.filter(bid => bid.auctionId === auctionId);
export const getCommentsByAuctionId = (auctionId) => COMMENTS.filter(comment => comment.auctionId === auctionId);
export const getNotificationsByUserId = (userId) => NOTIFICATIONS.filter(notification => notification.userId === userId);
export const getConversationsByUserId = (userId) => CONVERSATIONS.filter(conversation => 
  conversation.participantIds.includes(userId)
);

export const formatPrice = (price, currency = 'SAR') => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(price);
};

export const formatDate = (date, locale = 'ar-SA') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getTimeRemaining = (endTime) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const difference = end - now;
  
  if (difference <= 0) {
    return { expired: true };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, expired: false };
};

// Export all mock data
export default {
  PLATFORM_CONFIG,
  USER_ROLES,
  AUCTION_STATUSES,
  BID_STATUSES,
  CATEGORIES,
  USERS,
  AUCTIONS,
  BIDS,
  COMMENTS,
  CONVERSATIONS,
  MESSAGES,
  NOTIFICATIONS,
  REPORTS,
  FOLLOWS,
  LIKES,
  SYSTEM_SETTINGS,
  getAuctionById,
  getUserById,
  getCategoryById,
  getBidsByAuctionId,
  getCommentsByAuctionId,
  getNotificationsByUserId,
  getConversationsByUserId,
  formatPrice,
  formatDate,
  getTimeRemaining
};