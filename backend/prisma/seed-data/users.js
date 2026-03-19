const users = [
  // Admin User
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@mazadmotion.com',
    username: 'admin',
    password: 'admin123456',
    role: 'ADMIN',
    isActive: true,
    profile: {
      firstName: 'مدير',
      lastName: 'النظام',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966501234567',
      address: 'الرياض، المملكة العربية السعودية',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'مدير منصة مزاد موشن - نحو مستقبل أفضل للمزادات الإلكترونية',
      isVerified: true
    }
  },
  // Sellers
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'ahmed.collector@email.com',
    username: 'ahmed_collector',
    password: 'password123',
    role: 'SELLER',
    isActive: true,
    profile: {
      firstName: 'أحمد',
      lastName: 'العتيبي',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966501111111',
      address: 'حي الملز، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'جامع للتحف والقطع النادرة منذ 15 عام',
      isVerified: true
    },
    seller: {
      businessName: 'مجموعة العتيبي للتحف',
      businessLicense: 'CR1234567890',
      commission: 4.5,
      rating: 4.8,
      totalSales: 150,
      isVerified: true
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'sara.luxury@email.com',
    username: 'sara_luxury',
    password: 'password123',
    role: 'SELLER',
    isActive: true,
    profile: {
      firstName: 'سارة',
      lastName: 'الدوسري',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966502222222',
      address: 'حي العليا، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'متخصصة في المجوهرات والساعات الفاخرة',
      isVerified: true
    },
    seller: {
      businessName: 'بوتيك سارة للمجوهرات',
      businessLicense: 'CR1234567891',
      commission: 5.0,
      rating: 4.9,
      totalSales: 89,
      isVerified: true
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'mohammed.cars@email.com',
    username: 'mohammed_cars',
    password: 'password123',
    role: 'SELLER',
    isActive: true,
    profile: {
      firstName: 'محمد',
      lastName: 'الغامدي',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966503333333',
      address: 'حي النرجس، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'تاجر سيارات كلاسيكية وفاخرة، خبرة 20 سنة',
      isVerified: true
    },
    seller: {
      businessName: 'معرض الغامدي للسيارات الكلاسيكية',
      businessLicense: 'CR1234567892',
      commission: 3.5,
      rating: 4.7,
      totalSales: 67,
      isVerified: true
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'fatima.art@email.com',
    username: 'fatima_art',
    password: 'password123',
    role: 'SELLER',
    isActive: true,
    profile: {
      firstName: 'فاطمة',
      lastName: 'الحربي',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966504444444',
      address: 'حي السليمانية، جدة',
      city: 'جدة',
      country: 'السعودية',
      bio: 'فنانة ومعلمة فنون، أبيع أعمالي والقطع الفنية النادرة',
      isVerified: true
    },
    seller: {
      businessName: 'جاليري فاطمة للفنون',
      businessLicense: 'CR1234567893',
      commission: 5.5,
      rating: 4.6,
      totalSales: 34,
      isVerified: false
    }
  },
  // Regular Users (Bidders)
  {
    id: '00000000-0000-0000-0000-000000000010',
    email: 'khalid.bidder@email.com',
    username: 'khalid_bidder',
    password: 'password123',
    role: 'USER',
    isActive: true,
    profile: {
      firstName: 'خالد',
      lastName: 'المطيري',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966505555555',
      address: 'حي الروضة، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'مهتم بجمع الساعات النادرة والسيارات الكلاسيكية',
      isVerified: false
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000011',
    email: 'nour.collector@email.com',
    username: 'nour_collector',
    password: 'password123',
    role: 'USER',
    isActive: true,
    profile: {
      firstName: 'نور',
      lastName: 'الزهراني',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966506666666',
      address: 'حي الفيصلية، جدة',
      city: 'جدة',
      country: 'السعودية',
      bio: 'عاشقة للفنون والمجوهرات، جامعة للقطع الفريدة',
      isVerified: true
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000012',
    email: 'omar.investor@email.com',
    username: 'omar_investor',
    password: 'password123',
    role: 'USER',
    isActive: true,
    profile: {
      firstName: 'عمر',
      lastName: 'الشهري',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966507777777',
      address: 'حي الأندلس، جدة',
      city: 'جدة',
      country: 'السعودية',
      bio: 'مستثمر في الأصول النادرة والقيمة، أحب اقتناء القطع المميزة',
      isVerified: true
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000013',
    email: 'rania.books@email.com',
    username: 'rania_books',
    password: 'password123',
    role: 'USER',
    isActive: true,
    profile: {
      firstName: 'رانيا',
      lastName: 'العسيري',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966508888888',
      address: 'حي التعاون، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'مكتبية ومولعة بالكتب النادرة والمخطوطات التاريخية',
      isVerified: false
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000014',
    email: 'abdullah.tech@email.com',
    username: 'abdullah_tech',
    password: 'password123',
    role: 'USER',
    isActive: true,
    profile: {
      firstName: 'عبد الله',
      lastName: 'القحطاني',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966509999999',
      address: 'حي الربوة، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'مهندس برمجيات، مهتم بالإلكترونيات النادرة والتكنولوجيا القديمة',
      isVerified: true
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000015',
    email: 'maha.furniture@email.com',
    username: 'maha_furniture',
    password: 'password123',
    role: 'USER',
    isActive: true,
    profile: {
      firstName: 'مها',
      lastName: 'البقمي',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966510000000',
      address: 'حي النهضة، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'مصممة ديكور، أبحث عن قطع الأثاث الأثرية والديكورات المميزة',
      isVerified: false
    }
  },
  {
    id: '00000000-0000-0000-0000-000000000016',
    email: 'yasir.sports@email.com',
    username: 'yasir_sports',
    password: 'password123',
    role: 'USER',
    isActive: true,
    profile: {
      firstName: 'ياسر',
      lastName: 'الحارثي',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966511111111',
      address: 'حي الصحافة، الرياض',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'رياضي سابق، جامع لمعدات الرياضة النادرة والتذكارات الرياضية',
      isVerified: true
    }
  },
  // Moderator
  {
    id: '00000000-0000-0000-0000-000000000020',
    email: 'moderator@mazadmotion.com',
    username: 'moderator_1',
    password: 'mod123456',
    role: 'MODERATOR',
    isActive: true,
    profile: {
      firstName: 'ليلى',
      lastName: 'الشمري',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      phoneNumber: '+966512222222',
      address: 'الرياض، المملكة العربية السعودية',
      city: 'الرياض',
      country: 'السعودية',
      bio: 'مشرفة محتوى في منصة مزاد موشن',
      isVerified: true
    }
  }
];

module.exports = { users };