const auctions = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'ساعة رولكس ديتونا ذهبية نادرة - إصدار 1990',
    description: 'ساعة رولكس ديتونا ذهبية نادرة من إصدار عام 1990، حالة ممتازة جداً مع الصندوق الأصلي وأوراق الضمان. الساعة تتميز بآلية الكرونوجراف السويسرية الأصلية، ومقاومة للماء حتى عمق 100 متر. تم صيانتها مؤخراً من قبل مركز رولكس المعتمد في جنيف. هذه القطعة الاستثنائية تعتبر من الإصدارات المحدودة التي نادراً ما تظهر في المزادات.',
    shortDescription: 'ساعة رولكس ديتونا ذهبية نادرة - إصدار 1990 - حالة ممتازة',
    startingPrice: 85000,
    currentPrice: 142000,
    minimumBid: 1000,
    buyNowPrice: 200000,
    status: 'LIVE',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // Ends in 4 hours
    duration: 360, // 6 hours
    viewCount: 1547,
    participantCount: 34,
    totalBids: 127,
    isHighlighted: true,
    location: 'الرياض، المملكة العربية السعودية',
    terms: 'الدفع خلال 48 ساعة، الشحن مؤمن ومجاني، إرجاع خلال 7 أيام إذا لم تطابق المواصفات المذكورة',
    categoryName: 'المجوهرات والساعات',
    sellerName: 'بوتيك سارة للمجوهرات',
    video: {
      filename: 'rolex_daytona_1990.mp4',
      originalName: 'Rolex Daytona Gold 1990 Showcase.mp4',
      mimeType: 'video/mp4',
      size: 45678912, // ~45MB
      duration: 180, // 3 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    images: [
      {
        filename: 'rolex_main.jpg',
        originalName: 'Rolex Daytona Main Photo.jpg',
        mimeType: 'image/jpeg',
        size: 2345678,
        imageUrl: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=600&fit=crop'
      },
      {
        filename: 'rolex_side.jpg',
        originalName: 'Rolex Side View.jpg',
        mimeType: 'image/jpeg',
        size: 1876543,
        imageUrl: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800&h=600&fit=crop'
      },
      {
        filename: 'rolex_certificate.jpg',
        originalName: 'Certificate.jpg',
        mimeType: 'image/jpeg',
        size: 987654,
        imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'سيارة بورش 911 كلاسيكية 1973 - مُجددة بالكامل',
    description: 'سيارة بورش 911 كلاسيكية من عام 1973، تم تجديدها بالكامل من قبل خبراء في ألمانيا. المحرك تم إعادة بناؤه بالكامل، الصبغة الأصلية الزرقاء المعدنية، المقاعد الجلدية الأصلية، ناقل الحركة اليدوي 5 سرعات يعمل بسلاسة تامة. السيارة مرخصة ومسجلة، جميع الأوراق مكتملة. هذه القطعة النادرة تعتبر استثماراً ممتازاً للمهتمين بالسيارات الكلاسيكية.',
    shortDescription: 'بورش 911 كلاسيكية 1973 - مُجددة بالكامل - حالة فاخرة',
    startingPrice: 125000,
    currentPrice: 187500,
    minimumBid: 2500,
    buyNowPrice: 275000,
    status: 'LIVE',
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // Started 5 hours ago
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // Ends in 3 hours
    duration: 480, // 8 hours
    viewCount: 2341,
    participantCount: 28,
    totalBids: 89,
    isHighlighted: true,
    location: 'الرياض، المملكة العربية السعودية',
    terms: 'يجب فحص السيارة قبل المزايدة، الدفع خلال 72 ساعة، نقل الملكية على المشتري',
    categoryName: 'السيارات والمركبات',
    sellerName: 'معرض الغامدي للسيارات الكلاسيكية',
    video: {
      filename: 'porsche_911_1973.mp4',
      originalName: 'Porsche 911 1973 Full Tour.mp4',
      mimeType: 'video/mp4',
      size: 78901234, // ~79MB
      duration: 420, // 7 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    images: [
      {
        filename: 'porsche_exterior.jpg',
        originalName: 'Porsche 911 Exterior.jpg',
        mimeType: 'image/jpeg',
        size: 3456789,
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'
      },
      {
        filename: 'porsche_interior.jpg',
        originalName: 'Interior View.jpg',
        mimeType: 'image/jpeg',
        size: 2987654,
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop'
      },
      {
        filename: 'porsche_engine.jpg',
        originalName: 'Engine Bay.jpg',
        mimeType: 'image/jpeg',
        size: 2123456,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'لوحة فنية زيتية أصلية - الغروب في الصحراء',
    description: 'لوحة فنية زيتية أصلية من إبداع الفنان المحلي محمد الفهيد، تُظهر مشهد غروب الشمس في الصحراء العربية بألوان دافئة وتفاصيل ساحرة. اللوحة مرسومة على قماش عالي الجودة ومؤطرة بإطار ذهبي أنيق. الأبعاد 80×60 سم، موقعة من الفنان ومؤرخة 2019. هذه القطعة الفنية الأصلية تعكس جمال الطبيعة الصحراوية وتناسب المجموعات الفنية الراقية.',
    shortDescription: 'لوحة فنية زيتية أصلية - الغروب في الصحراء - موقعة',
    startingPrice: 3500,
    currentPrice: 6750,
    minimumBid: 250,
    buyNowPrice: 12000,
    status: 'APPROVED',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Starts in 2 hours
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // Ends in 26 hours
    duration: 1440, // 24 hours
    viewCount: 789,
    participantCount: 0,
    totalBids: 0,
    isHighlighted: false,
    location: 'جدة، المملكة العربية السعودية',
    terms: 'اللوحة أصلية 100%، شهادة أصالة مرفقة، تغليف احترافي للشحن',
    categoryName: 'الفنون واللوحات',
    sellerName: 'جاليري فاطمة للفنون',
    video: {
      filename: 'desert_sunset_painting.mp4',
      originalName: 'Desert Sunset Artwork Showcase.mp4',
      mimeType: 'video/mp4',
      size: 23456789, // ~23MB
      duration: 120, // 2 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    images: [
      {
        filename: 'painting_full.jpg',
        originalName: 'Desert Sunset Full View.jpg',
        mimeType: 'image/jpeg',
        size: 2765432,
        imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop'
      },
      {
        filename: 'painting_signature.jpg',
        originalName: 'Artist Signature.jpg',
        mimeType: 'image/jpeg',
        size: 987654,
        imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop'
      },
      {
        filename: 'painting_frame.jpg',
        originalName: 'Frame Detail.jpg',
        mimeType: 'image/jpeg',
        size: 1456789,
        imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'آيفون 14 برو ماكس 1TB - لون ذهبي - جديد مُفتوح',
    description: 'آيفون 14 برو ماكس بسعة 1 تيرابايت، لون الذهب الجديد، الجهاز جديد تماماً ولم يستخدم، مُفتوح فقط للفحص. يأتي مع جميع الملحقات الأصلية في العلبة الأصلية، شاحن، كابل، سماعات، والضمان ساري لمدة عام كامل من أبل. الجهاز خالي من أي خدوش أو عيوب ويعمل بكامل كفاءته. هذا الطراز الأحدث يتميز بكاميرا احترافية 48 ميجابكسل وشاشة ProMotion.',
    shortDescription: 'آيفون 14 برو ماكس 1TB ذهبي - جديد مُفتوح - ضمان أبل',
    startingPrice: 4200,
    currentPrice: 4200,
    minimumBid: 100,
    buyNowPrice: 5500,
    status: 'PENDING',
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // Starts in 12 hours
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000), // Ends in 36 hours
    duration: 1440, // 24 hours
    viewCount: 1234,
    participantCount: 0,
    totalBids: 0,
    isHighlighted: false,
    location: 'الرياض، المملكة العربية السعودية',
    terms: 'الجهاز جديد تماماً، إرجاع خلال 3 أيام، الضمان قابل للنقل',
    categoryName: 'الإلكترونيات',
    sellerName: 'مجموعة العتيبي للتحف',
    video: {
      filename: 'iphone_14_pro_max.mp4',
      originalName: 'iPhone 14 Pro Max Unboxing.mp4',
      mimeType: 'video/mp4',
      size: 34567890, // ~35MB
      duration: 240, // 4 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    },
    images: [
      {
        filename: 'iphone_box.jpg',
        originalName: 'iPhone Box.jpg',
        mimeType: 'image/jpeg',
        size: 1876543,
        imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=600&fit=crop'
      },
      {
        filename: 'iphone_front.jpg',
        originalName: 'iPhone Front View.jpg',
        mimeType: 'image/jpeg',
        size: 2345678,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop'
      },
      {
        filename: 'iphone_accessories.jpg',
        originalName: 'Accessories.jpg',
        mimeType: 'image/jpeg',
        size: 1654321,
        imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    title: 'طقم أثاث صالة كلاسيكي - خشب الماهوجني الأصلي',
    description: 'طقم أثاث صالة فاخر من خشب الماهوجني الأصلي، يتكون من كنبة كبيرة ثلاثية، كرسيين منفردين، طاولة وسط، وطاولتين جانبيتين. القماش حرير أصلي بلون كريمي مع تطريز ذهبي. الطقم مصنوع يدوياً من قبل حرفيين مهرة، والخشب مُعالج ومقاوم للحشرات. الأثاث في حالة ممتازة ومحافظ عليه بعناية فائقة. يناسب القصور والفلل الفاخرة.',
    shortDescription: 'طقم صالة كلاسيكي - ماهوجني أصلي - حرير مطرز',
    startingPrice: 15000,
    currentPrice: 22500,
    minimumBid: 500,
    buyNowPrice: 35000,
    status: 'ENDED',
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000), // Started 48 hours ago
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ended 24 hours ago
    duration: 1440, // 24 hours
    viewCount: 567,
    participantCount: 12,
    totalBids: 23,
    isHighlighted: false,
    location: 'الرياض، المملكة العربية السعودية',
    terms: 'الطقم بحالة ممتازة، الفك والتركيب على البائع، النقل على المشتري',
    categoryName: 'الأثاث والديكور',
    sellerName: 'مجموعة العتيبي للتحف',
    video: {
      filename: 'mahogany_furniture_set.mp4',
      originalName: 'Classic Mahogany Furniture Showcase.mp4',
      mimeType: 'video/mp4',
      size: 56789123, // ~57MB
      duration: 300, // 5 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    },
    images: [
      {
        filename: 'furniture_full_set.jpg',
        originalName: 'Complete Furniture Set.jpg',
        mimeType: 'image/jpeg',
        size: 3876543,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      },
      {
        filename: 'sofa_detail.jpg',
        originalName: 'Sofa Detail.jpg',
        mimeType: 'image/jpeg',
        size: 2765432,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop'
      },
      {
        filename: 'wood_grain.jpg',
        originalName: 'Mahogany Wood Detail.jpg',
        mimeType: 'image/jpeg',
        size: 1987654,
        imageUrl: 'https://images.unsplash.com/photo-1509692933967-4ac2e2b7e8f7?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    title: 'مخطوطة قرآنية نادرة من القرن الثاني عشر الهجري',
    description: 'مخطوطة قرآنية نادرة وقيمة من القرن الثاني عشر الهجري (القرن الثامن عشر الميلادي)، مكتوبة بخط النسخ الجميل بحبر ذهبي وأسود على ورق مُعتق عالي الجودة. المخطوطة محفوظة في حالة ممتازة مع إضاءات وزخارف إسلامية تقليدية. تحتوي على جزء من القرآن الكريم مع تفسير باللغة العربية في الهوامش. هذه القطعة التاريخية الثمينة تُعتبر كنزاً للمهتمين بالتراث الإسلامي والمخطوطات النادرة.',
    shortDescription: 'مخطوطة قرآنية نادرة - القرن 12هـ - خط ذهبي',
    startingPrice: 25000,
    currentPrice: 45000,
    minimumBid: 1000,
    buyNowPrice: 75000,
    status: 'LIVE',
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // Started 1 hour ago
    endTime: new Date(Date.now() + 23 * 60 * 60 * 1000), // Ends in 23 hours
    duration: 1440, // 24 hours
    viewCount: 892,
    participantCount: 18,
    totalBids: 42,
    isHighlighted: true,
    location: 'مكة المكرمة، المملكة العربية السعودية',
    terms: 'شهادة أصالة مُعتمدة، تأمين شامل للشحن، لا يُسمح بالإرجاع لطبيعة القطعة التاريخية',
    categoryName: 'الكتب والمخطوطات',
    sellerName: 'مجموعة العتيبي للتحف',
    video: {
      filename: 'quran_manuscript.mp4',
      originalName: 'Rare Quran Manuscript 12th Century.mp4',
      mimeType: 'video/mp4',
      size: 42345678, // ~42MB
      duration: 360, // 6 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    },
    images: [
      {
        filename: 'manuscript_cover.jpg',
        originalName: 'Manuscript Cover.jpg',
        mimeType: 'image/jpeg',
        size: 3456789,
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop'
      },
      {
        filename: 'calligraphy_detail.jpg',
        originalName: 'Golden Calligraphy.jpg',
        mimeType: 'image/jpeg',
        size: 2876543,
        imageUrl: 'https://images.unsplash.com/photo-1574704647411-66b8af26aa2b?w=800&h=600&fit=crop'
      },
      {
        filename: 'illumination.jpg',
        originalName: 'Islamic Illumination.jpg',
        mimeType: 'image/jpeg',
        size: 2123456,
        imageUrl: 'https://images.unsplash.com/photo-1573163044895-5b2e9c4e5c28?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    title: 'طقم كؤوس كريستال بوهيميا - 24 قطعة مع صينية ذهبية',
    description: 'طقم فاخر من كؤوس الكريستال البوهيمي الأصلي، يتكون من 24 كأس بأشكال وأحجام مختلفة (كؤوس ماء، عصير، شمبانيا، وين) مع صينية تقديم مطلية بالذهب عيار 24 قيراط. الطقم محفور يدوياً بنقوش كلاسيكية أوروبية، والكريستال عالي الجودة من أشهر معامل بوهيميا في التشيك. كل قطعة تتميز بالشفافية المثالية والرنين العذب. يأتي في علبة مخملية فاخرة مناسبة للإهداء.',
    shortDescription: 'طقم كريستال بوهيميا - 24 قطعة - صينية ذهبية',
    startingPrice: 2800,
    currentPrice: 4200,
    minimumBid: 200,
    status: 'LIVE',
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3 hours ago
    endTime: new Date(Date.now() + 9 * 60 * 60 * 1000), // Ends in 9 hours
    duration: 720, // 12 hours
    viewCount: 678,
    participantCount: 15,
    totalBids: 28,
    isHighlighted: false,
    location: 'جدة، المملكة العربية السعودية',
    terms: 'تغليف فائق العناية، شحن مؤمن، كسر أي قطعة أثناء الشحن مُعوض بالكامل',
    categoryName: 'الأثاث والديكور',
    sellerName: 'بوتيك سارة للمجوهرات',
    video: {
      filename: 'bohemian_crystal_set.mp4',
      originalName: 'Bohemian Crystal Glass Set Showcase.mp4',
      mimeType: 'video/mp4',
      size: 38901234, // ~39MB
      duration: 180, // 3 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
    },
    images: [
      {
        filename: 'crystal_set_complete.jpg',
        originalName: 'Complete Crystal Set.jpg',
        mimeType: 'image/jpeg',
        size: 3234567,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
      },
      {
        filename: 'crystal_detail.jpg',
        originalName: 'Crystal Detail.jpg',
        mimeType: 'image/jpeg',
        size: 2456789,
        imageUrl: 'https://images.unsplash.com/photo-1565894781832-0ec05f7bb4a5?w=800&h=600&fit=crop'
      },
      {
        filename: 'golden_tray.jpg',
        originalName: 'Golden Serving Tray.jpg',
        mimeType: 'image/jpeg',
        size: 1876543,
        imageUrl: 'https://images.unsplash.com/photo-1571291012062-9b8d1c532c69?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    title: 'حذاء رياضي نايكي اير جوردان 1 - إصدار محدود أحمر وأسود',
    description: 'حذاء رياضي نايكي اير جوردان 1 من الإصدار المحدود باللون الأحمر والأسود، مقاس 42 أوروبي. الحذاء جديد تماماً في علبته الأصلية ولم يُلبس مطلقاً، جميع الملصقات والأوراق الأصلية موجودة. هذا الطراز الكلاسيكي يُعتبر من أشهر أحذية كرة السلة في التاريخ ومن القطع المرغوبة جداً بين هواة الجمع. التصميم الأصلي من عام 1985 مع تحديثات عصرية في الخامات والراحة.',
    shortDescription: 'نايكي اير جوردان 1 - إصدار محدود - أحمر وأسود - جديد',
    startingPrice: 1200,
    currentPrice: 1950,
    minimumBid: 50,
    buyNowPrice: 2800,
    status: 'APPROVED',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // Starts in 6 hours
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // Ends in 18 hours
    duration: 720, // 12 hours
    viewCount: 445,
    participantCount: 0,
    totalBids: 0,
    isHighlighted: false,
    location: 'الرياض، المملكة العربية السعودية',
    terms: 'الحذاء أصلي 100%، فاتورة الشراء متوفرة، إرجاع خلال يومين إذا لم يطابق الوصف',
    categoryName: 'الرياضة واللياقة',
    sellerName: 'معرض الغامدي للسيارات الكلاسيكية',
    video: {
      filename: 'jordan_1_bred.mp4',
      originalName: 'Air Jordan 1 Bred Limited Edition.mp4',
      mimeType: 'video/mp4',
      size: 29876543, // ~30MB
      duration: 150, // 2.5 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    },
    images: [
      {
        filename: 'jordan_box.jpg',
        originalName: 'Jordan 1 Box.jpg',
        mimeType: 'image/jpeg',
        size: 2234567,
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=600&fit=crop'
      },
      {
        filename: 'jordan_side_view.jpg',
        originalName: 'Side View.jpg',
        mimeType: 'image/jpeg',
        size: 2987654,
        imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=600&fit=crop'
      },
      {
        filename: 'jordan_sole.jpg',
        originalName: 'Sole Detail.jpg',
        mimeType: 'image/jpeg',
        size: 1765432,
        imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000009',
    title: 'عملة ذهبية سعودية نادرة - الملك عبدالعزيز 1950',
    description: 'عملة ذهبية سعودية نادرة جداً من عهد الملك عبدالعزيز آل سعود رحمه الله، مسكوكة عام 1370هـ - 1950م. العملة من الذهب الخالص عيار 21 قيراط، وزن 8.5 جرام، في حالة ممتازة مع وضوح تام للكتابات والنقوش. هذه العملة التاريخية النادرة تُعتبر من أندر العملات السعودية وتحمل قيمة تاريخية ونقدية عالية جداً. مُحفوظة في كبسولة حماية شفافة وتأتي مع شهادة أصالة.',
    shortDescription: 'عملة ذهبية سعودية نادرة - الملك عبدالعزيز - 1950',
    startingPrice: 18000,
    currentPrice: 31500,
    minimumBid: 500,
    buyNowPrice: 50000,
    status: 'LIVE',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // Started 4 hours ago
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // Ends in 8 hours
    duration: 720, // 12 hours
    viewCount: 1156,
    participantCount: 22,
    totalBids: 67,
    isHighlighted: true,
    location: 'الرياض، المملكة العربية السعودية',
    terms: 'العملة أصلية ومضمونة، شهادة أصالة من خبير معتمد، لا إرجاع للعملات التاريخية',
    categoryName: 'متنوعات',
    sellerName: 'مجموعة العتيبي للتحف',
    video: {
      filename: 'saudi_gold_coin_1950.mp4',
      originalName: 'Saudi Gold Coin King Abdulaziz 1950.mp4',
      mimeType: 'video/mp4',
      size: 21345678, // ~21MB
      duration: 90, // 1.5 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    images: [
      {
        filename: 'gold_coin_front.jpg',
        originalName: 'Gold Coin Front.jpg',
        mimeType: 'image/jpeg',
        size: 1987654,
        imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=600&fit=crop'
      },
      {
        filename: 'gold_coin_back.jpg',
        originalName: 'Gold Coin Back.jpg',
        mimeType: 'image/jpeg',
        size: 2123456,
        imageUrl: 'https://images.unsplash.com/photo-1611095786146-8c635d1efee1?w=800&h=600&fit=crop'
      },
      {
        filename: 'authenticity_certificate.jpg',
        originalName: 'Authenticity Certificate.jpg',
        mimeType: 'image/jpeg',
        size: 1654321,
        imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000010',
    title: 'بدلة رجالية إيطالية - أرماني كلاسيك - صوف كشمير',
    description: 'بدلة رجالية فاخرة من دار أرماني الإيطالية، مصنوعة من أجود أنواع الصوف المخلوط بالكشمير. البدلة بلون رمادي داكن كلاسيكي، مقاس 50 أوروبي (Large)، قصة كلاسيكية أنيقة مناسبة للمناسبات الرسمية والأعراس. تتكون من جاكيت وبنطلون، مبطنة بالحرير الطبيعي، الأزرار من عرق اللؤلؤ الطبيعي. البدلة جديدة تماماً مع العلامات الأصلية وحامل البدلة الخشبي الفاخر.',
    shortDescription: 'بدلة أرماني إيطالية - صوف كشمير - رمادي كلاسيك',
    startingPrice: 3200,
    currentPrice: 3200,
    minimumBid: 100,
    buyNowPrice: 5500,
    status: 'DRAFT',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Starts in 24 hours
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Ends in 48 hours
    duration: 1440, // 24 hours
    viewCount: 234,
    participantCount: 0,
    totalBids: 0,
    isHighlighted: false,
    location: 'جدة، المملكة العربية السعودية',
    terms: 'البدلة جديدة تماماً، إمكانية التعديل على القياسات، إرجاع خلال 5 أيام',
    categoryName: 'متنوعات',
    sellerName: 'بوتيك سارة للمجوهرات',
    video: {
      filename: 'armani_suit_classic.mp4',
      originalName: 'Armani Classic Wool Cashmere Suit.mp4',
      mimeType: 'video/mp4',
      size: 26789123, // ~27MB
      duration: 120, // 2 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
    },
    images: [
      {
        filename: 'armani_suit_full.jpg',
        originalName: 'Armani Suit Full View.jpg',
        mimeType: 'image/jpeg',
        size: 2876543,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
      },
      {
        filename: 'suit_fabric_detail.jpg',
        originalName: 'Fabric Detail.jpg',
        mimeType: 'image/jpeg',
        size: 1765432,
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop'
      },
      {
        filename: 'armani_label.jpg',
        originalName: 'Armani Label.jpg',
        mimeType: 'image/jpeg',
        size: 987654,
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000011',
    title: 'جهاز بلايستيشن 5 - نسخة الديجيتال - لونين أبيض وأسود',
    description: 'جهاز سوني بلايستيشن 5 نسخة الديجيتال الجديدة، يأتي بلونين أبيض وأسود حسب الطلب. الجهاز جديد في علبته الأصلية المُختومة، يحتوي على كامل الملحقات الأصلية: الجهاز، يد التحكم DualSense، كابل HDMI، كابل الطاقة، كابل USB، حامل الجهاز. الضمان ساري لمدة سنتين من سوني الشرق الأوسط. مع لعبة Spider-Man Miles Morales مجاناً كهدية.',
    shortDescription: 'بلايستيشن 5 ديجيتال - جديد مختوم - ضمان سنتين',
    startingPrice: 2100,
    currentPrice: 2100,
    minimumBid: 50,
    buyNowPrice: 2800,
    status: 'CANCELLED',
    startTime: new Date(Date.now() - 72 * 60 * 60 * 1000), // Started 72 hours ago
    endTime: new Date(Date.now() - 48 * 60 * 60 * 1000), // Was supposed to end 48 hours ago
    duration: 1440, // 24 hours
    viewCount: 1879,
    participantCount: 0,
    totalBids: 0,
    isHighlighted: false,
    location: 'الرياض، المملكة العربية السعودية',
    terms: 'الجهاز أصلي ومختوم، ضمان رسمي، إرجاع خلال 7 أيام إذا كان مُستخدم',
    categoryName: 'الإلكترونيات',
    sellerName: 'معرض الغامدي للسيارات الكلاسيكية',
    video: {
      filename: 'ps5_digital_unboxing.mp4',
      originalName: 'PlayStation 5 Digital Edition Unboxing.mp4',
      mimeType: 'video/mp4',
      size: 45678912, // ~46MB
      duration: 300, // 5 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    images: [
      {
        filename: 'ps5_console_white.jpg',
        originalName: 'PS5 Console White.jpg',
        mimeType: 'image/jpeg',
        size: 3123456,
        imageUrl: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&h=600&fit=crop'
      },
      {
        filename: 'ps5_controller.jpg',
        originalName: 'DualSense Controller.jpg',
        mimeType: 'image/jpeg',
        size: 2234567,
        imageUrl: 'https://images.unsplash.com/photo-1588481253088-efe5b00947a3?w=800&h=600&fit=crop'
      },
      {
        filename: 'ps5_box_sealed.jpg',
        originalName: 'Sealed Box.jpg',
        mimeType: 'image/jpeg',
        size: 1987654,
        imageUrl: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=800&h=600&fit=crop'
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000012',
    title: 'ثريا كريستال كلاسيكية - 18 ذراع - برونز وذهب',
    description: 'ثريا كريستال كلاسيكية فاخرة من 18 ذراع، إطار من البرونز المطلي بالذهب عيار 24 قيراط مع قطع الكريستال الأصلية المقطوعة يدوياً. الثريا بقطر 120 سم وارتفاع 80 سم، مناسبة للقصور والفلل الفاخرة والصالات الكبيرة. تتضمن 18 مصباح LED قابل للتخفيت، جهاز تحكم عن بُعد، وشهادة ضمان لمدة 5 سنوات. الثريا جديدة في صندوقها الأصلي مع دليل التركيب باللغة العربية.',
    shortDescription: 'ثريا كريستال كلاسيكية - 18 ذراع - برونز مذهب',
    startingPrice: 8500,
    currentPrice: 8500,
    minimumBid: 250,
    buyNowPrice: 15000,
    status: 'SUSPENDED',
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // Started 12 hours ago
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // Ends in 12 hours
    duration: 1440, // 24 hours
    viewCount: 623,
    participantCount: 8,
    totalBids: 12,
    isHighlighted: false,
    location: 'جدة، المملكة العربية السعودية',
    terms: 'التركيب مجاني في جدة والرياض، ضمان 5 سنوات على المصابيح، شحن مؤمن',
    categoryName: 'الأثاث والديكور',
    sellerName: 'جاليري فاطمة للفنون',
    video: {
      filename: 'crystal_chandelier_18arms.mp4',
      originalName: 'Crystal Chandelier 18 Arms Bronze Gold.mp4',
      mimeType: 'video/mp4',
      size: 52345678, // ~52MB
      duration: 240, // 4 minutes
      thumbnailUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=450&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    images: [
      {
        filename: 'chandelier_full_view.jpg',
        originalName: 'Chandelier Full View.jpg',
        mimeType: 'image/jpeg',
        size: 3567890,
        imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop'
      },
      {
        filename: 'crystal_detail.jpg',
        originalName: 'Crystal Detail Close-up.jpg',
        mimeType: 'image/jpeg',
        size: 2789123,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
      },
      {
        filename: 'bronze_frame.jpg',
        originalName: 'Bronze Gold Frame.jpg',
        mimeType: 'image/jpeg',
        size: 2123456,
        imageUrl: 'https://images.unsplash.com/photo-1571291012062-9b8d1c532c69?w=800&h=600&fit=crop'
      }
    ]
  }
];

module.exports = { auctions };