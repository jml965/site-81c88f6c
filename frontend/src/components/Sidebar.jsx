import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Home,
  Grid3X3,
  Gavel,
  Heart,
  MessageSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  TrendingUp,
  Clock,
  Trophy,
  Star,
  Filter,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    auctions: false,
    categories: false,
    account: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainNavigation = [
    {
      name: 'الرئيسية',
      href: '/',
      icon: Home,
      isActive: location.pathname === '/'
    },
    {
      name: 'جميع المزادات',
      href: '/auctions',
      icon: Grid3X3,
      isActive: location.pathname === '/auctions' && !location.search,
      hasSubmenu: true,
      submenu: [
        { name: 'المزادات النشطة', href: '/auctions?status=active', icon: TrendingUp },
        { name: 'المزادات القادمة', href: '/auctions?status=upcoming', icon: Clock },
        { name: 'المزادات المنتهية', href: '/auctions?status=ended', icon: Trophy },
        { name: 'الأعلى سعراً', href: '/auctions?sort=highest', icon: Star }
      ]
    },
    {
      name: 'التصنيفات',
      href: '/categories',
      icon: Filter,
      isActive: location.pathname.startsWith('/categories'),
      hasSubmenu: true,
      submenu: [
        { name: 'السيارات', href: '/categories/cars' },
        { name: 'العقارات', href: '/categories/real-estate' },
        { name: 'الإلكترونيات', href: '/categories/electronics' },
        { name: 'المجوهرات', href: '/categories/jewelry' },
        { name: 'التحف', href: '/categories/antiques' }
      ]
    }
  ];

  const userNavigation = [
    {
      name: 'مزايداتي',
      href: '/my-bids',
      icon: Gavel,
      isActive: location.pathname === '/my-bids'
    },
    {
      name: 'المفضلة',
      href: '/favorites',
      icon: Heart,
      isActive: location.pathname === '/favorites'
    },
    {
      name: 'الرسائل',
      href: '/messages',
      icon: MessageSquare,
      isActive: location.pathname === '/messages',
      badge: 3
    },
    {
      name: 'الإشعارات',
      href: '/notifications',
      icon: Bell,
      isActive: location.pathname === '/notifications',
      badge: 7
    },
    {
      name: 'الملف الشخصي',
      href: '/profile',
      icon: User,
      isActive: location.pathname === '/profile',
      hasSubmenu: true,
      submenu: [
        { name: 'بياناتي الشخصية', href: '/profile/personal' },
        { name: 'إعدادات الحساب', href: '/profile/settings' },
        { name: 'سجل النشاط', href: '/profile/activity' },
        { name: 'طرق الدفع', href: '/profile/payment-methods' }
      ]
    }
  ];

  const bottomNavigation = [
    {
      name: 'الإعدادات',
      href: '/settings',
      icon: Settings,
      isActive: location.pathname === '/settings'
    },
    {
      name: 'المساعدة',
      href: '/help',
      icon: HelpCircle,
      isActive: location.pathname === '/help'
    }
  ];

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const NavItem = ({ item, isSubmenuItem = false }) => {
    const IconComponent = item.icon;
    const hasSubmenu = item.hasSubmenu && item.submenu;
    const isExpanded = hasSubmenu && expandedSections[item.name.toLowerCase()];

    return (
      <div className="w-full">
        <div className="flex items-center w-full">
          <Link
            to={item.href}
            onClick={handleLinkClick}
            className={`flex-1 flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 group ${
              item.isActive
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600'
            } ${isSubmenuItem ? 'pr-8 text-sm' : ''}`}
          >
            {IconComponent && (
              <div className={`flex-shrink-0 ${
                item.isActive ? 'text-amber-600' : 'text-gray-400 group-hover:text-amber-600'
              }`}>
                <IconComponent className={isSubmenuItem ? 'w-4 h-4' : 'w-5 h-5'} />
              </div>
            )}
            <span className={`font-medium ${
              isSubmenuItem ? 'text-sm' : 'text-base'
            }`}>
              {item.name}
            </span>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </Link>
          
          {hasSubmenu && (
            <button
              onClick={() => toggleSection(item.name.toLowerCase())}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isExpanded ? 'text-amber-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            </button>
          )}
        </div>

        {/* Submenu */}
        {hasSubmenu && isExpanded && (
          <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.submenu.map((subItem, index) => (
              <NavItem key={index} item={subItem} isSubmenuItem />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none lg:border-l lg:border-gray-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${className}`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:hidden">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">القائمة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full lg:h-[calc(100vh-64px)]">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* User Info */}
              {isAuthenticated && user && (
                <div className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.name || 'المستخدم'}
                      </h3>
                      <p className="text-sm text-amber-600">
                        {user.role === 'seller' ? 'بائع' : 'مشتري'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="text-center py-2 bg-white/50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">12</div>
                      <div className="text-xs text-gray-600">مزايدة</div>
                    </div>
                    <div className="text-center py-2 bg-white/50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">5</div>
                      <div className="text-xs text-gray-600">فوز</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Navigation */}
              <div className="space-y-2 mb-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-4">
                  التصفح
                </h3>
                {mainNavigation.map((item, index) => (
                  <NavItem key={index} item={item} />
                ))}
              </div>

              {/* User Navigation */}
              {isAuthenticated && (
                <div className="space-y-2 mb-8">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-4">
                    حسابي
                  </h3>
                  {userNavigation.map((item, index) => (
                    <NavItem key={index} item={item} />
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-4">
                  إحصائيات سريعة
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">مزادات نشطة</span>
                    </div>
                    <span className="text-sm font-bold text-green-700">15</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">مشاركين الآن</span>
                    </div>
                    <span className="text-sm font-bold text-blue-700">248</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-amber-50 rounded-xl">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">أعلى مزايدة</span>
                    </div>
                    <span className="text-sm font-bold text-amber-700">32,000 ر.س</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 p-6">
            <div className="space-y-2">
              {bottomNavigation.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </div>
            
            {/* Version Info */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">
                  مزاد الفيديو v2.1.0
                </p>
                <div className="flex items-center justify-center space-x-4 space-x-reverse">
                  <a href="#" className="text-xs text-gray-400 hover:text-amber-600 transition-colors">
                    الدعم
                  </a>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <a href="#" className="text-xs text-gray-400 hover:text-amber-600 transition-colors">
                    شروط الاستخدام
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;