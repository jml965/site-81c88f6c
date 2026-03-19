import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "البحث...", value = "", showFilters = false, onToggleFilters }) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Popular search terms (would come from API)
  const defaultPopularSearches = [
    'سيارات',
    'عقارات',
    'مجوهرات',
    'أنتيكات',
    'لوحات فنية',
    'ساعات',
    'هواتف',
    'كاميرات'
  ];

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Set popular searches (would typically come from API)
    setPopularSearches(defaultPopularSearches);
  }, []);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      // Generate suggestions based on search term
      const filteredSuggestions = [
        ...popularSearches.filter(item => 
          item.toLowerCase().includes(term.toLowerCase())
        ),
        ...recentSearches.filter(item => 
          item.toLowerCase().includes(term.toLowerCase()) && 
          !popularSearches.includes(item)
        )
      ].slice(0, 6);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (term = searchTerm) => {
    if (term.trim()) {
      // Add to recent searches
      const updatedRecent = [
        term.trim(),
        ...recentSearches.filter(item => item !== term.trim())
      ].slice(0, 10);
      
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
      
      onSearch(term.trim());
    } else {
      onSearch('');
    }
    
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    onSearch('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFocus = () => {
    if (searchTerm.length <= 1) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder={placeholder}
              className="w-full pr-12 pl-12 py-4 text-lg border border-gray-300 rounded-2xl bg-white/90 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
              dir="rtl"
            />
            
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 left-0 pl-3 flex items-center hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Filter Button (if enabled) */}
          {showFilters && (
            <button
              type="button"
              onClick={onToggleFilters}
              className="mr-3 p-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div 
          ref={suggestionRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            <div className="p-2">
              <div className="text-sm font-medium text-gray-600 px-3 py-2">
                اقتراحات البحث
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{suggestion}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      عمليات البحث الأخيرة
                    </h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      مسح الكل
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full text-right px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Popular Searches */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  عمليات البحث الشائعة
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularSearches.slice(0, 6).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="text-right px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;