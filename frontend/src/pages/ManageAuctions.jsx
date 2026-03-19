import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  PlayCircle,
  Pause,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

export default function ManageAuctions() {
  const { auctions, loading, error, deleteAuction, updateAuctionStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedAuctions, setSelectedAuctions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'scheduled', label: 'مجدول' },
    { value: 'live', label: 'مباشر' },
    { value: 'ended', label: 'منتهي' },
    { value: 'cancelled', label: 'ملغي' },
    { value: 'suspended', label: 'معلق' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'جميع التصنيفات' },
    { value: 'electronics', label: 'إلكترونيات' },
    { value: 'vehicles', label: 'مركبات' },
    { value: 'real-estate', label: 'عقارات' },
    { value: 'jewelry', label: 'مجوهرات' },
    { value: 'art', label: 'فن وتحف' },
    { value: 'fashion', label: 'أزياء' },
    { value: 'sports', label: 'رياضة' },
    { value: 'other', label: 'أخرى' }
  ];

  // Filter and sort auctions
  const filteredAuctions = auctions?.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.seller?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || auction.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || auction.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'currentBid') {
      aValue = a.currentBid || a.startingPrice || 0;
      bValue = b.currentBid || b.startingPrice || 0;
    } else if (sortBy === 'bidsCount') {
      aValue = a.bids?.length || 0;
      bValue = b.bids?.length || 0;
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    } else if (aValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAuction = (auctionId) => {
    setSelectedAuctions(prev => 
      prev.includes(auctionId) 
        ? prev.filter(id => id !== auctionId)
        : [...prev, auctionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAuctions.length === paginatedAuctions.length) {
      setSelectedAuctions([]);
    } else {
      setSelectedAuctions(paginatedAuctions.map(auction => auction.id));
    }
  };

  const handleDeleteAuction = async () => {
    if (auctionToDelete) {
      try {
        await deleteAuction(auctionToDelete.id);
        setShowDeleteModal(false);
        setAuctionToDelete(null);
      } catch (error) {
        console.error('Error deleting auction:', error);
      }
    }
  };

  const handleStatusUpdate = async (auctionId, newStatus) => {
    try {
      await updateAuctionStatus(auctionId, newStatus);
    } catch (error) {
      console.error('Error updating auction status:', error);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      for (const auctionId of selectedAuctions) {
        if (action === 'delete') {
          await deleteAuction(auctionId);
        } else {
          await updateAuctionStatus(auctionId, action);
        }
      }
      setSelectedAuctions([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <PlayCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'ended':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'text-red-700 bg-red-100';
      case 'scheduled':
        return 'text-blue-700 bg-blue-100';
      case 'ended':
        return 'text-green-700 bg-green-100';
      case 'cancelled':
      case 'suspended':
        return 'text-red-700 bg-red-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'live':
        return 'مباشر';
      case 'scheduled':
        return 'مجدول';
      case 'ended':
        return 'منتهي';
      case 'cancelled':
        return 'ملغي';
      case 'suspended':
        return 'معلق';
      case 'pending':
        return 'في الانتظار';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المزادات</h1>
            <p className="text-gray-600">إدارة ومراقبة جميع المزادات على المنصة</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              to="/admin/auctions/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              إضافة مزاد جديد
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في المزادات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-desc">الأحدث أولاً</option>
              <option value="createdAt-asc">الأقدم أولاً</option>
              <option value="title-asc">الاسم (أ-ي)</option>
              <option value="title-desc">الاسم (ي-أ)</option>
              <option value="currentBid-desc">السعر (الأعلى)</option>
              <option value="currentBid-asc">السعر (الأقل)</option>
              <option value="bidsCount-desc">الأكثر مزايدة</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAuctions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-blue-700 font-medium">
                  تم اختيار {selectedAuctions.length} مزاد
                </span>
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  الإجراءات المجمعة
                </button>
              </div>
              <button
                onClick={() => setSelectedAuctions([])}
                className="text-blue-600 hover:text-blue-700"
              >
                إلغاء التحديد
              </button>
            </div>
            
            {showBulkActions && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleBulkAction('suspended')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  تعليق
                </button>
                <button
                  onClick={() => handleBulkAction('cancelled')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
                >
                  حذف
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            عرض {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAuctions.length)} من {filteredAuctions.length} مزاد
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedAuctions.length === paginatedAuctions.length && paginatedAuctions.length > 0}
              onChange={handleSelectAll}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-600">تحديد الكل</span>
          </div>
        </div>

        {/* Auctions Grid */}
        {paginatedAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedAuctions.map((auction) => (
              <div key={auction.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Selection Checkbox */}
                <div className="absolute top-4 right-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedAuctions.includes(auction.id)}
                    onChange={() => handleSelectAuction(auction.id)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white/80"
                  />
                </div>

                {/* Auction Image */}
                <div className="relative h-48 bg-gray-200">
                  {auction.coverImage ? (
                    <img
                      src={auction.coverImage}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                      {getStatusIcon(auction.status)}
                      {getStatusText(auction.status)}
                    </div>
                  </div>
                </div>

                {/* Auction Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{auction.title}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{auction.seller?.name}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {(auction.currentBid || auction.startingPrice || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">السعر الحالي (ر.س)</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {auction.bids?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">المزايدات</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/auctions/${auction.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                      عرض التفاصيل
                    </Link>
                    
                    <div className="relative">
                      <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Status Actions */}
                  {auction.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleStatusUpdate(auction.id, 'scheduled')}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-700 transition-colors"
                      >
                        قبول
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(auction.id, 'cancelled')}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-red-700 transition-colors"
                      >
                        رفض
                      </button>
                    </div>
                  )}
                  
                  {auction.status === 'live' && (
                    <button
                      onClick={() => handleStatusUpdate(auction.id, 'suspended')}
                      className="w-full bg-yellow-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-yellow-700 transition-colors mt-3"
                    >
                      تعليق المزاد
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مزادات</h3>
            <p className="text-gray-600 mb-6">لم يتم العثور على مزادات مطابقة للفلتر المحدد</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              السابق
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isVisible = page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2);
              
              if (!isVisible) {
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              التالي
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من حذف المزاد "{auctionToDelete?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAuction}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}