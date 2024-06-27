import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orderConfirmation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleGoToHomePage = () => {
    navigate("/");
  };

  const fetchCartDetails = async () => {
    try {
      const customerId = localStorage.getItem("customer");
      const cartResponse = await axios.get(
        `http://localhost:5000/carts?customerId=${customerId}`
      );

      if (cartResponse.status !== 200) {
        throw new Error("Failed to fetch cart details");
      }

      const cartDetails = cartResponse.data;

      console.log("Cart details fetched:", cartDetails);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const placeOrder = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:5000/create-order"
      );

      if (orderResponse.status !== 200) {
        throw new Error("Failed to place order");
      }

      const orderData = orderResponse.data;
      console.log("Order placed successfully:", orderData);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const deleteCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/carts", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cart");
      }
      const data = await response.json();
      console.log("Cart deletion response:", data);
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  useEffect(() => {
    const processOrder = async () => {
      try {
        await fetchCartDetails();
        await placeOrder();
        console.log("Order placed, now fetching cart details again...");
        await fetchCartDetails();
        console.log("Cart details fetched again, now deleting cart...");
        await deleteCart();
        console.log("Cart deleted .");
      } catch (error) {
        console.error("Error in processOrder:", error);
      }
    };
    processOrder();
  }, []);

  return (
    <>
      <div className="OrderConfirmationPage">
        <h1>Checkout</h1>
        <div className="mainbox">
          <span>
            <FontAwesomeIcon className="fa-icon" icon={faCheckCircle} />
          </span>
          <div className="firstbox">
            <p className="order-text">Order Confirmed</p>
            <h2>Thank you Sir</h2>
          </div>
          
          <div className="clear"></div>

          <div className="orderUpdates">
            <h2>Order Updates</h2>
            <p className="text-style">
              You will receive order and shipping updates via email
            </p>
          </div>
          {/* <div className="blank-space"></div> */}
          <div className="table-content">
            <div className="inside-content">
              <p className="info-q">
                <strong>Contact</strong>
              </p>
              <p>ykphogat21@gmail.com</p>
            </div>
            <div className="inside-content">
              <p className="info-q">
                <strong>Address</strong>
              </p>
              <div className="paras-for-add">
                <p>Address </p>
                {/* <p> {address2} </p> */}
              </div>
            </div>
            <div className="inside-content">
              <p className="info-q">
                <strong>Payment</strong>
              </p>
              <p>Check Payments</p>
            </div>

            {/* <button onClick={pushValueIntoArray}>Submit</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
