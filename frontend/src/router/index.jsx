import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/Loading';
import Layout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import SellerLayout from '../layouts/SellerLayout';

// Lazy load components for better performance
const Home = lazy(() => import('../pages/Home'));
const AuctionList = lazy(() => import('../pages/AuctionList'));
const AuctionDetails = lazy(() => import('../pages/AuctionDetails'));
const AuctionRoom = lazy(() => import('../pages/AuctionRoom'));
const AuctionResults = lazy(() => import('../pages/AuctionResults'));

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// User pages
const Profile = lazy(() => import('../pages/Profile'));
const Messages = lazy(() => import('../pages/Messages'));
const Notifications = lazy(() => import('../pages/Notifications'));
const Follows = lazy(() => import('../pages/Follows'));
const Comments = lazy(() => import('../pages/Comments'));
const MyBids = lazy(() => import('../pages/MyBids'));
const Settings = lazy(() => import('../pages/Settings'));

// Seller pages
const SellerDashboard = lazy(() => import('../pages/seller/SellerDashboard'));
const CreateAuction = lazy(() => import('../pages/seller/CreateAuction'));
const MyAuctions = lazy(() => import('../pages/seller/MyAuctions'));
const EditAuction = lazy(() => import('../pages/seller/EditAuction'));
const SellerReports = lazy(() => import('../pages/seller/SellerReports'));
const SellerMessages = lazy(() => import('../pages/seller/SellerMessages'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminAuctions = lazy(() => import('../pages/admin/AdminAuctions'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));
const AdminComments = lazy(() => import('../pages/admin/AdminComments'));
const AdminMessages = lazy(() => import('../pages/admin/AdminMessages'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminStats = lazy(() => import('../pages/admin/AdminStats'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));

// Error pages
const NotFound = lazy(() => import('../pages/NotFound'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const ServerError = lazy(() => import('../pages/ServerError'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="lg" />
  </div>
);

// Route configuration
const AppRouter = () => {
  const { user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        <Route path="/auctions" element={
          <Layout>
            <AuctionList />
          </Layout>
        } />
        
        <Route path="/auction/:id" element={
          <Layout>
            <AuctionDetails />
          </Layout>
        } />
        
        <Route path="/auction/:id/results" element={
          <Layout>
            <AuctionResults />
          </Layout>
        } />
        
        {/* Auth Routes - Only accessible when not logged in */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login />
        } />
        
        <Route path="/register" element={
          user ? <Navigate to="/" replace /> : <Register />
        } />
        
        <Route path="/forgot-password" element={
          user ? <Navigate to="/" replace /> : <ForgotPassword />
        } />
        
        <Route path="/reset-password/:token" element={
          user ? <Navigate to="/" replace /> : <ResetPassword />
        } />
        
        {/* Protected User Routes */}
        <Route path="/auction/:id/room" element={
          <ProtectedRoute>
            <Layout>
              <AuctionRoom />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/auction/:id/comments" element={
          <ProtectedRoute>
            <Layout>
              <Comments />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/messages" element={
          <ProtectedRoute>
            <Layout>
              <Messages />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/follows" element={
          <ProtectedRoute>
            <Layout>
              <Follows />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/my-bids" element={
          <ProtectedRoute>
            <Layout>
              <MyBids />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Seller Routes */}
        <Route path="/seller" element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <SellerLayout>
              <SellerDashboard />
            </SellerLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/seller/create" element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <SellerLayout>
              <CreateAuction />
            </SellerLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/seller/auctions" element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <SellerLayout>
              <MyAuctions />
            </SellerLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/seller/auction/:id/edit" element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <SellerLayout>
              <EditAuction />
            </SellerLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/seller/reports" element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <SellerLayout>
              <SellerReports />
            </SellerLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/seller/messages" element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <SellerLayout>
              <SellerMessages />
            </SellerLayout>
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/auctions" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminAuctions />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/reports" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminReports />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/comments" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminComments />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/messages" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminMessages />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/settings" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/stats" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminStats />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/categories" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/server-error" element={<ServerError />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Route guards and utilities
export const routeConfig = {
  public: [
    '/',
    '/auctions',
    '/auction/:id',
    '/auction/:id/results',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:token',
  ],
  protected: [
    '/auction/:id/room',
    '/auction/:id/comments',
    '/profile',
    '/messages',
    '/notifications',
    '/follows',
    '/my-bids',
    '/settings',
  ],
  seller: [
    '/seller',
    '/seller/create',
    '/seller/auctions',
    '/seller/auction/:id/edit',
    '/seller/reports',
    '/seller/messages',
  ],
  admin: [
    '/admin',
    '/admin/auctions',
    '/admin/users',
    '/admin/reports',
    '/admin/comments',
    '/admin/messages',
    '/admin/settings',
    '/admin/stats',
    '/admin/categories',
  ],
  error: [
    '/unauthorized',
    '/server-error',
    '*',
  ],
};

// Helper function to check if route is public
export const isPublicRoute = (pathname) => {
  return routeConfig.public.some(route => {
    if (route.includes(':')) {
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return route === pathname;
  });
};

// Helper function to get required role for a route
export const getRequiredRole = (pathname) => {
  if (routeConfig.admin.some(route => pathname.startsWith(route.replace('*', '')))) {
    return 'admin';
  }
  if (routeConfig.seller.some(route => pathname.startsWith(route.replace('*', '')))) {
    return ['seller', 'admin'];
  }
  if (routeConfig.protected.some(route => pathname.startsWith(route.replace('*', '')))) {
    return 'user';
  }
  return null;
};

// Helper function to get page title based on route
export const getPageTitle = (pathname) => {
  const titles = {
    '/': 'الرئيسية - مزاد موشن',
    '/auctions': 'المزادات - مزاد موشن',
    '/login': 'تسجيل الدخول - مزاد موشن',
    '/register': 'إنشاء حساب - مزاد موشن',
    '/profile': 'الملف الشخصي - مزاد موشن',
    '/messages': 'الرسائل - مزاد موشن',
    '/notifications': 'الإشعارات - مزاد موشن',
    '/follows': 'المتابعات - مزاد موشن',
    '/my-bids': 'مزايداتي - مزاد موشن',
    '/settings': 'الإعدادات - مزاد موشن',
    '/seller': 'لوحة البائع - مزاد موشن',
    '/seller/create': 'إنشاء مزاد - مزاد موشن',
    '/seller/auctions': 'مزاداتي - مزاد موشن',
    '/admin': 'لوحة الإدارة - مزاد موشن',
    '/admin/auctions': 'إدارة المزادات - مزاد موشن',
    '/admin/users': 'إدارة المستخدمين - مزاد موشن',
    '/unauthorized': 'غير مصرح - مزاد موشن',
    '/server-error': 'خطأ في الخادم - مزاد موشن',
  };
  
  return titles[pathname] || 'مزاد موشن';
};

export default AppRouter;