import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../context/ShopContext';
import DescriptionBox from '../DescriptionBox/DescriptionBox';

function ProductDisplay({ product }) {
    const { addToCart } = useContext(ShopContext);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImage, setMainImage] = useState(product.image);
    const [quantity, setQuantity] = useState(1);
    const [showSizeError, setShowSizeError] = useState(false);

    // Sample product images array
    const productImages = Array(4).fill(product.image);

    // Check if product is in fashion category
    const isFashionProduct = product.category === 'fashion';

    const handleSizeSelection = (size) => {
        setSelectedSize(size);
        setShowSizeError(false);
    };

    const handleAddToCart = () => {
        if (isFashionProduct && !selectedSize) {
            setShowSizeError(true);
            return;
        }
        addToCart(product.id, isFashionProduct ? selectedSize : 'One Size', quantity);
    };

    const renderStars = (rating, isInteractive = false, onClickHandler = null) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={`star-${i}`}
                    onClick={isInteractive ? () => onClickHandler(i) : null}
                    style={{ 
                        cursor: isInteractive ? 'pointer' : 'default',
                        marginRight: '4px' // Added spacing between stars
                    }}
                >
                    {i <= fullStars ? (
                        <img src={star_icon} alt="Full star" width="20" height="20" />
                    ) : (
                        <img src={star_dull_icon} alt="Empty star" width="20" height="20" />
                    )}
                </span>
            );
        }
        
        return <div className="rating-stars">{stars}</div>;
    };

    return (
        <div className='product-display'>
            {/* LEFT SIDE - IMAGE GALLERY */}
            <div className='product-display-left'>
                <div className="product-display-img-list">
                    {productImages.map((img, index) => (
                        <img 
                            key={index}
                            src={img}
                            alt={`Product view ${index + 1}`}
                            onClick={() => setMainImage(img)}
                            className={mainImage === img ? 'active-thumbnail' : ''}
                        />
                    ))}
                </div>
                <div className="product-display-main-img">
                    <img 
                        src={mainImage} 
                        alt={product.name} 
                        loading="lazy"
                    />
                </div>
            </div>
            {/* RIGHT SIDE - PRODUCT INFO */}
            <div className='product-display-right'>
                <h1>{product.name}</h1>
                
                <div className="product-display-rating">
                    {renderStars(product.rating || 4)} {/* Fixed: Pass the product rating */}
                    <p>({product.reviews || 122})</p>
                </div>
                
                <div className='product-display-prices'>
                    {product.old_price && (
                        <div className="product-display-oldprice">
                            ${product.old_price}
                        </div>
                    )}
                    <div className="product-display-newprice">
                        ${product.new_price}
                    </div>
                    {product.discount && (
                        <span className="discount-badge">
                            Save {product.discount}%
                        </span>
                    )}
                </div>
                
                <div className="product-display-description">
                    {product.description || "Premium quality product with modern design and comfortable fit."}
                </div>
                
                {/* Size selection - only for fashion products */}
                {isFashionProduct && (
                    <div className="product-display-right-size">
                        <h2>Select Size {showSizeError && <span className="size-error">* Please select a size</span>}</h2>
                        <div className="product-display-size-options">
                            {product.sizes?.length > 0 ? (
                                product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => handleSizeSelection(size)}
                                        aria-label={`Size ${size}`}
                                    >
                                        {size}
                                    </button>
                                ))
                            ) : (
                                ['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <button
                                        key={size}
                                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => handleSizeSelection(size)}
                                        aria-label={`Size ${size}`}
                                    >
                                        {size}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
                
                <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                
                <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={isFashionProduct && !selectedSize}
                >
                    ADD TO CART
                </button>
                
                <div className="product-meta">
                    <p><span>Category:</span> {product.category || 'Women'}</p>
                    <p><span>Tags:</span> {product.tags?.join(', ') || 'Latest, Popular, Premium'}</p>
                </div>
                <div className="des-rev"><DescriptionBox productId={product.id} productDescription={product.description} /></div>
            </div>
        </div>
    );
}

export default ProductDisplay;