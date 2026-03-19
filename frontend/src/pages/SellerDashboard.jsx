import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Users, 
  Clock, 
  DollarSign,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Video,
  Edit3,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { useSeller } from '../hooks/useSeller';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { seller, stats, auctions, loading, error, refreshData } = useSeller();
  const [selectedTab, setSelectedTab] = useState('active');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const handleDeleteAuction = async (auctionId) => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        refreshData();
        setShowDeleteModal(false);
        setAuctionToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting auction:', err);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
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

  const filteredAuctions = auctions.filter(auction => {
    switch (selectedTab) {
      case 'active': return auction.status === 'active';
      case 'scheduled': return auction.status === 'scheduled';
      case 'ended': return auction.status === 'ended';
      case 'all': return true;
      default: return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة البائع</h1>
              <p className="text-gray-600">إدارة مزاداتك ومتابعة الأداء</p>
              {seller && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{seller.businessName}</p>
                    <p className="text-sm text-gray-500">منذ {formatDate(seller.joinedAt)}</p>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/seller/create-auction"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-5 h-5" />
              إنشاء مزاد جديد
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalAuctions}</p>
            <p className="text-gray-600">إجمالي المزادات</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeAuctions}</p>
            <p className="text-gray-600">مزادات نشطة</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-gray-600">إجمالي الإيرادات</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalBidders}</p>
            <p className="text-gray-600">إجمالي المزايدين</p>
          </div>
        </div>

        {/* Auctions Section */}
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex p-6 pb-0">
              {[
                { id: 'active', label: 'نشطة', count: stats.activeAuctions },
                { id: 'scheduled', label: 'مجدولة', count: stats.scheduledAuctions },
                { id: 'ended', label: 'منتهية', count: stats.endedAuctions },
                { id: 'all', label: 'الكل', count: stats.totalAuctions }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Auctions List */}
          <div className="p-6">
            {filteredAuctions.length === 0 ? (
              <EmptyState
                icon={Package}
                title="لا توجد مزادات"
                description={`لا توجد مزادات ${selectedTab === 'all' ? '' : 
                  selectedTab === 'active' ? 'نشطة' :
                  selectedTab === 'scheduled' ? 'مجدولة' : 'منتهية'
                } حتى الآن`}
                action={
                  <Link
                    to="/seller/create-auction"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إنشاء مزاد جديد
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAuctions.map((auction) => (
                  <div key={auction.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
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
                        {auction.status === 'active' && 'نشط'}
                        {auction.status === 'scheduled' && 'مجدول'}
                        {auction.status === 'ended' && 'منتهي'}
                        {auction.status === 'cancelled' && 'ملغي'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{auction.title}</h3>
                        <div className="relative">
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">السعر الحالي:</span>
                          <span className="font-bold text-green-600">{formatCurrency(auction.currentPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">عدد المزايدات:</span>
                          <span className="font-medium">{auction.bidsCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">المشاهدات:</span>
                          <span className="font-medium flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {auction.viewsCount}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        {auction.status === 'active' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Clock className="w-4 h-4" />
                            ينتهي: {formatDate(auction.endTime)}
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
                          to={`/seller/edit-auction/${auction.id}`}
                          className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setAuctionToDelete(auction);
                            setShowDeleteModal(true);
                          }}
                          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default SellerDashboard;