import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronDown, Star, Users, Eye, Clock, Heart, Share2, Flag } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import SortOptions from '../components/SortOptions';
import AuctionCard from '../components/AuctionCard';
import useAuctions from '../hooks/useAuctions';
import { Link } from 'react-router-dom';

const AuctionList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priceRange: [0, 10000],
    location: '',
    dateRange: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    auctions,
    loading,
    error,
    totalCount,
    categories,
    locations,
    refetch
  } = useAuctions({
    search: searchQuery,
    filters,
    sort: sortBy,
    page: currentPage,
    limit: itemsPerPage
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      priceRange: [0, 10000],
      location: '',
      dateRange: ''
    });
    setSearchQuery('');
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) {
      return value[0] !== 0 || value[1] !== 10000;
    }
    return value !== '';
  }).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            حدث خطأ في تحميل المزادات
          </div>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              اكتشف مزادات فيديو مثيرة
            </h1>
            <p className="text-xl mb-8 opacity-90">
              شاهد واشارك في مزادات مباشرة بتقنية الفيديو المتزامن
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="ابحث عن المزادات..."
                value={searchQuery}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFilterChange}
                categories={categories}
                locations={locations}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center w-full bg-white rounded-lg shadow-md px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5 ml-2" />
                الفلاتر
                {activeFiltersCount > 0 && (
                  <span className="mr-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-5 h-5 mr-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="mt-4 bg-white rounded-2xl shadow-lg p-6">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    categories={categories}
                    locations={locations}
                    onClear={clearFilters}
                  />
                </div>
              )}
            </div>

            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    المزادات المتاحة
                  </h2>
                  <p className="text-gray-600">
                    {loading ? 'جاري التحميل...' : `${totalCount} مزاد متاح`}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Sort Options */}
                  <div className="flex-1 sm:flex-none">
                    <SortOptions
                      value={sortBy}
                      onChange={handleSortChange}
                    />
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value || (Array.isArray(value) && value[0] === 0 && value[1] === 10000)) return null;
                      
                      let displayValue = value;
                      if (key === 'priceRange' && Array.isArray(value)) {
                        displayValue = `${value[0]} - ${value[1]} ريال`;
                      }
                      
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {displayValue}
                          <button
                            onClick={() => {
                              const newFilters = { ...filters };
                              if (Array.isArray(newFilters[key])) {
                                newFilters[key] = [0, 10000];
                              } else {
                                newFilters[key] = '';
                              }
                              setFilters(newFilters);
                            }}
                            className="mr-2 hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      مسح جميع الفلاتر
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auctions Grid/List */}
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : auctions.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-md p-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    لم يتم العثور على مزادات
                  </h3>
                  <p className="text-gray-600 mb-6">
                    جرب تغيير معايير البحث أو الفلاتر
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    مسح الفلاتر
                  </button>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {auctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    
                    if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;