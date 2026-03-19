const messages = [
  // Messages between buyers and sellers
  {
    content: 'السلام عليكم، أنا مهتم بساعة الرولكس. هل يمكنني معاينتها قبل المزايدة؟',
    senderUsername: 'khalid_bidder',
    receiverUsername: 'sara_luxury',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'وعليكم السلام ورحمة الله. بالطبع يمكنك المعاينة. يمكن ترتيب موعد في المحل أو في مكان آمن.',
    senderUsername: 'sara_luxury',
    receiverUsername: 'khalid_bidder',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'ممتاز! ما هو أفضل وقت للمعاينة؟ أنا متاح اليوم بعد المغرب.',
    senderUsername: 'khalid_bidder',
    receiverUsername: 'sara_luxury',
    type: 'TEXT',
    isRead: false
  },
  {
    content: 'سأرسل لك موقع المحل على الخاص. المعاينة متاحة من 4 مساءً حتى 8 مساءً.',
    senderUsername: 'sara_luxury',
    receiverUsername: 'khalid_bidder',
    type: 'TEXT',
    isRead: false
  },

  // Messages about Porsche 911
  {
    content: 'مساء الخير أستاذ محمد، السيارة البورش التي في المزاد رائعة! ما هي المسافة المقطوعة بالتحديد؟',
    senderUsername: 'omar_investor',
    receiverUsername: 'mohammed_cars',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'مساء النور أخي عمر. السيارة قطعت 75,000 كم تقريباً، وتم تجديدها بالكامل. جميع القطع أصلية أو محدثة بقطع أصلية.',
    senderUsername: 'mohammed_cars',
    receiverUsername: 'omar_investor',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'هل تتوفر فواتير الصيانة والتجديد؟ وما هي القطع التي تم تغييرها؟',
    senderUsername: 'omar_investor',
    receiverUsername: 'mohammed_cars',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'نعم، جميع الفواتير متوفرة. تم تجديد المحرك، علبة السرعة، المقاعد، والصبغة. السيارة مثل الجديدة تماماً.',
    senderUsername: 'mohammed_cars',
    receiverUsername: 'omar_investor',
    type: 'TEXT',
    isRead: false
  },

  // Messages about the painting
  {
    content: 'السلام عليكم أستاذة فاطمة، اللوحة رائعة! هل يمكنك إرسال صور إضافية للإطار؟',
    senderUsername: 'nour_collector',
    receiverUsername: 'fatima_art',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'وعليكم السلام. شكراً لاهتمامك! سأرسل صور الإطار الذهبي وزوايا اللوحة المختلفة.',
    senderUsername: 'fatima_art',
    receiverUsername: 'nour_collector',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'شكراً جزيلاً. اللوحة تناسب ديكور منزلي تماماً. سأشارك في المزاد بإذن الله.',
    senderUsername: 'nour_collector',
    receiverUsername: 'fatima_art',
    type: 'TEXT',
    isRead: false
  },

  // Messages about the manuscript
  {
    content: 'بسم الله الرحمن الرحيم. المخطوطة القرآنية نادرة جداً! من أي دار مخطوطات تم اقتناؤها؟',
    senderUsername: 'rania_books',
    receiverUsername: 'ahmed_collector',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'بارك الله فيك أختي رانيا. المخطوطة من مجموعة عائلية عريقة، ولديها تقرير خبير معتمد من دار المخطوطات في الرياض.',
    senderUsername: 'ahmed_collector',
    receiverUsername: 'rania_books',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'جزاك الله خيراً. هل يمكنك إرسال صور شهادة الأصالة؟ أريد التأكد قبل المشاركة في المزاد.',
    senderUsername: 'rania_books',
    receiverUsername: 'ahmed_collector',
    type: 'TEXT',
    isRead: false
  },

  // Messages about the gold coin
  {
    content: 'أهلاً أستاذ أحمد، العملة الذهبية السعودية مثيرة للاهتمام. ما هو تاريخ سكها بالضبط؟',
    senderUsername: 'omar_investor',
    receiverUsername: 'ahmed_collector',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'أهلاً وسهلاً أخي عمر. العملة مسكوكة عام 1370 هجري الموافق 1950 ميلادي، والنقوش واضحة تماماً.',
    senderUsername: 'ahmed_collector',
    receiverUsername: 'omar_investor',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'ممتاز. العملات من هذه الحقبة نادرة. هل هناك عملات مماثلة في مجموعتك؟',
    senderUsername: 'omar_investor',
    receiverUsername: 'ahmed_collector',
    type: 'TEXT',
    isRead: false
  },

  // Messages about crystal glasses
  {
    content: 'مساء الخير، طقم الكؤوس الكريستال جميل جداً! ما هو بلد المنشأ بالتحديد؟',
    senderUsername: 'maha_furniture',
    receiverUsername: 'sara_luxury',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'مساء النور أستاذة مها. الطقم من الكريستال البوهيمي الأصلي من التشيك، صناعة يدوية 100%.',
    senderUsername: 'sara_luxury',
    receiverUsername: 'maha_furniture',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'رائع! هل الصينية الذهبية مطلية بالذهب الحقيقي؟',
    senderUsername: 'maha_furniture',
    receiverUsername: 'sara_luxury',
    type: 'TEXT',
    isRead: false
  },

  // Messages about furniture set
  {
    content: 'السلام عليكم، طقم الأثاث الماهوجني رائع! هل يمكن فكه وإعادة تركيبه بسهولة؟',
    senderUsername: 'maha_furniture',
    receiverUsername: 'ahmed_collector',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'وعليكم السلام. نعم الطقم قابل للفك والتركيب، وسنتولى عملية النقل والتركيب مجاناً في الرياض.',
    senderUsername: 'ahmed_collector',
    receiverUsername: 'maha_furniture',
    type: 'TEXT',
    isRead: false
  },

  // Messages about Jordan sneakers
  {
    content: 'السلام عليكم، حذاء الجوردان رائع! هل هو مقاس 42 أوروبي أم أمريكي؟',
    senderUsername: 'yasir_sports',
    receiverUsername: 'mohammed_cars',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'وعليكم السلام أخي ياسر. المقاس 42 أوروبي، وهو يعادل 9 أمريكي تقريباً.',
    senderUsername: 'mohammed_cars',
    receiverUsername: 'yasir_sports',
    type: 'TEXT',
    isRead: false
  },

  // Messages between users discussing auctions
  {
    content: 'هلا أخي خالد، شايف مزاد الرولكس؟ الأسعار عالية جداً!',
    senderUsername: 'abdullah_tech',
    receiverUsername: 'khalid_bidder',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'أهلاً عبدالله! نعم أتابعه، لكن القطعة نادرة وتستحق. أنت مشارك؟',
    senderUsername: 'khalid_bidder',
    receiverUsername: 'abdullah_tech',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'لا، خارج ميزانيتي للأسف 😅 لكن أتابع للمتعة. التنافس مثير!',
    senderUsername: 'abdullah_tech',
    receiverUsername: 'khalid_bidder',
    type: 'TEXT',
    isRead: false
  },

  // Messages with admin/support
  {
    content: 'السلام عليكم، أريد الاستفسار عن آلية الدفع بعد الفوز في المزاد.',
    senderUsername: 'nour_collector',
    receiverUsername: 'admin',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'وعليكم السلام ورحمة الله. بعد الفوز يتم التواصل معك خلال 24 ساعة لترتيب الدفع والاستلام.',
    senderUsername: 'admin',
    receiverUsername: 'nour_collector',
    type: 'TEXT',
    isRead: false
  },

  // More casual messages between users
  {
    content: 'مبروك فوزك بطقم الأثاث أختي مها! 🎉',
    senderUsername: 'nour_collector',
    receiverUsername: 'maha_furniture',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'الله يبارك فيك نور! كان تنافس قوي لكن الحمد لله. الطقم سيكون إضافة رائعة للصالة.',
    senderUsername: 'maha_furniture',
    receiverUsername: 'nour_collector',
    type: 'TEXT',
    isRead: false
  },

  // Technical support messages
  {
    content: 'أواجه مشكلة في رفع الفيديو للمزاد. الحجم كبير، ما هو الحد الأقصى المسموح؟',
    senderUsername: 'fatima_art',
    receiverUsername: 'admin',
    type: 'TEXT',
    isRead: true
  },
  {
    content: 'الحد الأقصى 500 ميجابايت. يمكنك ضغط الفيديو أو تقسيمه لعدة أجزاء. نحن هنا لمساعدتك.',
    senderUsername: 'admin',
    receiverUsername: 'fatima_art',
    type: 'TEXT',
    isRead: false
  }
];

module.exports = { messages };