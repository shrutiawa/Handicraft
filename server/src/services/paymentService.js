const stripe = require("stripe")("sk_test_51PJr9WSFTGzovtjLlmIlzOd6qec8FN49zBRylj51LUYxOkpnY4vE9gBP2Qr9Ee2mE6yKldRlh2gsYWFO1Tzhq52000ndogEHwv")

const createCheckoutSession = async (carts,totalAmount) => {
  const totalInCents = Math.round(totalAmount * 100);
  const lineItems = carts.map((product) => ({
    
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
        description: product.description,
        images: [product.imageUrl],
      },
      unit_amount: product.price*100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:3000/order-confirm',
    cancel_url: 'http://localhost:3000/cancel'
  });

  return session.id;
};

module.exports = {
  createCheckoutSession,
};
