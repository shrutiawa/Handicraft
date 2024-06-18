const client = require("../middleware/commercetools");

// fetching customers from commercetools
async function fetchCustomers() {
  try {
    const response = await client.execute({
      method: "GET",
      uri: "/repurpose/customers",
    });
    return response.body.results;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

// creating Customers
async function createCustomer(customerData) {
  try {
    const response = await client.execute({
      method: "POST",
      uri: "/repurpose/customers",
      body: customerData,
    });
    // console.log(response);
    return response;
  } catch (error) {
    // console.error("Error Adding customer:", error);
    throw error;
  }
}

module.exports = {
  fetchCustomers,
  createCustomer,
};
