import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../context/ShopContext';

const Navbar = () => {
  const [menu, setMenu] = useState('Shop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { 
    getTotalCartItems, 
    cartItems, 
    isLoggedIn, 
    handleLogout, 
    all_product,
    searchProducts 
  } = useContext(ShopContext);
  
  const menuRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();

  // Handle logout
  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const results = all_product.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5); // Show top 5 suggestions
        
        setSearchSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, all_product]);

  // Submit search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search-results', { 
        state: { 
          results: all_product.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          query: searchQuery 
        } 
      });
      setSearchQuery('');
      setShowSearch(false);
      setShowSuggestions(false);
      closeMobileMenu();
    }
  };

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle search bar
  const toggleSearch = () => {
    setShowSearch(prev => !prev);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className='navbar'>
      {/* Mobile menu toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Logo */}
      <div className='nav-logo'>
        <img src={logo} alt='Shopper Logo' />
        <p>R&S ENGINEERING</p>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      />

      {/* Navigation menu */}
      <ul ref={menuRef} className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <li onClick={() => { setMenu("Shop"); closeMobileMenu(); }}>
          <Link to='/' style={{textDecoration: 'none', color: 'black'}}>Shop</Link>
          {menu === "Shop" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Computer"); closeMobileMenu(); }}>
          <Link to='/computer' style={{textDecoration: 'none', color: 'black'}}>Computer</Link>
          {menu === "Computer" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Electronics"); closeMobileMenu(); }}>
          <Link to='/electronics' style={{textDecoration: 'none', color: 'black'}}>Electronics</Link>
          {menu === "Electronics" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Fashion"); closeMobileMenu(); }}>
          <Link to='/fashion' style={{textDecoration: 'none', color: 'black'}}>Fashion</Link>
          {menu === "Fashion" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Lifestyle"); closeMobileMenu(); }}>
          <Link to='/lifestyle' style={{textDecoration: 'none', color: 'black'}}>Lifestyle</Link>
          {menu === "Lifestyle" ? <hr /> : null}
        </li>
        <li onClick={() => { setMenu("Vehicle Accessories"); closeMobileMenu(); }}>
          <Link to='/vehicle' style={{textDecoration: 'none', color: 'black'}}>Vehicle Accessories</Link>
          {menu === "Vehicle Accessories" ? <hr /> : null}
        </li>
      </ul>

      {/* Search, login, cart */}
      <div className="nav-login-cart">
        <div className="search-container" ref={searchRef}>
          {showSearch ? (
            <div className="search-wrapper">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="search-submit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </button>
              </form>
              {showSuggestions && (
                <div className="search-suggestions">
                  {searchSuggestions.map(product => (
                    <div 
                      key={product.id} 
                      className="suggestion-item"
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setShowSearch(false);
                        setShowSuggestions(false);
                      }}
                    >
                      <img src={product.image} alt={product.name} className="suggestion-image" />
                      <div className="suggestion-details">
                        <p className="suggestion-name">{product.name}</p>
                        <p className="suggestion-price">${product.new_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button 
              className="search-toggle" 
              onClick={toggleSearch}
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          )}
        </div>
        
        {isLoggedIn ? (
          <button onClick={handleLogoutClick}>Logout</button>
        ) : (
          <Link to='/login'><button>Login</button></Link>
        )}
        
        <Link to='/cart'>
          <img src={cart_icon} alt='cart icon' />
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;