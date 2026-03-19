import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';
import Home from './pages/Home';
import AuctionList from './pages/AuctionList';
import AuctionDetails from './pages/AuctionDetails';
import AuctionRoom from './pages/AuctionRoom';

import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';

import Comments from './pages/Comments';

import LoadingSpinner from './components/Loading';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <BidProvider>
              <div className="min-h-screen bg-gray-50" dir="rtl">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Layout><Home /></Layout>} />
                  <Route path="/auctions" element={<Layout><AuctionList /></Layout>} />
                  <Route path="/auction/:id" element={<Layout><AuctionDetails /></Layout>} />
                  <Route path="/auction/:id/results" element={<Layout><AuctionResults /></Layout>} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected User Routes */}
                  <Route path="/auction/:id/room" element={
                    <ProtectedRoute>
                      <Layout><AuctionRoom /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Layout><Profile /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Layout><Messages /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <Layout><Notifications /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/follows" element={
                    <ProtectedRoute>
                      <Layout><Follows /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/auction/:id/comments" element={
                    <ProtectedRoute>
                      <Layout><Comments /></Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Seller Routes */}
                  <Route path="/seller" element={
                    <ProtectedRoute requiredRole="seller">
                      <SellerLayout><SellerDashboard /></SellerLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/seller/create" element={
                    <ProtectedRoute requiredRole="seller">
                      <SellerLayout><CreateAuction /></SellerLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/seller/auctions" element={
                    <ProtectedRoute requiredRole="seller">
                      <SellerLayout><MyAuctions /></SellerLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout><AdminDashboard /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/auctions" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout><AdminAuctions /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout><AdminUsers /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/reports" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout><AdminReports /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/comments" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout><AdminComments /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout><AdminSettings /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BidProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;