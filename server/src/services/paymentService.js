const stripe = require("stripe")("sk_test_51PJr9WSFTGzovtjLlmIlzOd6qec8FN49zBRylj51LUYxOkpnY4vE9gBP2Qr9Ee2mE6yKldRlh2gsYWFO1Tzhq52000ndogEHwv")

const createCheckoutSession = async (carts, couponId) => {
  // console.log("hii this is checkout session", carts, couponId);

  const discounts = couponId ? [{ coupon: couponId }] : [];
  // console.log("this is coupon id", discounts);

  const lineItems = carts.map((product) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: product.name,
        description: product.description,
        images: [product.imageUrl],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      billing_address_collection: 'required',
      discounts: discounts,
      mode: 'payment',
      success_url: 'http://localhost:3000/order-confirm',
      cancel_url: 'http://localhost:3000',
    });

    return session.id;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};


async function createCoupon(coupon, discountedAmount) {
  try {
    const couponCC = await stripe.coupons.create({
      name: coupon,      
      duration: 'once',       
      currency: 'inr',        
      amount_off: discountedAmount*100,    
    });
    console.log("Hi this is coupon",couponCC);
    return couponCC
  } catch (error) {
    console.error("Hi error",error);
  }
}


module.exports = {
  createCheckoutSession,
  createCoupon
};
