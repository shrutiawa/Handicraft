import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistoryPage = () => {
    const [customerId, setCustomerId] = useState('');
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const storedCustomerId = localStorage.getItem('customer');
        if (storedCustomerId) {
            setCustomerId(storedCustomerId);
            fetchOrderHistory(storedCustomerId);
        }
    }, []);

    const fetchOrderHistory = (customerId) => {
        axios.get(`http://localhost:5000/orders/${customerId}`)
            .then((response) => {
                const orderData = response.data.order;
                console.log("Response:", orderData);
                setOrderHistory(orderData); // Assuming response.data contains multiple orders
            })
            .catch((error) => {
                console.error("Error fetching order history:", error);
            });
    };

    return (
        <div className="App">
            <h1>Customer Order History</h1>
            <div className="order-history">
                {orderHistory.length > 0 ? (
                    orderHistory.map((order, orderIndex) => (
                        <div key={orderIndex} className="order">
                            <h2>Order #{orderIndex + 1}</h2>
                            {order.lineItems.length > 0 ? (
                                order.lineItems.map((lineItem, lineIndex) => (
                                    <div key={lineIndex} className="line-item">
                                        <h3>{lineItem.name["en-US"]}</h3>
                                        <p>Description: {lineItem.description}</p>
                                        <p>Quantity: {lineItem.quantity}</p>
                                        <p>Total Price: {lineItem.totalPrice.centAmount} {lineItem.totalPrice.currencyCode}</p>
                                        {lineItem.variant.images && <img src={lineItem.variant.images[0].url} alt={lineItem.name["en-US"]} />}
                                    </div>
                                ))
                            ) : (
                                <p>No line items found for this order.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No orders found for this customer.</p>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
