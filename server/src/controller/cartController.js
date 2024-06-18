const cartService = require("../services/cartService");

const updateCartItems = require("../services/cartService");

const createCart = require("../services/cartService");
const { deleteCart } = require("../services/cartService");




// get cart details of customer
async function getCartDetails(req, res) {
  try {
    const customerId = req.query.customerId;
    const cartdetails = await cartService.fetchCartDetails(customerId);
    res.json(cartdetails);
    storedCartId = cartdetails.id;
    storedCartVersion = cartdetails.version;
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// update cart details of customer
async function updateCartDetails(req, res) {
  const { customerId, productId } = req.body;
  try {
    const cartData = await cartService.fetchCartDetails(customerId);
    const { id: cartId, version: cartVersion } = cartData;

    await cartService.updateCart(cartId, cartVersion, productId);
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.log("................");
    console.log(error)
    if (error.statusCode === 404) {
      try {
        const newCart = await cartService.createCart(customerId);
        if (newCart && newCart.body) {
          const { id: cartId, version: cartVersion } = newCart.body;
          await cartService.updateCart(
            cartId,
            cartVersion,
            productId
            
          );
          res.status(200).json({ message: "Item added to cart" });
        } else {
          res.status(500).json({ error: "Failed to create new cart" });
        }
      } catch (creationError) {
        res.status(500).json({ error: "Failed to create new cart" });
      }
    } else {
      res
        .status(500)
        .json({ error: "Something went wrong while updating cart details" });
    }
  }
}

// check for existing cart - not in action
async function checkCartExists(req, res) {
  const customerId = req.body.customerId;
  try {
    const cartData = await cartService.fetchCartDetails(customerId);
  } catch (error) {}
}


// Check coupon code
async function checkCoupon(req, res) {
  const { coupon: couponCode, customerId, grandTotal: total } = req.body;

  try {
    // const voucher = await voucherifyClient.vouchers.get(couponCode);
    const response = await voucherifyClient.redemptions.redeem(couponCode, {
      customer: { id: customerId },
      order: { amount: parseInt(total) * 100 }, //converting into cents
    });
    const orderData = response.order;
    // const { total_applied_discount_amount: discountedAmount, total_amount: totalAmountToBePaid } = orderData;
    const discountedAmount = response.order.total_applied_discount_amount / 100; // Convert from cents to dollars
    const totalAmountToBePaid = response.order.total_amount / 100;
    res.json({ discountedAmount, totalAmountToBePaid });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

// delete the cart
const deleteCartController = async (req, res) => {
  try {
    await deleteCart(storedCartId, storedCartVersion);
    res.status(200).json({ message: "Cart deleted successfully" });
    storedCartId = null;
    storedCartVersion = null;
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCartDetails,
  updateCartDetails,
  checkCartExists,
  checkCoupon,
  deleteCartController,
};
