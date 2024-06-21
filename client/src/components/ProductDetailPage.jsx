import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/productDetail.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from "./header";
import Footer from "./footer";

function ProductDetailPage() {
  const location = useLocation();
  const { hit } = location.state || {};
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const productId = hit.productID
  if (!hit) {
    return <div>Product details not available</div>;
  }
  const addToCart = async () => {
    const customerId = "d0e515a9-7da8-49f2-ae89-db5200127fb4"

    // if (!customerId) {
    //   alert("Customer not found . Please log in.");
    //   return;
    // }
    try {
      console.log("data",customerId, productId, quantity)
      const response = await axios.post("http://localhost:5000/carts", {
        customerId,
        productId,
        quantity
      });
      console.log(response.data);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <>
    <Header/>
    <div className="pdp-container">
      <div className="card">
        <div className="left-imgs">
          <img src={hit.images} alt="product images" className="main-img" />

        </div>
        <div className="right-text">
          <span className="heading-secondary">{hit.productType}</span>
          <h1 className="heading-primary">{hit.name["en-US"]}</h1>
          <p>{hit.description["en-US"]}</p>
          <hr />
          <div className="product-specification">
            <div>
              <h4>Color : </h4>
              <p> {hit.attributes.Color["en-US"]}</p>
            </div>
            <div>
              <h4>Size :</h4>
              <p> {hit.attributes.Size["en-US"]}</p>
            </div>
            <div>
              <h4>Material Used :</h4>
              <p> {hit.attributes.Material["en-US"]}</p>
            </div>
          </div>
          <hr />
          <div className="price-button">
            <h2 className="price-discount">₹ {hit.prices["INR"].max}</h2>
            <p style={{color:"green"}}>inclusive of all taxes</p>
            <div className="buttons">
              <div className="quantity-button-container">
                <button className="quantity-button minus" onClick={handleDecrease}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button className="quantity-button plus" onClick={handleIncrease}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <button onClick={addToCart} className="cart-button"><FontAwesomeIcon icon={faCartShopping}/> ADD TO CART</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ProductDetailPage;
