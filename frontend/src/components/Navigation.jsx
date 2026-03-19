import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Grid3X3, Car, Home, Smartphone, Watch, Gem, PaintBucket, Shirt, Gamepad2, Camera, Utensils } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

  const categories = [
    {
      id: 'cars',
      name: 'السيارات والمركبات',
      icon: Car,
      href: '/categories/cars',
      subcategories: ['سيارات فاخرة', 'سيارات كلاسيكية', 'دراجات نارية', 'قطع غيار']
    },
    {
      id: 'real-estate',
      name: 'العقارات',
      icon: Home,
      href: '/categories/real-estate',
      subcategories: ['فلل', 'شقق', 'أراضي', 'مكاتب تجارية']
    },
    {
      id: 'electronics',
      name: 'الإلكترونيات',
      icon: Smartphone,
      href: '/categories/electronics',
      subcategories: ['هواتف ذكية', 'أجهزة كمبيوتر', 'تلفزيونات', 'كاميرات']
    },
    {
      id: 'jewelry',
      name: 'المجوهرات والساعات',
      icon: Watch,
      href: '/categories/jewelry',
      subcategories: ['ساعات فاخرة', 'مجوهرات ذهبية', 'أحجار كريمة', 'إكسسوارات']
    },
    {
      id: 'antiques',
      name: 'التحف والأنتيكات',
      icon: Gem,
      href: '/categories/antiques',
      subcategories: ['قطع أثرية', 'لوحات فنية', 'تحف إسلامية', 'مخطوطات']
    },
    {
      id: 'art',
      name: 'الفنون والحرف',
      icon: PaintBucket,
      href: '/categories/art',
      subcategories: ['لوحات زيتية', 'منحوتات', 'خط عربي', 'حرف يدوية']
    },
    {
      id: 'fashion',
      name: 'الأزياء والموضة',
      icon: Shirt,
      href: '/categories/fashion',
      subcategories: ['ملابس فاخرة', 'أحذية', 'حقائب', 'عطور']
    },
    {
      id: 'collectibles',
      name: 'المقتنيات النادرة',
      icon: Gamepad2,
      href: '/categories/collectibles',
      subcategories: ['طوابع', 'عملات', 'كتب نادرة', 'ألعاب قديمة']
    }
  ];

  const navigationItems = [
    {
      name: 'الرئيسية',
      href: '/',
      isActive: location.pathname === '/'
    },
    {
      name: 'المزادات النشطة',
      href: '/auctions?status=active',
      isActive: location.pathname === '/auctions' && location.search.includes('active')
    },
    {
      name: 'المزادات القادمة',
      href: '/auctions?status=upcoming',
      isActive: location.pathname === '/auctions' && location.search.includes('upcoming')
    },
    {
      name: 'المزادات المنتهية',
      href: '/auctions?status=ended',
      isActive: location.pathname === '/auctions' && location.search.includes('ended')
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.isActive
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50/50'
                }`}
              >
                {item.name}
                {item.isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 font-medium"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>التصنيفات</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                showCategoriesDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Categories Mega Menu */}
            {showCategoriesDropdown && (
              <div
                onMouseEnter={() => setShowCategoriesDropdown(true)}
                onMouseLeave={() => setShowCategoriesDropdown(false)}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 z-50"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Link
                        key={category.id}
                        to={category.href}
                        className="group p-4 rounded-xl hover:bg-amber-50 transition-all duration-200 border border-transparent hover:border-amber-200"
                        onClick={() => setShowCategoriesDropdown(false)}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-200">
                            <IconComponent className="w-5 h-5 text-amber-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors text-sm">
                            {category.name}
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {category.subcategories.map((subcategory, index) => (
                            <li key={index}>
                              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                                {subcategory}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </Link>
                    );
                  })}
                </div>
                
                {/* Featured Categories */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      الفئات المميزة اليوم
                    </h3>
                    <Link
                      to="/categories"
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      عرض الكل
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.slice(0, 4).map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Link
                          key={category.id}
                          to={category.href}
                          className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-amber-50 hover:to-orange-50 transition-all duration-200 group"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <IconComponent className="w-4 h-4 text-amber-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors">
                            {category.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation Links - Horizontal Scroll */}
          <div className="lg:hidden flex-1 overflow-x-auto">
            <div className="flex items-center space-x-4 space-x-reverse px-4">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    item.isActive
                      ? 'text-amber-700 bg-amber-50 border border-amber-200'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/50 border border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden xl:flex items-center space-x-6 space-x-reverse text-sm text-gray-600">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>15 مزاد نشط</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>248 مشارك الآن</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>32 ألف ريال أعلى مزايدة</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;