import React, { useState } from "react";
import "../styles/shippingAddressForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ShippingAddressForm() {
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        address: "",
        country: "IN",
        zipcode: "",
        city: "",
        state: ""
    });

    const [showPaymentMethod, setShowPaymentMethod] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const submitForm = async () => {
        try {
            const response = await fetch("http://localhost:5000/shipping-address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log("Address submitted:", result);

            if (response.ok) {
                toast.success("Address added successfully!");
                setFormData({
                    title: "",
                    firstName: "",
                    lastName: "",
                    address: "",
                    country: "",
                    zipcode: "",
                    city: "",
                    state: ""
                });
                setShowPaymentMethod(true);
            } else {
                toast.error("Failed to add address. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting address:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <div className="container">
                <h1>Shipping Address</h1>
                <p>Please enter your shipping details.</p>
                <hr />
                <div className="form">
                    <div className="fields fields--2">
                        <label className="field">
                            <p className="field__label" htmlFor="title">Title</p>
                            <input className="field__input" type="text" id="title" value={formData.title} onChange={handleChange} />
                        </label>
                        <br />
                        <label className="field">
                            <p className="field__label" htmlFor="firstName">First name</p>
                            <input className="field__input" type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
                        </label>
                        <label className="field">
                            <p className="field__label" htmlFor="lastName">Last name</p>
                            <input className="field__input" type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
                        </label>
                    </div>
                    <label className="field">
                        <p className="field__label" htmlFor="address">Address</p>
                        <input className="field__input" type="text" id="address" value={formData.address} onChange={handleChange} />
                    </label>
                    <label className="field">
                        <p className="field__label" htmlFor="country">Country</p>
                        <select className="field__input" id="country" value={formData.country} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="IN">India</option>
                        </select>
                    </label>
                    <div className="fields fields--3">
                        <label className="field">
                            <p className="field__label" htmlFor="zipcode">Zip code</p>
                            <input className="field__input" type="text" id="zipcode" value={formData.zipcode} onChange={handleChange} />
                        </label>
                        <label className="field">
                            <p className="field__label" htmlFor="city">City</p>
                            <input className="field__input" type="text" id="city" value={formData.city} onChange={handleChange} />
                        </label>
                        <label className="field">
                            <p className="field__label" htmlFor="state">State</p>
                            <select className="field__input" id="state" value={formData.state} onChange={handleChange}>
                            <option value=""></option>
                            <option value="karnataka">Karnataka</option>
                            </select>
                        </label>
                    </div>
                </div>
                <hr />
                <button className="button" onClick={submitForm}>Continue</button>
            </div>

            <ToastContainer />

            {showPaymentMethod && (
                <div className="payment-methods">
                    <h3>Payment Methods</h3>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                        />
                        &nbsp;Cash on Delivery (COD)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                        />
                        &nbsp;Card
                    </label>
                    <button className="button">Pay Now</button>
                </div>
            )}
        </>
    );
}

export default ShippingAddressForm;
