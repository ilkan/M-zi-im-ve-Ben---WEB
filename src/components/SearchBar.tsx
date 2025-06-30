import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder
}) => {
  const { t } = useTranslation();

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder || t('search.placeholder')}
          className="w-full pl-12 pr-12 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-gray-800 placeholder-gray-500 text-lg"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label={t('search.clear')}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;