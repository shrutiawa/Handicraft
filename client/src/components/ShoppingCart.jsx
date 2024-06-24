import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/shoppingCart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faArrowDown, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import ShippingAddressForm from "./ShippingAddressForm";
import { ToastContainer, toast } from "react-toastify";

function ShoppingCart() {
  const customerId = localStorage.getItem("customer");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [showShippingAddress, setShowShippingAddress] = useState(false);
  const [totalItems, setTotalItems] = useState(0); 

  useEffect(() => {
    const customerId = localStorage.getItem("customer");

    const getAllEntries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/carts?customerId=${customerId}`
        );
        const productsInCart = response.data.lineItems;
        const updatedProducts = productsInCart.map((item) => {
          const productId = item.productId;
          const productName = item.name["en-US"];
          const productPrice = item.price.value.centAmount;
          const productImage = item.variant.images[0]?.url;
          const quantity = item.quantity;

          // Extracting attributes
          const attributes = {};
          item.variant.attributes.forEach((attr) => {
            attributes[attr.name] = attr.value["en-US"];
          });

          const { Color: color = "N/A", Size: size = "N/A", Material: material = "N/A" } = attributes;

          return {
            id: productId,
            name: productName,
            price: productPrice,
            imageUrl: productImage,
            quantity: quantity,
            color: color,
            size: size,
            material: material,
          };
        });

        setProducts(updatedProducts);
       

        // Calculate total number of items in cart
        const productsCart = response.data.lineItems;

        // Extract unique product IDs
        const uniqueProductIds = [...new Set(productsCart.map(item => item.productId))];
        setTotalItems(uniqueProductIds.length);

      } catch (error) {
        console.error("Error fetching entries:", error);
        
      }
    };

    if (customerId) {
      getAllEntries();
    } 
  }, []);

  const handleIncrease = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId && product.quantity < 5) {
        return {
          ...product,
          quantity: product.quantity + 1,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const handleDecrease = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId && product.quantity > 1) {
        return {
          ...product,
          quantity: product.quantity - 1,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
  };


  const calculateSubtotal = () => {
    return products
      .reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      )
      
  };

  const toggleShippingAddress = () => {
    setShowShippingAddress((prev) => !prev);
  };
  const handleCheckout = () => {
    if (!showShippingAddress) {
      toast.info("Please add the shipping address.");
      setShowShippingAddress(true);
    } 
  };

  return (
    <div className="cartMainContainer">
      <div className="shopping-cart-title">
      
    
      </div>
      {products.length === 0 ? (
        <p>Your shopping cart is empty.</p>
      ) : (
        <>
          <div className="shopping-cart">
          
            <section className="itemsInCart">
            <h1>Shopping Cart</h1>
              <div className="column-labels">
                <label className="product-image">Image</label>
                <label className="product-details">Product</label>
                <label className="product-price">Price</label>
                <label className="product-quantity">Quantity</label>
                <label className="product-line-price">Total</label>
              </div>

              {products.map((product) => (
                <div className="product" key={product.id}>
                  <div className="product-image">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>Color: {product.color}</p>
                    <p>Size: {product.size}</p>
                    <p>Material: {product.material}</p>
                  </div>
                  <div className="product-price">{product.price}</div>
                  <div className="product-quantity">
                    <button
                      className="quantity-button1 minus"
                      onClick={() => handleDecrease(product.id)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span >{product.quantity}</span>
                    <button
                      className="quantity-button1 plus"
                      onClick={() => handleIncrease(product.id)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <div className="product-line-price">
                    {(product.price * product.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </section>

              
            <section className="summary">
            <h1>Order Summary</h1>
              <div className="totals">
                <div className="totals-item">
                  <label>Items</label>
                  <div className="totals-item-value">{totalItems}</div>
                </div>
                <div className="totals-item">
                  <label>Subtotal</label>
                  <div className="totals-value">{calculateSubtotal()}</div>
                </div>
                <div className="totals-item">
                  <label>Tax (0%)</label>
                  <div className="totals-value">00.00</div>
                </div>
                <div className="totals-item">
                  <label>Shipping</label>
                  <div className="totals-value">00.00</div>
                </div>
                <div className="totals-item totals-item-total">
                  <label>Grand Total</label>
                  <div className="totals-value">{calculateSubtotal()}</div>
                </div>

              </div>
              <button className="checkout" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </section>
          </div>
            <div className="shipping-address">
            <button className="toggle-address" onClick={toggleShippingAddress}>
            Shipping Address <FontAwesomeIcon icon={faAngleDown} /> 
            </button>
        
            {showShippingAddress && (
              <ShippingAddressForm products={products}/>
            )}
              </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default ShoppingCart;
