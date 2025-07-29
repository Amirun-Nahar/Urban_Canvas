import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    type: '',
    sortBy: 'price_asc',
  });

  const updateSearchParams = (newParams) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams
    }));
  };

  const value = {
    searchParams,
    updateSearchParams
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext; 