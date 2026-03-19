import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUpDown, Clock, TrendingUp, DollarSign, Eye, Users, Star } from 'lucide-react';

const SortOptions = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    {
      value: 'newest',
      label: 'الأحدث',
      icon: ArrowUpDown,
      description: 'المزادات الأحدث أولاً'
    },
    {
      value: 'ending_soon',
      label: 'ينتهي قريباً',
      icon: Clock,
      description: 'المزادات التي تنتهي قريباً'
    },
    {
      value: 'price_high',
      label: 'الأعلى سعراً',
      icon: DollarSign,
      description: 'من الأعلى إلى الأقل سعراً'
    },
    {
      value: 'price_low',
      label: 'الأقل سعراً',
      icon: DollarSign,
      description: 'من الأقل إلى الأعلى سعراً'
    },
    {
      value: 'most_bids',
      label: 'الأكثر مزايدات',
      icon: TrendingUp,
      description: 'المزادات الأكثر نشاطاً'
    },
    {
      value: 'most_viewed',
      label: 'الأكثر مشاهدة',
      icon: Eye,
      description: 'المزادات الأكثر مشاهدة'
    },
    {
      value: 'most_participants',
      label: 'الأكثر مشاركة',
      icon: Users,
      description: 'المزادات الأكثر مشاركين'
    },
    {
      value: 'highest_rated',
      label: 'الأعلى تقييماً',
      icon: Star,
      description: 'بائعين بتقييم عالي'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = sortOptions.find(option => option.value === value) || sortOptions[0];

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 w-full min-w-48 bg-white border border-gray-300 rounded-lg px-4 py-3 text-right hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex items-center gap-3">
          <selectedOption.icon className="h-5 w-5 text-gray-500" />
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">{selectedOption.label}</span>
            <span className="text-xs text-gray-500 hidden sm:block">{selectedOption.description}</span>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="py-2">
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-900">ترتيب حسب</h4>
            </div>
            
            {/* Options */}
            <div className="max-h-80 overflow-y-auto">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = option.value === value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-gray-50 transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-gray-700'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${
                      isSelected ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    
                    <div className="flex-1 text-right">
                      <div className={`font-medium ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </div>
                      <div className={`text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {option.description}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-600">
                يمكنك تغيير الترتيب في أي وقت لاستكشاف المزادات بطرق مختلفة
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortOptions;