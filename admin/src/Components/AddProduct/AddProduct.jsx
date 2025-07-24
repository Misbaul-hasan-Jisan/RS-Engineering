import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
const API = import.meta.env.VITE_API_BASE_URL;

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "lifestyle",
        new_price: "",
        old_price: "",
        description: "" // Added description field
    });
    const [isLoading, setIsLoading] = useState(false);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({
            ...prev,
            [name]: name.includes('price') ? parseFloat(value) || 0 : value
        }));
    };

    const Add_Product = async () => {
        // Validate required fields (added description to validation)
        if (!productDetails.name || !productDetails.new_price || 
            !productDetails.old_price || !image || !productDetails.description) {
            alert("Please fill all fields including the image and description");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Upload image
            const formData = new FormData();
            formData.append('product', image);
            
            const uploadRes = await fetch(`${API}/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!uploadRes.ok) throw new Error("Image upload failed");
            
            const uploadData = await uploadRes.json();

            // 2. Add product
            const product = {
                ...productDetails,
                image: uploadData.image_url
            };

            const addRes = await fetch(`${API}/add-product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            
            if (!addRes.ok) throw new Error("Product addition failed");
            
            const addData = await addRes.json();

            if (addData.success) {
                alert("Product Added Successfully");
                window.location.replace('/list-product');
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Failed to add product: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='add-product'>
            <div className="add-product-itemfield">
                <p>Product Title</p>
                <input 
                    value={productDetails.name} 
                    onChange={changeHandler} 
                    type="text" 
                    name='name' 
                    placeholder='Type here' 
                    required
                />
            </div>
            
            {/* Added description field */}
            <div className="add-product-itemfield">
                <p>Product Description</p>
                <textarea 
                    value={productDetails.description} 
                    onChange={changeHandler} 
                    name="description" 
                    placeholder='Enter product description'
                    rows="4"
                    required
                />
            </div>
            
            <div className="add-product-price">
                <div className="add-product-itemfield">
                    <p>Price ($)</p>
                    <input 
                        value={productDetails.old_price} 
                        onChange={changeHandler} 
                        type="number" 
                        name="old_price" 
                        placeholder='Original price'
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div className="add-product-itemfield">
                    <p>Offer Price ($)</p>
                    <input 
                        value={productDetails.new_price} 
                        onChange={changeHandler} 
                        type="number" 
                        name="new_price" 
                        placeholder='Discounted price'
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>
            <div className="add-product-itemfield">
                <p>Product Category</p>
                <select 
                    value={productDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className='add-product-selector'
                    required
                >
                    <option value="lifestyle">Lifestyle</option>
                    <option value="computer">Computer</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="vehicle">Vehicle Accessories</option>
                </select>
            </div>
            <div className="add-product-itemfield">
                <label htmlFor="file-input">
                    <img 
                        src={image ? URL.createObjectURL(image) : upload_area} 
                        className='add-product-thumbnail-img' 
                        alt="Product preview" 
                    />
                </label>
                <input 
                    onChange={imageHandler} 
                    type="file" 
                    name='product' 
                    id='file-input' 
                    hidden 
                    accept="image/*"
                    required
                />
            </div>
            <button 
                onClick={Add_Product} 
                className='add-product-btn'
                disabled={isLoading}
            >
                {isLoading ? 'Adding...' : 'Add Product'}
            </button>
        </div>
    );
};

export default AddProduct;