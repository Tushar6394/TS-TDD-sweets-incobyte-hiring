import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { SearchParams } from '../types';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({
      q: query || undefined,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
    });
  };

  const handleClear = () => {
    setQuery('');
    setPriceMin('');
    setPriceMax('');
    onSearch({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100">
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for sweets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            showFilters
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
        >
          Search
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              placeholder="$0.00"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              placeholder="$100.00"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
              min="0"
              step="0.01"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleClear}
              className="text-pink-600 hover:text-pink-700 font-semibold text-sm"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
