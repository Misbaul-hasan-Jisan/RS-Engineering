// src/Pages/SearchResults.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductDisplay from '../component/ProductDisplay/ProductDisplay';
import './CSS/SearchResults.css'; 

const SearchResults = () => {
  const location = useLocation();
  const { results, query } = location.state || { results: [], query: '' };

  return (
    <div className='search-results'>
      <h2>Search Results for "{query}"</h2>
      <div className="results-container">
        {results.length > 0 ? (
          results.map(product => (
            <ProductDisplay key={product.id} product={product} />
          ))
        ) : (
          <p>No products found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;