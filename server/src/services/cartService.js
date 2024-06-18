const client = require("../middleware/commercetools");

// fetching carts by customerId -complete
async function fetchCartDetails(customerId) {
  try {
    const response = await client.execute({
      method: "GET",
      uri: `/handicraft/carts/customer-id=${customerId}`,
    });
    console.log("service", response);
    return response.body;
  } catch (error) {
    console.error("Error fetching customers cart details:", error);
    throw error.body;
  }
}

// updating line items in customer carts- not complete
async function updateCart(cartId, cartVersion, productId) {
  // console.log("gggggggggg", cartId, cartVersion, productId, variantId);
  try {
    const response = await client.execute({
      method: "POST",
      uri: `/handicraft/carts/${cartId}`,
      body: {
        version : cartVersion,
        actions : [ {
          action : "addLineItem",
          productId : productId,
          variantId : 1,
          quantity : 1
        } ]
      }
    });
    console.log("service response from update cart", response);
    return response;
  } catch (error) {
    console.error("Cart Error:", error);
    throw error
  }
}

// create cart
async function createCart(customerId) {
  try {
    const newCart = await client.execute({
      method: "POST",
      uri: "/handicraft/carts",
      body: {
        currency: "USD",
        customerId,
      },
    });
    console.log("new cart updated", newCart.body);
    return newCart;
  } catch (error) {
    console.log(error);
  }
}



// delete cart
async function deleteCart(cartId, cartVersion) {
  try {
    const response = await client.execute({
      method: "DELETE",
      uri: `/repurpose/carts/${cartId}?version=${cartVersion}`,
    });
    return response;
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw error;
  }
}


module.exports = {
  fetchCartDetails,
  updateCart,
  createCart,
  deleteCart
};

// if (error.name === "NotFound") {
//   // create new cart for that customer
//   try{
//     const newCart = await client.execute({
//       method: "POST",
//       uri : '/repurpose/carts',
//       body : {currency: "INR", customerId},
//     })
//     console.log("new cart updated",newCart)
//   }
//   catch(error){
//     console.log(error)
//   }
// }
