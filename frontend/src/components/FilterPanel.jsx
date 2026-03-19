import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Calendar, 
  MapPin, 
  Tag, 
  DollarSign,
  Clock,
  Users,
  Star
} from 'lucide-react';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  categories = [], 
  locations = [], 
  onClear 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    status: true,
    price: true,
    location: false,
    date: false,
    seller: false
  });

  const statusOptions = [
    { value: '', label: 'جميع الحالات' },
    { value: 'upcoming', label: 'قادم' },
    { value: 'active', label: 'نشط' },
    { value: 'ended', label: 'منتهي' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'جميع الأوقات' },
    { value: 'today', label: 'اليوم' },
    { value: 'this_week', label: 'هذا الأسبوع' },
    { value: 'this_month', label: 'هذا الشهر' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  const sortByOptions = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'ending_soon', label: 'ينتهي قريباً' },
    { value: 'price_high', label: 'الأعلى سعراً' },
    { value: 'price_low', label: 'الأقل سعراً' },
    { value: 'most_bids', label: 'الأكثر مزايدات' },
    { value: 'most_viewed', label: 'الأكثر مشاهدة' }
  ];

  const sellerRatingOptions = [
    { value: '', label: 'جميع البائعين' },
    { value: '5', label: '5 نجوم' },
    { value: '4', label: '4 نجوم فأكثر' },
    { value: '3', label: '3 نجوم فأكثر' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const FilterSection = ({ icon: Icon, title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">الفلاتر</h3>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          مسح الكل
        </button>
      </div>

      {/* Category Filter */}
      <FilterSection
        icon={Tag}
        title="التصنيف"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">جميع التصنيفات</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={filters.category === category.id}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">{category.name}</span>
              <span className="text-xs text-gray-500 mr-auto">({category.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Status Filter */}
      <FilterSection
        icon={Clock}
        title="حالة المزاد"
        isExpanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={filters.status === option.value}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection
        icon={DollarSign}
        title="نطاق السعر"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(filters.priceRange[1])}</span>
              <span>{formatPrice(filters.priceRange[0])}</span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={filters.priceRange[0]}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (newValue <= filters.priceRange[1]) {
                    updateFilter('priceRange', [newValue, filters.priceRange[1]]);
                  }
                }}
                className="absolute inset-0 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (newValue >= filters.priceRange[0]) {
                    updateFilter('priceRange', [filters.priceRange[0], newValue]);
                  }
                }}
                className="absolute inset-0 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>
          </div>
          
          {/* Quick Price Options */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { min: 0, max: 1000, label: '< 1,000' },
              { min: 1000, max: 5000, label: '1K - 5K' },
              { min: 5000, max: 10000, label: '5K - 10K' },
              { min: 10000, max: 100000, label: '> 10K' }
            ].map((range, index) => (
              <button
                key={index}
                onClick={() => updateFilter('priceRange', [range.min, range.max])}
                className={`p-2 text-xs border rounded-lg transition-colors ${
                  filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Location Filter */}
      <FilterSection
        icon={MapPin}
        title="الموقع"
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection('location')}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="location"
              value=""
              checked={filters.location === ''}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">جميع المواقع</span>
          </label>
          {locations.map((location) => (
            <label key={location.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="location"
                value={location.id}
                checked={filters.location === location.id}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">{location.name}</span>
              <span className="text-xs text-gray-500 mr-auto">({location.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Date Range Filter */}
      <FilterSection
        icon={Calendar}
        title="التاريخ"
        isExpanded={expandedSections.date}
        onToggle={() => toggleSection('date')}
      >
        <div className="space-y-2">
          {dateRangeOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="dateRange"
                value={option.value}
                checked={filters.dateRange === option.value}
                onChange={(e) => updateFilter('dateRange', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
          
          {filters.dateRange === 'custom' && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </FilterSection>

      {/* Seller Rating Filter */}
      <FilterSection
        icon={Star}
        title="تقييم البائع"
        isExpanded={expandedSections.seller}
        onToggle={() => toggleSection('seller')}
      >
        <div className="space-y-2">
          {sellerRatingOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="sellerRating"
                value={option.value}
                checked={filters.sellerRating === option.value}
                onChange={(e) => updateFilter('sellerRating', e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 flex items-center gap-1">
                {option.label}
                {option.value && (
                  <div className="flex items-center">
                    {[...Array(parseInt(option.value))].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Apply Filters Button (Mobile) */}
      <div className="lg:hidden pt-4">
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;