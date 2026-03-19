const bids = [
  // Bids for Rolex Daytona (LIVE auction)
  {
    amount: 85000,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 87000,
    timestamp: new Date(Date.now() - 110 * 60 * 1000), // 110 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 90000,
    timestamp: new Date(Date.now() - 105 * 60 * 1000), // 105 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 92500,
    timestamp: new Date(Date.now() - 100 * 60 * 1000), // 100 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 95000,
    timestamp: new Date(Date.now() - 95 * 60 * 1000), // 95 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 98000,
    timestamp: new Date(Date.now() - 80 * 60 * 1000), // 80 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 105000,
    timestamp: new Date(Date.now() - 70 * 60 * 1000), // 70 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'abdullah_tech',
    isValid: true,
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)'
  },
  {
    amount: 110000,
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 60 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 115000,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 120000,
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'yasir_sports',
    isValid: true,
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)'
  },
  {
    amount: 125000,
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 130000,
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 135000,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 140000,
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 142000,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    auctionTitle: 'ساعة رولكس ديتونا',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },

  // Bids for Porsche 911 (LIVE auction)
  {
    amount: 125000,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 130000,
    timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000), // 4.5 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 135000,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'abdullah_tech',
    isValid: true,
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)'
  },
  {
    amount: 140000,
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 145000,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'yasir_sports',
    isValid: true,
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)'
  },
  {
    amount: 150000,
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 155000,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 160000,
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'abdullah_tech',
    isValid: true,
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)'
  },
  {
    amount: 165000,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 170000,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 175000,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'yasir_sports',
    isValid: true,
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)'
  },
  {
    amount: 180000,
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 185000,
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 187500,
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    auctionTitle: 'سيارة بورش 911 كلاسيكية',
    bidderUsername: 'abdullah_tech',
    isValid: true,
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)'
  },

  // Bids for Quran Manuscript (LIVE auction)
  {
    amount: 25000,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'rania_books',
    isValid: true,
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 27000,
    timestamp: new Date(Date.now() - 58 * 60 * 1000), // 58 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 30000,
    timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'rania_books',
    isValid: true,
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 32000,
    timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 35000,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 38000,
    timestamp: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 40000,
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'rania_books',
    isValid: true,
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 42000,
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 45000,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    auctionTitle: 'مخطوطة قرآنية نادرة',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },

  // Bids for Saudi Gold Coin (LIVE auction)
  {
    amount: 18000,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 19000,
    timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000), // 3.8 hours ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 20000,
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 21500,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'rania_books',
    isValid: true,
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 23000,
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 25000,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 27000,
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 28500,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 30000,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 31500,
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    auctionTitle: 'عملة ذهبية سعودية نادرة',
    bidderUsername: 'rania_books',
    isValid: true,
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },

  // Bids for Crystal Glass Set (LIVE auction)
  {
    amount: 2800,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    bidderUsername: 'maha_furniture',
    isValid: true,
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 3000,
    timestamp: new Date(Date.now() - 2.8 * 60 * 60 * 1000), // 2.8 hours ago
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 3200,
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 3500,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    bidderUsername: 'maha_furniture',
    isValid: true,
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 3700,
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 4000,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 4200,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    auctionTitle: 'طقم كؤوس كريستال بوهيميا',
    bidderUsername: 'maha_furniture',
    isValid: true,
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },

  // Bids for Mahogany Furniture Set (ENDED auction)
  {
    amount: 15000,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago (start)
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    bidderUsername: 'maha_furniture',
    isValid: true,
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 16000,
    timestamp: new Date(Date.now() - 46 * 60 * 60 * 1000), // 46 hours ago
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    bidderUsername: 'nour_collector',
    isValid: true,
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 17500,
    timestamp: new Date(Date.now() - 44 * 60 * 60 * 1000), // 44 hours ago
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 18500,
    timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000), // 40 hours ago
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    bidderUsername: 'maha_furniture',
    isValid: true,
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    amount: 20000,
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    bidderUsername: 'khalid_bidder',
    isValid: true,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
  },
  {
    amount: 21000,
    timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000), // 32 hours ago
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    bidderUsername: 'omar_investor',
    isValid: true,
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    amount: 22500,
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago (final bid)
    auctionTitle: 'طقم أثاث صالة كلاسيكي',
    bidderUsername: 'maha_furniture',
    isValid: true,
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
];

module.exports = { bids };