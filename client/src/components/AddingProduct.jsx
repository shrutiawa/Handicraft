import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    console.log("product",productData)

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
    <>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category</label>
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
        <br /><br />
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
        <br /><br />
        <label htmlFor="productName">Name</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <br /><br />
        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />
        <label htmlFor="color">Color</label>
        <input
          type="text"
          id="color"
          name="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <br /><br />
        <label htmlFor="size">Size</label>
        <input
          type="text"
          id="size"
          name="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <br /><br />
        <label htmlFor="size">Material Used</label>
        <input
          type="text"
          id="material"
          name="material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        />
        <br /><br />
        <label htmlFor="imageUrl">Upload Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <br /><br />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddingProduct;
