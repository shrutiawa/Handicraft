const paymentService = require('../services/paymentService');

const createCheckoutSession = async (req, res) => {
  try {
    const { carts,couponId  } = req.body;
    // console.log("heeloo srtiyo",{carts,couponId })
    const sessionId = await paymentService.createCheckoutSession(carts,couponId );
    res.json({ id: sessionId });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

const createCouponStripe = async (req, res) => {
  try {
    const { coupon, discountedAmount } = req.body;
    // console.log("req.body",req.body)
    // console.log("heeloo srtiyo",{carts,discountAmount})
    const couponCode = await paymentService.createCoupon(coupon, discountedAmount);
    // console.log("crate coupom",couponCode)
    res.status(200).json({ couponId: couponCode.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  createCouponStripe
};
