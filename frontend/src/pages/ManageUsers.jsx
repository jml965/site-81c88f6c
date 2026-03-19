import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  User,
  Shield,
  ShieldCheck,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Calendar,
  Activity,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  Crown
} from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

export default function ManageUsers() {
  const { users, loading, error, updateUserStatus, updateUserRole, deleteUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const roleOptions = [
    { value: 'all', label: 'جميع الأدوار' },
    { value: 'user', label: 'مستخدم' },
    { value: 'seller', label: 'بائع' },
    { value: 'moderator', label: 'مشرف' },
    { value: 'admin', label: 'مدير' }
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' },
    { value: 'suspended', label: 'معلق' },
    { value: 'banned', label: 'محظور' }
  ];

  // Filter and sort users
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'auctionsCount') {
      aValue = a.auctions?.length || 0;
      bValue = b.auctions?.length || 0;
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
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const handleUserAction = async (userId, action, value = null) => {
    try {
      switch (action) {
        case 'updateStatus':
          await updateUserStatus(userId, value);
          break;
        case 'updateRole':
          await updateUserRole(userId, value);
          break;
        case 'delete':
          await deleteUser(userId);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-red-600" />;
      case 'moderator':
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case 'seller':
        return <Shield className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-red-700 bg-red-100';
      case 'moderator':
        return 'text-blue-700 bg-blue-100';
      case 'seller':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'moderator':
        return 'مشرف';
      case 'seller':
        return 'بائع';
      default:
        return 'مستخدم';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'banned':
        return <Ban className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100';
      case 'inactive':
        return 'text-gray-700 bg-gray-100';
      case 'suspended':
        return 'text-yellow-700 bg-yellow-100';
      case 'banned':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'suspended':
        return 'معلق';
      case 'banned':
        return 'محظور';
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
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
            <p className="text-gray-600">إدارة ومراقبة جميع المستخدمين على المنصة</p>
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
                placeholder="البحث في المستخدمين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

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
              <option value="name-asc">الاسم (أ-ي)</option>
              <option value="name-desc">الاسم (ي-أ)</option>
              <option value="auctionsCount-desc">الأكثر مزادات</option>
              <option value="bidsCount-desc">الأكثر مزايدة</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-blue-700 font-medium">
                  تم اختيار {selectedUsers.length} مستخدم
                </span>
                <div className="flex gap-2">
                  <button className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                    تعليق
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    حظر
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedUsers([])}
                className="text-blue-600 hover:text-blue-700"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            عرض {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} من {filteredUsers.length} مستخدم
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
              onChange={handleSelectAll}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-600">تحديد الكل</span>
          </div>
        </div>

        {/* Users Table */}
        {paginatedUsers.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإحصائيات
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ التسجيل
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                              ) : (
                                <User className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && (
                                <div className="text-xs text-gray-400">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {getRoleText(user.role)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          {getStatusText(user.status)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>{user.auctions?.length || 0} مزاد</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Activity className="h-3 w-3" />
                            <span>{user.bids?.length || 0} مزايدة</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(user.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {user.status !== 'banned' && (
                            <button
                              onClick={() => handleUserAction(user.id, 'updateStatus', 'banned')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حظر المستخدم"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                          
                          {user.status === 'banned' && (
                            <button
                              onClick={() => handleUserAction(user.id, 'updateStatus', 'active')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="إلغاء الحظر"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف المستخدم"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا يوجد مستخدمون</h3>
            <p className="text-gray-600 mb-6">لم يتم العثور على مستخدمين مطابقين للفلتر المحدد</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">تفاصيل المستخدم</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  {selectedUser.phone && (
                    <p className="text-gray-600">{selectedUser.phone}</p>
                  )}
                </div>
              </div>
              
              {/* Role and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">الدور</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleUserAction(selectedUser.id, 'updateRole', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">مستخدم</option>
                    <option value="seller">بائع</option>
                    <option value="moderator">مشرف</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">الحالة</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => handleUserAction(selectedUser.id, 'updateStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="suspended">معلق</option>
                    <option value="banned">محظور</option>
                  </select>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{selectedUser.auctions?.length || 0}</div>
                  <div className="text-blue-700">المزادات المنشأة</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{selectedUser.bids?.length || 0}</div>
                  <div className="text-green-700">المزايدات المقدمة</div>
                </div>
              </div>
              
              {/* Registration Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">تاريخ التسجيل</label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من حذف المستخدم "{userToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteUser}
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