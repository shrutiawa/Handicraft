const paymentService = require('../services/paymentService');

const createCheckoutSession = async (req, res) => {
  try {
    const { carts,couponId,coupon, discountedAmount  } = req.body;
    console.log("heeloo srtiyo",{carts,couponId,coupon, discountedAmount })
    let couponCode;
    if (coupon && discountedAmount) {
      couponCode = await paymentService.createCoupon(coupon, discountedAmount);
    }
    const sessionId = await paymentService.createCheckoutSession(carts, couponCode ? couponCode.id : null );
    res.json({ id: sessionId });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

const createCouponStripe = async (req, res) => {
  try {
    const { coupon, discountedAmount } = req.body;
    const couponCode = await paymentService.createCoupon(coupon, discountedAmount);
    res.status(200).json({ couponId: couponCode.id });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createCheckoutSession,
  createCouponStripe
};
