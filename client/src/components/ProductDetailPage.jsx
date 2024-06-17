import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductDetailPage() {
  const location = useLocation();
  const { hit } = location.state || {}; 
  console.log("hit",hit)
  const navigate = useNavigate();
const productId=hit.productID
  if (!hit) {
    return <div>Product details not available</div>;
  }
  const addToCart = async () => {
    // const customerId = localStorage.getItem("customer");

    // if (!customerId) {
    //   alert("Customer not found . Please log in.");
    //   return;
    // }
    try {
      const response = await axios.post("http://localhost:5000/carts", {
        
        productId,
        
      });
      console.log(response.data);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className="container">
          <div className="card">
            <div className="container-fliud">
              <div className="wrapper row">
                <div className="preview col-md-6">
                  <div className="preview-pic tab-content">
                    <div className="tab-pane active" id="pic-1">
                      <img
                        src={hit.images}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="details col-md-6">
                  <h1 className="product-title">{hit.name["en-US"]}</h1>
                  <p>{hit.productType}</p>
                  <p className="product-description">
                    {hit.description["en-US"]}
                  </p>
                  <h4 className="price">COLOR: </h4>
                  <h4 className="price">
                    Current Price: <span></span>
                  </h4>
                  <h4 className="sizes">Size: </h4>
                  <div className="action">
                    <button
                      className="add-to-cart btn btn-default"
                      type="button"
                      onClick={addToCart}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}

export default ProductDetailPage;
