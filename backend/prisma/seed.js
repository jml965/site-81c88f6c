const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { users } = require('./seed-data/users');
const { auctions } = require('./seed-data/auctions');
const { bids } = require('./seed-data/bids');
const { comments } = require('./seed-data/comments');
const { messages } = require('./seed-data/messages');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء زراعة البيانات التجريبية...');

  try {
    // Clear existing data
    await clearDatabase();
    
    // Seed data in order
    await seedSettings();
    await seedCategories();
    await seedUsers();
    await seedAuctions();
    await seedBids();
    await seedComments();
    await seedMessages();
    await seedSocialFeatures();
    await seedNotifications();
    await seedReports();

    console.log('✅ تم زراعة البيانات التجريبية بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في زراعة البيانات:', error);
    throw error;
  }
}

async function clearDatabase() {
  console.log('🗑️ تنظيف قاعدة البيانات...');
  
  const deleteOrder = [
    'AuditLog',
    'Report',
    'ReadReceipt',
    'Notification',
    'Message',
    'ConversationParticipant',
    'Conversation',
    'Follow',
    'AuctionLike',
    'CommentLike',
    'Comment',
    'TimelineEvent',
    'Bid',
    'AuctionImage',
    'AuctionVideo',
    'Auction',
    'Seller',
    'Profile',
    'Category',
    'Setting',
    'User'
  ];

  for (const model of deleteOrder) {
    try {
      await prisma[model.charAt(0).toLowerCase() + model.slice(1)].deleteMany({});
    } catch (error) {
      console.log(`تخطي حذف ${model}:`, error.message);
    }
  }
}

async function seedSettings() {
  console.log('⚙️ زراعة الإعدادات...');

  const settings = [
    {
      key: 'SITE_NAME',
      value: 'مزاد موشن',
      type: 'string',
      category: 'general',
      isPublic: true
    },
    {
      key: 'SITE_DESCRIPTION',
      value: 'منصة المزادات الفيديو الأولى في المملكة العربية السعودية',
      type: 'string',
      category: 'general',
      isPublic: true
    },
    {
      key: 'MIN_BID_INCREMENT',
      value: '10',
      type: 'number',
      category: 'auction',
      isPublic: true
    },
    {
      key: 'AUCTION_EXTENSION_TIME',
      value: '300',
      type: 'number',
      category: 'auction',
      isPublic: false
    },
    {
      key: 'SELLER_COMMISSION',
      value: '5',
      type: 'number',
      category: 'finance',
      isPublic: false
    },
    {
      key: 'MAX_VIDEO_SIZE_MB',
      value: '500',
      type: 'number',
      category: 'media',
      isPublic: true
    },
    {
      key: 'SUPPORTED_VIDEO_FORMATS',
      value: 'mp4,mov,avi',
      type: 'string',
      category: 'media',
      isPublic: true
    }
  ];

  await prisma.setting.createMany({ data: settings });
  console.log(`✓ تم إنشاء ${settings.length} إعداد`);
}

async function seedCategories() {
  console.log('📂 زراعة التصنيفات...');

  const categories = [
    {
      nameAr: 'السيارات والمركبات',
      nameEn: 'Cars & Vehicles',
      description: 'سيارات، دراجات نارية، قطع غيار',
      icon: '🚗',
      order: 1
    },
    {
      nameAr: 'المجوهرات والساعات',
      nameEn: 'Jewelry & Watches',
      description: 'مجوهرات ثمينة، ساعات فاخرة',
      icon: '💎',
      order: 2
    },
    {
      nameAr: 'الأثاث والديكور',
      nameEn: 'Furniture & Decor',
      description: 'أثاث منزلي، تحف، ديكورات',
      icon: '🛋️',
      order: 3
    },
    {
      nameAr: 'الإلكترونيات',
      nameEn: 'Electronics',
      description: 'هواتف، حاسوب، أجهزة ذكية',
      icon: '📱',
      order: 4
    },
    {
      nameAr: 'الفنون واللوحات',
      nameEn: 'Arts & Paintings',
      description: 'لوحات فنية، منحوتات، تحف',
      icon: '🎨',
      order: 5
    },
    {
      nameAr: 'العقارات',
      nameEn: 'Real Estate',
      description: 'منازل، أراضي، عقارات تجارية',
      icon: '🏠',
      order: 6
    },
    {
      nameAr: 'الكتب والمخطوطات',
      nameEn: 'Books & Manuscripts',
      description: 'كتب نادرة، مخطوطات تاريخية',
      icon: '📚',
      order: 7
    },
    {
      nameAr: 'الرياضة واللياقة',
      nameEn: 'Sports & Fitness',
      description: 'معدات رياضية، ملابس رياضية',
      icon: '⚽',
      order: 8
    },
    {
      nameAr: 'متنوعات',
      nameEn: 'Miscellaneous',
      description: 'أشياء متنوعة وفريدة',
      icon: '🎁',
      order: 9
    }
  ];

  await prisma.category.createMany({ data: categories });
  console.log(`✓ تم إنشاء ${categories.length} تصنيف`);
}

async function seedUsers() {
  console.log('👥 زراعة المستخدمين...');

  for (const userData of users) {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        role: userData.role,
        isActive: userData.isActive
      }
    });

    // Create profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        firstName: userData.profile.firstName,
        lastName: userData.profile.lastName,
        avatar: userData.profile.avatar,
        phoneNumber: userData.profile.phoneNumber,
        address: userData.profile.address,
        city: userData.profile.city,
        country: userData.profile.country,
        bio: userData.profile.bio,
        isVerified: userData.profile.isVerified
      }
    });

    // Create seller profile if seller
    if (userData.seller) {
      await prisma.seller.create({
        data: {
          userId: user.id,
          businessName: userData.seller.businessName,
          businessLicense: userData.seller.businessLicense,
          commission: userData.seller.commission,
          rating: userData.seller.rating,
          totalSales: userData.seller.totalSales,
          isVerified: userData.seller.isVerified
        }
      });
    }
  }

  console.log(`✓ تم إنشاء ${users.length} مستخدم`);
}

async function seedAuctions() {
  console.log('🏛️ زراعة المزادات...');

  const categories = await prisma.category.findMany();
  const sellers = await prisma.seller.findMany();

  for (const auctionData of auctions) {
    const category = categories.find(c => c.nameAr === auctionData.categoryName);
    const seller = sellers.find(s => s.businessName === auctionData.sellerName);

    if (!category || !seller) {
      console.log(`تخطي المزاد ${auctionData.title} - لا يوجد تصنيف أو بائع`);
      continue;
    }

    // Create auction
    const auction = await prisma.auction.create({
      data: {
        id: auctionData.id,
        title: auctionData.title,
        description: auctionData.description,
        shortDescription: auctionData.shortDescription,
        startingPrice: auctionData.startingPrice,
        currentPrice: auctionData.currentPrice,
        minimumBid: auctionData.minimumBid,
        buyNowPrice: auctionData.buyNowPrice,
        status: auctionData.status,
        startTime: new Date(auctionData.startTime),
        endTime: new Date(auctionData.endTime),
        duration: auctionData.duration,
        viewCount: auctionData.viewCount,
        participantCount: auctionData.participantCount,
        totalBids: auctionData.totalBids,
        isHighlighted: auctionData.isHighlighted,
        location: auctionData.location,
        terms: auctionData.terms,
        sellerId: seller.id,
        categoryId: category.id
      }
    });

    // Create video
    if (auctionData.video) {
      await prisma.auctionVideo.create({
        data: {
          auctionId: auction.id,
          filename: auctionData.video.filename,
          originalName: auctionData.video.originalName,
          mimeType: auctionData.video.mimeType,
          size: auctionData.video.size,
          duration: auctionData.video.duration,
          thumbnailUrl: auctionData.video.thumbnailUrl,
          videoUrl: auctionData.video.videoUrl,
          isProcessed: true
        }
      });
    }

    // Create images
    if (auctionData.images && auctionData.images.length > 0) {
      await prisma.auctionImage.createMany({
        data: auctionData.images.map((img, index) => ({
          auctionId: auction.id,
          filename: img.filename,
          originalName: img.originalName,
          mimeType: img.mimeType,
          size: img.size,
          imageUrl: img.imageUrl,
          order: index,
          isMain: index === 0
        }))
      });
    }

    // Create timeline events
    await prisma.timelineEvent.create({
      data: {
        auctionId: auction.id,
        type: 'AUCTION_STARTED',
        timestamp: new Date(auctionData.startTime),
        data: {
          startingPrice: auctionData.startingPrice,
          duration: auctionData.duration
        }
      }
    });
  }

  console.log(`✓ تم إنشاء ${auctions.length} مزاد`);
}

async function seedBids() {
  console.log('💰 زراعة المزايدات...');

  const auctionsFromDb = await prisma.auction.findMany({
    include: { seller: { include: { user: true } } }
  });
  const users = await prisma.user.findMany({ where: { role: 'USER' } });

  for (const bidData of bids) {
    const auction = auctionsFromDb.find(a => a.title.includes(bidData.auctionTitle));
    const bidder = users.find(u => u.username === bidData.bidderUsername);

    if (!auction || !bidder) {
      console.log(`تخطي مزايدة ${bidData.amount} - لا يوجد مزاد أو مزايد`);
      continue;
    }

    // Don't allow seller to bid on their own auction
    if (bidder.id === auction.seller.userId) {
      continue;
    }

    await prisma.bid.create({
      data: {
        amount: bidData.amount,
        timestamp: new Date(bidData.timestamp),
        userId: bidder.id,
        auctionId: auction.id,
        isValid: bidData.isValid,
        ipAddress: bidData.ipAddress,
        userAgent: bidData.userAgent
      }
    });

    // Update auction current price
    if (bidData.amount > auction.currentPrice) {
      await prisma.auction.update({
        where: { id: auction.id },
        data: {
          currentPrice: bidData.amount,
          totalBids: { increment: 1 }
        }
      });

      // Create timeline event
      await prisma.timelineEvent.create({
        data: {
          auctionId: auction.id,
          type: 'BID_PLACED',
          timestamp: new Date(bidData.timestamp),
          data: {
            bidAmount: bidData.amount,
            bidderId: bidder.id,
            bidderUsername: bidder.username
          }
        }
      });
    }
  }

  console.log(`✓ تم إنشاء ${bids.length} مزايدة`);
}

async function seedComments() {
  console.log('💬 زراعة التعليقات...');

  const auctionsFromDb = await prisma.auction.findMany();
  const users = await prisma.user.findMany();

  for (const commentData of comments) {
    const auction = auctionsFromDb.find(a => a.title.includes(commentData.auctionTitle));
    const commenter = users.find(u => u.username === commentData.commenterUsername);

    if (!auction || !commenter) {
      console.log(`تخطي تعليق - لا يوجد مزاد أو معلق`);
      continue;
    }

    const comment = await prisma.comment.create({
      data: {
        content: commentData.content,
        userId: commenter.id,
        auctionId: auction.id,
        isActive: commentData.isActive
      }
    });

    // Add likes to comment
    if (commentData.likesCount > 0) {
      const likers = users.slice(0, Math.min(commentData.likesCount, users.length));
      for (const liker of likers) {
        if (liker.id !== commenter.id) {
          await prisma.commentLike.create({
            data: {
              userId: liker.id,
              commentId: comment.id
            }
          });
        }
      }
    }
  }

  console.log(`✓ تم إنشاء ${comments.length} تعليق`);
}

async function seedMessages() {
  console.log('📨 زراعة الرسائل...');

  const users = await prisma.user.findMany();

  for (const messageData of messages) {
    const sender = users.find(u => u.username === messageData.senderUsername);
    const receiver = users.find(u => u.username === messageData.receiverUsername);

    if (!sender || !receiver) {
      console.log(`تخطي رسالة - لا يوجد مرسل أو مستقبل`);
      continue;
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            OR: [
              { userId: sender.id },
              { userId: receiver.id }
            ]
          }
        },
        type: 'PRIVATE'
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          type: 'PRIVATE',
          isActive: true
        }
      });

      // Add participants
      await prisma.conversationParticipant.createMany({
        data: [
          {
            conversationId: conversation.id,
            userId: sender.id,
            role: 'MEMBER'
          },
          {
            conversationId: conversation.id,
            userId: receiver.id,
            role: 'MEMBER'
          }
        ]
      });
    }

    // Create message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: sender.id,
        receiverId: receiver.id,
        content: messageData.content,
        type: messageData.type,
        isRead: messageData.isRead
      }
    });

    // Update conversation last message
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: messageData.content,
        lastMessageAt: new Date()
      }
    });
  }

  console.log(`✓ تم إنشاء ${messages.length} رسالة`);
}

async function seedSocialFeatures() {
  console.log('❤️ زراعة الإعجابات والمتابعات...');

  const auctions = await prisma.auction.findMany();
  const sellers = await prisma.seller.findMany();
  const users = await prisma.user.findMany({ where: { role: 'USER' } });

  // Create auction likes
  for (const auction of auctions.slice(0, 8)) {
    const likers = users.slice(0, Math.floor(Math.random() * 5) + 1);
    for (const liker of likers) {
      await prisma.auctionLike.create({
        data: {
          userId: liker.id,
          auctionId: auction.id
        }
      });
    }
  }

  // Create follows
  for (const user of users.slice(0, 6)) {
    // Follow some auctions
    const auctionsToFollow = auctions.slice(0, 3);
    for (const auction of auctionsToFollow) {
      await prisma.follow.create({
        data: {
          userId: user.id,
          targetType: 'AUCTION',
          targetId: auction.id
        }
      });
    }

    // Follow some sellers
    const sellersToFollow = sellers.slice(0, 2);
    for (const seller of sellersToFollow) {
      await prisma.follow.create({
        data: {
          userId: user.id,
          targetType: 'SELLER',
          targetId: seller.id
        }
      });
    }
  }

  console.log('✓ تم إنشاء الإعجابات والمتابعات');
}

async function seedNotifications() {
  console.log('🔔 زراعة الإشعارات...');

  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  const auctions = await prisma.auction.findMany();

  const notificationTypes = [
    {
      type: 'AUCTION_STARTED',
      title: 'بدء مزاد جديد',
      message: 'بدأ مزاد جديد قد يهمك - {auctionTitle}',
      actionUrl: '/auctions/{auctionId}'
    },
    {
      type: 'BID_OUTBID',
      title: 'تم تجاوز مزايدتك',
      message: 'تم تجاوز مزايدتك في مزاد {auctionTitle}',
      actionUrl: '/auctions/{auctionId}'
    },
    {
      type: 'AUCTION_ENDING',
      title: 'قرب انتهاء المزاد',
      message: 'سينتهي مزاد {auctionTitle} خلال 5 دقائق',
      actionUrl: '/auctions/{auctionId}'
    },
    {
      type: 'MESSAGE_RECEIVED',
      title: 'رسالة جديدة',
      message: 'وصلتك رسالة جديدة من {senderName}',
      actionUrl: '/messages'
    }
  ];

  for (const user of users.slice(0, 5)) {
    for (const notifType of notificationTypes) {
      const auction = auctions[Math.floor(Math.random() * auctions.length)];
      
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: notifType.type,
          title: notifType.title,
          message: notifType.message.replace('{auctionTitle}', auction.title),
          actionUrl: notifType.actionUrl.replace('{auctionId}', auction.id),
          auctionId: auction.id,
          isRead: Math.random() > 0.7,
          data: {
            auctionId: auction.id,
            auctionTitle: auction.title
          }
        }
      });
    }
  }

  console.log('✓ تم إنشاء الإشعارات');
}

async function seedReports() {
  console.log('🚨 زراعة البلاغات...');

  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  const auctions = await prisma.auction.findMany();
  const comments = await prisma.comment.findMany();

  const reports = [
    {
      targetType: 'AUCTION',
      reason: 'FAKE_AUCTION',
      description: 'هذا المزاد يبدو مشكوك فيه، الصور غير واضحة والوصف مضلل',
      status: 'PENDING'
    },
    {
      targetType: 'COMMENT',
      reason: 'INAPPROPRIATE_CONTENT',
      description: 'تعليق غير لائق ومسيء',
      status: 'INVESTIGATING'
    },
    {
      targetType: 'AUCTION',
      reason: 'SPAM',
      description: 'مزاد مكرر ومنشور عدة مرات',
      status: 'RESOLVED'
    },
    {
      targetType: 'USER',
      reason: 'HARASSMENT',
      description: 'مضايقات متكررة في الرسائل الخاصة',
      status: 'CLOSED'
    }
  ];

  for (let i = 0; i < reports.length; i++) {
    const reportData = reports[i];
    const reporter = users[i % users.length];
    
    let targetId;
    if (reportData.targetType === 'AUCTION') {
      targetId = auctions[i % auctions.length].id;
    } else if (reportData.targetType === 'COMMENT') {
      targetId = comments[i % comments.length].id;
    } else {
      targetId = users[(i + 1) % users.length].id;
    }

    await prisma.report.create({
      data: {
        reporterId: reporter.id,
        targetType: reportData.targetType,
        targetId: targetId,
        reason: reportData.reason,
        description: reportData.description,
        status: reportData.status
      }
    });
  }

  console.log(`✓ تم إنشاء ${reports.length} بلاغ`);
}

main()
  .catch((e) => {
    console.error('خطأ في تشغيل السيد:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });