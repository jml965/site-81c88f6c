import React, { useState, useEffect } from 'react';
import { Users, Gavel, TrendingUp, Clock, Award, Eye, Heart, Star, CheckCircle, DollarSign } from 'lucide-react';

const StatsSection = () => {
  const [counters, setCounters] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalUsers: 0,
    totalBids: 0,
    totalVolume: 0,
    successRate: 0,
    avgParticipants: 0,
    totalViews: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  const finalStats = {
    totalAuctions: 1847,
    activeAuctions: 156,
    totalUsers: 47832,
    totalBids: 189456,
    totalVolume: 12800000,
    successRate: 98,
    avgParticipants: 67,
    totalViews: 2580000
  };

  const additionalStats = [
    {
      id: 1,
      title: 'معدل النجاح',
      value: '98.5%',
      description: 'من المزادات تكتمل بنجاح',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+2.1%'
    },
    {
      id: 2,
      title: 'متوسط المشاركة',
      value: '67',
      description: 'مشارك في كل مزاد',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+8.3%'
    },
    {
      id: 3,
      title: 'رضا المستخدمين',
      value: '4.9/5',
      description: 'تقييم المنصة',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      trend: '+0.2'
    },
    {
      id: 4,
      title: 'سرعة الاستجابة',
      value: '< 1s',
      description: 'زمن تحديث المزايدات',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'محسن'
    }
  ];

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('stats-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 fps
      const stepDuration = duration / steps;

      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          totalAuctions: Math.floor(finalStats.totalAuctions * progress),
          activeAuctions: Math.floor(finalStats.activeAuctions * progress),
          totalUsers: Math.floor(finalStats.totalUsers * progress),
          totalBids: Math.floor(finalStats.totalBids * progress),
          totalVolume: Math.floor(finalStats.totalVolume * progress),
          successRate: Math.floor(finalStats.successRate * progress),
          avgParticipants: Math.floor(finalStats.avgParticipants * progress),
          totalViews: Math.floor(finalStats.totalViews * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounters(finalStats);
        }
      }, stepDuration);
    };

    animateCounters();
  }, [isVisible]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('ar-SA');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(amount);
  };

  const mainStats = [
    {
      id: 1,
      title: 'إجمالي المزادات',
      value: formatNumber(counters.totalAuctions),
      description: 'مزاد منجز بنجاح',
      icon: Gavel,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'المزادات النشطة',
      value: formatNumber(counters.activeAuctions),
      description: 'مزاد نشط الآن',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      title: 'المستخدمون المسجلون',
      value: formatNumber(counters.totalUsers),
      description: 'مستخدم نشط',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'إجمالي المزايدات',
      value: formatNumber(counters.totalBids),
      description: 'مزايدة تم تسجيلها',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'حجم التداول',
      value: formatCurrency(counters.totalVolume),
      description: 'قيمة المبيعات',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 6,
      title: 'إجمالي المشاهدات',
      value: formatNumber(counters.totalViews),
      description: 'مشاهدة للمزادات',
      icon: Eye,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <section id="stats-section" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-2xl mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            إحصائيات المنصة
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أرقام حقيقية تعكس نجاح وثقة الآلاف من المستخدمين في منصة مزاد موشن
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.id}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden group ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} ${stat.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-mono">
                    {stat.value}
                  </div>
                  
                  {/* Title */}
                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {stat.title}
                  </div>
                  
                  {/* Description */}
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-all duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.id}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  animationDelay: `${(index + 6) * 100}ms`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.bgColor} ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.trend}
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                
                <div className="text-sm font-medium text-gray-800 mb-1">
                  {stat.title}
                </div>
                
                <div className="text-xs text-gray-600">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-300 ml-3" />
              <div>
                <div className="text-lg font-semibold">معتمدة رسمياً</div>
                <div className="text-sm text-blue-100">منصة موثقة</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Award className="w-8 h-8 text-yellow-300 ml-3" />
              <div>
                <div className="text-lg font-semibold">جائزة التميز</div>
                <div className="text-sm text-blue-100">أفضل منصة مزادات</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-300 ml-3" />
              <div>
                <div className="text-lg font-semibold">ثقة المستخدمين</div>
                <div className="text-sm text-blue-100">98% معدل الرضا</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Star className="w-8 h-8 text-yellow-300 ml-3" />
              <div>
                <div className="text-lg font-semibold">تقييم 5 نجوم</div>
                <div className="text-sm text-blue-100">من متاجر التطبيقات</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default StatsSection;