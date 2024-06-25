import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderConformation = () => {
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
      <div className="confirm-container">
        <h2 className="confirm">Order Confirmed!</h2>
        <p className="confirm-para">Your order is placed!</p>
        <p className="confirm-para">Thank You for shopping with Us</p>
        <button className="home-button" onClick={handleGoToHomePage}>
          OK
        </button>
      </div>
    </>
  );
};

export default OrderConformation;
