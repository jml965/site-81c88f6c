import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Eye, 
  Users, 
  DollarSign, 
  TrendingUp,
  Edit3, 
  Trash2, 
  MoreHorizontal, 
  CheckCircle, 
  AlertCircle,
  Video,
  Image as ImageIcon,
  Filter,
  Search,
  RefreshCw,
  Plus,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';
import EmptyState from './ui/EmptyState';

const MyAuctions = ({ sellerId }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    ended: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchAuctions();
  }, [sellerId, statusFilter, sortBy]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        seller_id: sellerId,
        status: statusFilter !== 'all' ? statusFilter : '',
        sort: sortBy,
        search: searchTerm
      });

      const response = await fetch(`/api/auctions?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions || []);
        setStats(data.stats || stats);
      } else {
        throw new Error('فشل في تحميل المزادات');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        await fetchAuctions();
        setShowDeleteModal(false);
        setAuctionToDelete(null);
      } else {
        throw new Error('فشل في حذف المزاد');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'ended': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'scheduled': return 'مجدول';
      case 'ended': return 'منتهي';
      case 'cancelled': return 'ملغي';
      default: return 'غير معروف';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'انتهى';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-900 mb-2">خطأ في تحميل المزادات</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={fetchAuctions}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { key: 'total', label: 'الكل', value: stats.total, color: 'bg-gray-100 text-gray-800' },
          { key: 'active', label: 'نشطة', value: stats.active, color: 'bg-green-100 text-green-800' },
          { key: 'scheduled', label: 'مجدولة', value: stats.scheduled, color: 'bg-blue-100 text-blue-800' },
          { key: 'ended', label: 'منتهية', value: stats.ended, color: 'bg-gray-100 text-gray-800' },
          { key: 'cancelled', label: 'ملغية', value: stats.cancelled, color: 'bg-red-100 text-red-800' }
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(stat.key === 'total' ? 'all' : stat.key)}
            className={`p-4 rounded-xl text-center transition-all hover:shadow-md ${
              (statusFilter === stat.key || (statusFilter === 'all' && stat.key === 'total'))
                ? `${stat.color} ring-2 ring-blue-500`
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في مزاداتك..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created_at">تاريخ الإنشاء</option>
                <option value="start_time">تاريخ البداية</option>
                <option value="current_price">السعر الحالي</option>
                <option value="bids_count">عدد المزايدات</option>
                <option value="views_count">عدد المشاهدات</option>
              </select>
            </div>
            
            <button
              onClick={fetchAuctions}
              className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <Link
              to="/seller/create-auction"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              مزاد جديد
            </Link>
          </div>
        </div>
      </div>

      {/* Auctions List */}
      {filteredAuctions.length === 0 ? (
        <EmptyState
          icon={Video}
          title="لا توجد مزادات"
          description={searchTerm ? 'لا توجد نتائج للبحث الحالي' : 'لم تقم بإنشاء أي مزادات بعد'}
          action={
            <Link
              to="/seller/create-auction"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إنشاء مزاد جديد
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAuctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative aspect-video bg-gray-100">
                {auction.coverImage ? (
                  <img
                    src={auction.coverImage}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(auction.status)}`}>
                  {getStatusIcon(auction.status)}
                  {getStatusText(auction.status)}
                </div>
                
                {/* Media Count */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  {auction.videoUrl && (
                    <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      فيديو
                    </div>
                  )}
                  {auction.imagesCount > 0 && (
                    <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {auction.imagesCount}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                    {auction.title}
                  </h3>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{auction.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">السعر الحالي</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(auction.currentPrice)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">المزايدات</span>
                      <DollarSign className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-lg font-bold text-blue-600">{auction.bidsCount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {auction.viewsCount} مشاهدة
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {auction.participantsCount} مشارك
                  </div>
                </div>

                {/* Time Info */}
                <div className="text-sm text-gray-600 mb-4">
                  {auction.status === 'active' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Clock className="w-4 h-4" />
                      ينتهي خلال: {getTimeRemaining(auction.endTime)}
                    </div>
                  )}
                  {auction.status === 'scheduled' && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      يبدأ: {formatDate(auction.startTime)}
                    </div>
                  )}
                  {auction.status === 'ended' && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <CheckCircle className="w-4 h-4" />
                      انتهى: {formatDate(auction.endTime)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/auction/${auction.id}`}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    عرض المزاد
                  </Link>
                  
                  <Link
                    to={`/seller/auction/${auction.id}/stats`}
                    className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="الإحصائيات"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    to={`/seller/edit-auction/${auction.id}`}
                    className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="تعديل"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={() => {
                      setAuctionToDelete(auction);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && auctionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">حذف المزاد</h3>
              <p className="text-gray-600">هل أنت متأكد من حذف المزاد "{auctionToDelete.title}"؟</p>
              <p className="text-sm text-red-600 mt-2">هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAuctionToDelete(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDeleteAuction(auctionToDelete.id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                حذف المزاد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAuctions;