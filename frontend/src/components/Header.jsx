import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { Search, Bell, User, MessageCircle, Heart, Settings, LogOut, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/auctions?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    const overlay = document.getElementById('mobile-overlay');
    if (overlay) {
      overlay.classList.toggle('hidden');
    }
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'bid',
      title: 'مزايدة جديدة',
      message: 'تم تجاوز مزايدتك في مزاد ساعة رولكس الذهبية',
      time: 'منذ دقيقتين',
      isRead: false
    },
    {
      id: 2,
      type: 'auction_start',
      title: 'بدء مزاد',
      message: 'بدأ مزاد سيارة BMW الجديدة الآن',
      time: 'منذ 10 دقائق',
      isRead: false
    },
    {
      id: 3,
      type: 'message',
      title: 'رسالة جديدة',
      message: 'رسالة جديدة من البائع أحمد محمد',
      time: 'منذ ساعة',
      isRead: true
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 space-x-reverse hover:scale-105 transition-transform duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                مزاد الفيديو
              </h1>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'scale-105' : ''
              }`}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="ابحث في المزادات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-right placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-amber-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Mobile Search */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">الإشعارات</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors ${
                              !notification.isRead ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3 space-x-reverse">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                !notification.isRead ? 'bg-amber-500' : 'bg-gray-300'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link
                          to="/notifications"
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                          onClick={() => setShowNotifications(false)}
                        >
                          عرض جميع الإشعارات
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <Link
                  to="/messages"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </Link>

                {/* Favorites */}
                <Link
                  to="/favorites"
                  className="hidden sm:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="hidden sm:block font-medium text-gray-700 max-w-24 truncate">
                      {user?.name || 'المستخدم'}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.name || 'المستخدم'}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>الملف الشخصي</span>
                        </Link>
                        
                        <Link
                          to="/my-bids"
                          className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>مزايداتي</span>
                        </Link>
                        
                        <Link
                          to="/following"
                          className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="w-4 h-4" />
                          <span>المتابعات</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>الإعدادات</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-amber-600 font-medium transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في المزادات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-500 transition-colors text-right placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-amber-50 text-amber-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={toggleMobileMenu}
              >
                الرئيسية
              </Link>
              <Link
                to="/auctions"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === '/auctions' 
                    ? 'bg-amber-50 text-amber-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={toggleMobileMenu}
              >
                المزادات
              </Link>
              <Link
                to="/categories"
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === '/categories' 
                    ? 'bg-amber-50 text-amber-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={toggleMobileMenu}
              >
                التصنيفات
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/favorites"
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/favorites' 
                        ? 'bg-amber-50 text-amber-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    المفضلة
                  </Link>
                  <Link
                    to="/my-bids"
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/my-bids' 
                        ? 'bg-amber-50 text-amber-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    مزايداتي
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;