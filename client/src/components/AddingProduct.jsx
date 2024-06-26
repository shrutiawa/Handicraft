import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../styles/addProductPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';

const AddingProduct = () => {
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProductTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/product-types');
        setProductTypes(response.data);
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };

    fetchCategories();
    fetchProductTypes();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extract base64 data without data URL prefix
        let base64String = reader.result.split(',')[1];
        console.log(base64String)
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const handleDescriptionChange = (value) => {
    setDescription(stripHtmlTags(value));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      categoryId: selectedCategory,
      productTypeId: selectedProductType,
      name: productName,
      price: parseFloat(price),
      color,
      size,
      material,
      imageUrl,
      description
    };
    console.log("product", productData)

    try {
      await axios.post('http://localhost:5000/products', productData);
      // Reset form after successful submission
      setSelectedCategory('');
      setSelectedProductType('');
      setProductName('');
      setPrice('');
      setColor('');
      setSize('');
      setMaterial('');
      setImageUrl('');
      setDescription('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className='add-product-container'>
      <h1>Add Product</h1>
      <div>
        <form className='add-product-form'>
          <div className='add-product-detail'>
            <div className='product-general-detail'>
              <h3>General Information</h3>
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
              <label htmlFor="description">Product Description</label>
              <ReactQuill
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>

            <div className='product-general-detail '>
              <h3>Product Attributes</h3>
              <div className='details'>
                <div className="input-container">
                  <label htmlFor="color">Color</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Black"
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="size">Size</label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="Free"
                  />
                </div>
              </div>
              <label htmlFor="material">Material Used</label>
              <input
                type="text"
                id="material"
                name="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Enter material used "
              />
            </div>
            <div className='product-general-detail'>
              <h3>Category</h3>
              <label htmlFor="category">Product Category</label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <label htmlFor="productType">Product Type</label>
              <select
                id="productType"
                name="productType"
                value={selectedProductType}
                onChange={(e) => setSelectedProductType(e.target.value)}
              >
                <option value="">Select Product Type</option>
                {productTypes.map((productType) => (
                  <option key={productType.id} value={productType.id}>
                    {productType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          

          <div className='add-product-image'>

            <div className='product-general-detail'>
              <h3>Pricing</h3>
              <label htmlFor="price">Price (₹)</label>
              <div className="price-input-container">
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price (₹)"
                />
              </div>
            </div>
            
            <div className='product-general-detail'>
              <h3>Product Media</h3>
              <div className='product-media'>
                <label className="custom-file-upload" htmlFor="imageUrl">
                  <div className="icon">
                    <FontAwesomeIcon icon={faFileUpload} />
                  </div>
                  <div className="text">
                    <span>Click to upload image</span>
                  </div>
               
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <div>OR</div>
                <div className="url-input">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter Image url"

                  />
                  </div>
                  {imageUrl && (
                    <img src={imageUrl} alt="Product" style={{ width: '100px', height: '100px' }} />
                  )}
                </div>
              </div>
            </div>
        </form>
        <button className="btn-submit" onClick={handleSubmit} type="submit">Submit</button>
      </div>
    </div>

  );
};

export default AddingProduct;
