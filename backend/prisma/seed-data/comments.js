const comments = [
  // Comments for Rolex Daytona (LIVE auction)
  {
    content: 'ساعة رائعة جداً! الصور واضحة والوصف مفصل. هل يمكن معاينة الساعة قبل المزايدة؟',
    auctionTitle: 'ساعة رولكس ديتونا',
    commenterUsername: 'khalid_bidder',
    isActive: true,
    likesCount: 5
  },
  {
    content: 'السعر مناسب للقطعة النادرة. أتمنى التوفيق لجميع المزايدين 🕐',
    auctionTitle: 'ساعة رولكس ديتونا',
    commenterUsername: 'nour_collector',
    isActive: true,
    likesCount: 3
  },
  {
    content: 'هل الضمان قابل للنقل؟ وما هي مدة الصيانة الأخيرة؟',
    auctionTitle: 'ساعة رولكس ديتونا',
    commenterUsername: 'omar_investor',
    isActive: true,
    likesCount: 2
  },
  {
    content: 'شكل الساعة في الفيديو ممتاز! واضح أنها محافظ عليها بعناية فائقة',
    auctionTitle: 'ساعة رولكس ديتونا',
    commenterUsername: 'abdullah_tech',
    isActive: true,
    likesCount: 4
  },
  {
    content: 'المزاد مثير! أسعار عالية لكن تستحق القطعة كل ريال 💰',
    auctionTitle: 'ساعة رولكس ديتونا',
    commenterUsername: 'yasir_sports',
    isActive: true,
    likesCount: 6
  },

  // Comments for Porsche 911 (LIVE auction)
  {
    content: 'سيارة الأحلام! البورش 911 كلاسيكية حقاً. الصبغة الزرقاء رائعة 🚗',
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    commenterUsername: 'omar_investor',
    isActive: true,
    likesCount: 8
  },
  {
    content: 'هل يمكن فحص السيارة من قبل خبير مستقل؟ السعر عالي جداً',
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    commenterUsername: 'khalid_bidder',
    isActive: true,
    likesCount: 3
  },
  {
    content: 'المحرك يبدو في حالة ممتازة من الفيديو. كم المسافة المقطوعة؟',
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    commenterUsername: 'abdullah_tech',
    isActive: true,
    likesCount: 4
  },
  {
    content: 'السيارات الكلاسيكية استثمار ممتاز! هذه ستزيد قيمتها بالمستقبل',
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    commenterUsername: 'nour_collector',
    isActive: true,
    likesCount: 7
  },
  {
    content: 'الداخلية جلد أصلي؟ تبدو في حالة ممتازة في الصور',
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    commenterUsername: 'yasir_sports',
    isActive: true,
    likesCount: 2
  },

  // Comments for Desert Sunset Painting (APPROVED auction)
  {
    content: 'لوحة جميلة جداً! الألوان دافئة وتعكس جمال الصحراء العربية 🎨',
    auctionTitle: 'لوحة فنية زيتية أصلية',
    commenterUsername: 'nour_collector',
    isActive: true,
    likesCount: 6
  },
  {
    content: 'الفنان محمد الفهيد له أعمال رائعة. هذه إضافة ممتازة لأي مجموعة فنية',
    auctionTitle: 'لوحة فنية زيتية أصلية',
    commenterUsername: 'maha_furniture',
    isActive: true,
    likesCount: 4
  },
  {
    content: 'السعر معقول للوحة أصلية بهذا الحجم والجودة',
    auctionTitle: 'لوحة فنية زيتية أصلية',
    commenterUsername: 'rania_books',
    isActive: true,
    likesCount: 3
  },

  // Comments for iPhone 14 Pro Max (PENDING auction)
  {
    content: 'الجهاز لا يزال في ضمان أبل؟ وما سبب البيع؟',
    auctionTitle: 'آيفون 14 برو ماكس',
    commenterUsername: 'abdullah_tech',
    isActive: true,
    likesCount: 2
  },
  {
    content: 'سعة تيرابايت واحد مناسبة للمحترفين. اللون الذهبي أنيق 📱',
    auctionTitle: 'آيفون 14 برو ماكس',
    commenterUsername: 'yasir_sports',
    isActive: true,
    likesCount: 3
  },

  // Comments for Quran Manuscript (LIVE auction)
  {
    content: 'مخطوطة نادرة وقيمة تاريخياً. الخط الذهبي جميل جداً ✨',
    auctionTitle: 'مخطوطة قرآنية نادرة',
    commenterUsername: 'rania_books',
    isActive: true,
    likesCount: 9
  },
  {
    content: 'شهادة الأصالة من أي جهة معتمدة؟ المخطوطات تحتاج توثيق دقيق',
    auctionTitle: 'مخطوطة قرآنية نادرة',
    commenterUsername: 'khalid_bidder',
    isActive: true,
    likesCount: 5
  },
  {
    content: 'كنز حقيقي! المخطوطات القرآنية القديمة نادرة جداً في المزادات',
    auctionTitle: 'مخطوطة قرآنية نادرة',
    commenterUsername: 'omar_investor',
    isActive: true,
    likesCount: 7
  },
  {
    content: 'الزخرفة الإسلامية والإضاءة في المخطوطة فنية رائعة 🕌',
    auctionTitle: 'مخطوطة قرآنية نادرة',
    commenterUsername: 'nour_collector',
    isActive: true,
    likesCount: 6
  },

  // Comments for Saudi Gold Coin (LIVE auction)
  {
    content: 'عملة تاريخية نادرة! من عهد الملك عبدالعزيز رحمه الله 🪙',
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    commenterUsername: 'khalid_bidder',
    isActive: true,
    likesCount: 8
  },
  {
    content: 'الذهب عيار كم؟ والوزن دقيق؟ هذه تفاصيل مهمة للمستثمرين',
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    commenterUsername: 'omar_investor',
    isActive: true,
    likesCount: 4
  },
  {
    content: 'قطعة تراثية رائعة! تمثل تاريخ المملكة العريق',
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    commenterUsername: 'rania_books',
    isActive: true,
    likesCount: 6
  },

  // Comments for Crystal Glass Set (LIVE auction)
  {
    content: 'طقم كريستال رائع! البوهيمي دائماً جودة عالية ✨',
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    commenterUsername: 'maha_furniture',
    isActive: true,
    likesCount: 5
  },
  {
    content: 'الصينية الذهبية تضيف لمسة فاخرة للطقم 🥂',
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    commenterUsername: 'nour_collector',
    isActive: true,
    likesCount: 3
  },
  {
    content: 'كم عدد القطع لكل نوع؟ الوصف يقول 24 قطعة إجمالي',
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    commenterUsername: 'khalid_bidder',
    isActive: true,
    likesCount: 2
  },

  // Comments for Jordan 1 Sneakers (APPROVED auction)
  {
    content: 'حذاء كلاسيكي! الأحمر والأسود من أجمل ألوان الجوردان 👟',
    auctionTitle: 'حذاء رياضي نايكي اير جوردان',
    commenterUsername: 'yasir_sports',
    isActive: true,
    likesCount: 7
  },
  {
    content: 'المقاس متوفر؟ وهل الحذاء أصلي 100%؟',
    auctionTitle: 'حذاء رياضي نايكي اير جوردان',
    commenterUsername: 'abdullah_tech',
    isActive: true,
    likesCount: 3
  },

  // Comments for Mahogany Furniture (ENDED auction)
  {
    content: 'طقم أثاث فاخر! الخشب الماهوجني جودة ممتازة 🪑',
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    commenterUsername: 'maha_furniture',
    isActive: true,
    likesCount: 4
  },
  {
    content: 'الحرير المطرز يضيف قيمة كبيرة للطقم. استثمار ممتاز!',
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    commenterUsername: 'nour_collector',
    isActive: true,
    likesCount: 5
  },
  {
    content: 'مبروك للفائز! سعر ممتاز لطقم بهذه الجودة',
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    commenterUsername: 'khalid_bidder',
    isActive: true,
    likesCount: 6
  },

  // Comments for Armani Suit (DRAFT auction)
  {
    content: 'بدلة أرماني كلاسيكية! القياس مناسب لي. متى سيبدأ المزاد؟ 👔',
    auctionTitle: 'بدلة رجالية إيطالية',
    commenterUsername: 'omar_investor',
    isActive: true,
    likesCount: 2
  },

  // Comments for PlayStation 5 (CANCELLED auction)
  {
    content: 'لماذا تم إلغاء المزاد؟ كنت مهتماً بالجهاز 🎮',
    auctionTitle: 'جهاز بلايستيشن 5',
    commenterUsername: 'abdullah_tech',
    isActive: true,
    likesCount: 4
  },
  {
    content: 'الجهاز كان بسعر مناسب. أتمنى إعادة طرحه قريباً',
    auctionTitle: 'جهاز بلايستيشن 5',
    commenterUsername: 'yasir_sports',
    isActive: true,
    likesCount: 3
  },

  // Comments for Crystal Chandelier (SUSPENDED auction)
  {
    content: 'ثريا رائعة! لماذا تم تعليق المزاد؟ 💎',
    auctionTitle: 'ثريا كريستال كلاسيكية',
    commenterUsername: 'maha_furniture',
    isActive: true,
    likesCount: 3
  },
  {
    content: 'كنت أتابع المزاد بإهتمام. أتمنى حل المشكلة قريباً',
    auctionTitle: 'ثريا كريستال كلاسيكية',
    commenterUsername: 'nour_collector',
    isActive: true,
    likesCount: 2
  }
];

module.exports = { comments };