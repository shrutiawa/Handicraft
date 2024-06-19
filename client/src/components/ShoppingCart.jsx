import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/shoppingCart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

function ShoppingCart() {
  const customerId = "d0e515a9-7da8-49f2-ae89-db5200127fb4";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllEntries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/carts?customerId=${customerId}`
        );
        const productsInCart = response.data.lineItems;

        // Map over each product in the cart and extract necessary details
        const updatedProducts = productsInCart.map((item) => {
          const productId = item.productId;
          const productName = item.name["en-US"];
          const productPrice = item.price.value.centAmount; // Convert price from cents to dollars
          const productImage = item.variant.images[0]?.url; // Add a null check for the image
          const quantity = item.quantity;

          // Extracting attributes
          const attributes = item.variant.attributes.reduce((acc, attr) => {
            acc[attr.name] = attr.value["en-US"];
            return acc;
          }, {});

          const color = attributes["Color"] || "N/A";
          const size = attributes["Size"] || "N/A";
          const material = attributes["Material"] || "N/A";

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
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    getAllEntries();
  }, [customerId]);

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
      .toFixed(2);
  };

  return (
    <div className="cartMainContainer">
      <h1>Shopping Cart</h1>
      {products.length === 0 ? (
        <p>Your shopping cart is empty.</p>
      ) : (
        <>
          <div className="shopping-cart">
            <section className="itemsInCart">
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
              <div className="totals">
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

                <div className="payment-methods">
                  <h3>Payment Methods</h3>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      //   onChange={handlePaymentMethodChange}
                      //   checked={paymentMethod === "cod"}
                    />
                    &nbsp; Cash on Delivery (COD)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      //   onChange={handlePaymentMethodChange}
                      //   checked={paymentMethod === "card"}
                    />
                    &nbsp; Card
                  </label>
                </div>
              </div>
              <button className="checkout" onClick={() => navigate("/delivery-address")}>
                Checkout
              </button>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;
