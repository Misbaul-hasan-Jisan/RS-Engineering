import React from 'react';
import './CSS/Pages.css';
const Stores = () => {
  const locations = [
    { city: 'New York', address: '123 Main St' },
    { city: 'Los Angeles', address: '456 Sunset Blvd' },
    { city: 'Chicago', address: '789 Michigan Ave' }
  ];

  return (
    <div className="page-container">
      <h1>Our Stores</h1>
      <div className="store-locations">
        {locations.map((store, index) => (
          <div key={index} className="store-card">
            <h3>{store.city}</h3>
            <p>{store.address}</p>
            <p>Open 9AM-9PM</p>
            <button>Get Directions</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stores;