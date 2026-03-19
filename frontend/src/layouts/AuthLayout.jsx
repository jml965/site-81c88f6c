import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { isLoading } = useAuth();

  useEffect(() => {
    // Set page title for auth pages
    document.title = 'تسجيل الدخول - مزاد الفيديو';
    
    return () => {
      document.title = 'مزاد الفيديو - منصة المزادات الحديثة';
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4 font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Header with Logo */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            مزاد الفيديو
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            منصة المزادات الحديثة
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <Outlet />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8">
        <div className="max-w-md mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 مزاد الفيديو. جميع الحقوق محفوظة
          </p>
          <div className="flex items-center justify-center space-x-6 space-x-reverse mt-4">
            <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors">
              <span className="text-xs">الشروط والأحكام</span>
            </a>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors">
              <span className="text-xs">سياسة الخصوصية</span>
            </a>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <a href="#" className="text-gray-400 hover:text-amber-600 transition-colors">
              <span className="text-xs">المساعدة</span>
            </a>
          </div>
        </div>
      </footer>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 left-10 w-32 h-32 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-300/10 to-orange-300/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default AuthLayout;