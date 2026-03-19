import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      {/* Header */}
      <Header />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating Action Button for Mobile */}
      {isAuthenticated && (
        <div className="fixed bottom-6 left-6 z-50 md:hidden">
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Overlay for mobile menu */}
      <div id="mobile-overlay" className="hidden fixed inset-0 bg-black/50 z-40 md:hidden"></div>
    </div>
  );
};

export default MainLayout;