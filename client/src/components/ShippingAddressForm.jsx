import React, { useState } from "react";
import "../styles/shippingAddressForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";


function ShippingAddressForm({products}) {
   

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

    const [submittedAddress, setSubmittedAddress] = useState(null);
    const [step, setStep] = useState(0); 
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };
    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };
    const validateForm = () => {
        return (
            formData.title !== "" &&
            formData.firstName !== "" &&
            formData.lastName !== "" &&
            formData.address !== "" &&
            formData.country !== "" &&
            formData.zipcode !== "" &&
            formData.city !== "" &&
            formData.state !== ""
        );
    };

    const submitForm = async (e) => {
        
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            // console.log(formData)
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
                setSubmittedAddress(formData); 
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
                setStep(1);
            } else {
                toast.error("Failed to add address. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting address:", error);
            toast.error("An error occurred. Please try again.");
        }
    };
    const handlePayment = async () => {
        if (selectedPaymentMethod === "cod") {
            toast.success("Order placed successfully!");
            window.location.href = "/order-confirm";
        } else if (selectedPaymentMethod === "card") {
            toast.info("Redirecting to Stripe Checkout...");
            await stripeCheckout();
        }
    };

    const stripeCheckout = async () => {
        const stripe = await loadStripe(
            "pk_test_51PJr9WSFTGzovtjLXAC2xrnfnHwraXlko0nqG71xR2DzyQ3vJoIPxqa7qbLRjLejsJk0AFsOXHySjQyBFmCrVeQe00MbUJjkkS"
        );
        const body = {
            carts: products,
        };
        const headers = {
            "Content-Type": "application/json",
        };
        const response = await fetch("http://localhost:5000/api/create-checkout-session", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        const session = await response.json();

        const result = stripe.redirectToCheckout({
            sessionId: session.id,
        });
        if (result.error) {
            console.log(result.error);
        }
    };

    return (
        <>
        {step === 0 && (
            <div className="address-container">
                <p>Please enter your shipping details.</p>
                <hr />
                <div className="form">
                    <div className="fields fields--2">
                        <label className="field">
                            <p className="field__label" htmlFor="title">Salutation</p>
                            <select className="field__input" id="title" value={formData.title} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="Mr">Mr.</option>
                            <option value="Mrs">Mrs.</option>
                            <option value="Ms">Ms.</option>
                        </select>
                        </label>
                        <label className="field">
                            <p className="field__label" htmlFor="firstName">First name</p>
                            <input className="field__input" type="text" id="firstName" value={formData.firstName} onChange={handleChange} required/>
                        </label>
                        <label className="field">
                            <p className="field__label" htmlFor="lastName">Last name</p>
                            <input className="field__input" type="text" id="lastName" value={formData.lastName} onChange={handleChange} required/>
                        </label>
                    </div>
                    <label className="field">
                        <p className="field__label" htmlFor="address">Address</p>
                        <input className="field__input" type="text" id="address" value={formData.address} onChange={handleChange} required/>
                    </label>
                    <label className="field">
                        <p className="field__label" htmlFor="country">Country</p>
                        <select className="field__input" id="country" value={formData.country} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="IN">India</option>
                        </select>
                    </label>
                    <div className="fields fields--3">
                        
                        <label className="field">
                            <p className="field__label" htmlFor="city">City</p>
                            <input className="field__input" type="text" id="city" value={formData.city} onChange={handleChange} required/>
                        </label>
                        <label className="field">
                            <p className="field__label" htmlFor="state">State</p>
                            <select className="field__input" id="state" value={formData.state} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="karnataka">Karnataka</option>
                            </select>
                        </label>
                        <label className="field">
                            <p className="field__label" htmlFor="zipcode">Zip code</p>
                            <input className="field__input" type="text" id="zipcode" value={formData.zipcode} onChange={handleChange} required/>
                        </label>
                    </div>
                <button className="button" onClick={submitForm}>Continue</button>
                </div>
            </div>
)}
            <ToastContainer />

            {step === 1 && (
                <div className="payment-container">
                    <div className="submitted-address">
                        <h3>Delivery Address</h3>
                        <h2>{submittedAddress.title} {submittedAddress.firstName} {submittedAddress.lastName}</h2>
                        <p>{submittedAddress.address}</p>
                        <p>{submittedAddress.city}, {submittedAddress.state} -- {submittedAddress.zipcode}</p>
                        <p>INDIA</p>
                        <li>Pay on delivery available</li>
                    </div>
                    <div className="payment-methods">
                        <h3>Payment Methods</h3>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                onChange={handlePaymentMethodChange}
                            />
                            &nbsp;Cash on Delivery (COD)
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                onChange={handlePaymentMethodChange}
                                defaultChecked
                            />
                            &nbsp;Card
                            <img src="card.png" alt="Visa" className="card-logo" />
                        </label>
                        <button className="btn" onClick={handlePayment}>
                            {selectedPaymentMethod === "cod" ? "Place Order" : "Pay Now"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ShippingAddressForm;
