const customerService = require("../services/customerService");

// getting customers from commercetools
async function getCustomers(req, res) {
  try {
    const customers = await customerService.fetchCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers" });
  }
}

// Adding customers to commercetools
async function addCustomer(req, res) {
  try {
    const customerData = {
      email: req.body.email,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      password: req.body.password,
    };
    const newCustomer = await customerService.createCustomer(customerData);
    // console.log("response from create customer", newCustomer.statusCode);
    if ((newCustomer.statusCode = 201)) {
      res.status(201).json({
        success: true,
        message: "Customer Added Successfully",
      });
    }
    else{
      res.status(400).json({message: "something went wrong. Please try again"})
    }
  } catch (error) {
    res.status(400).json({ error: "Customer with this email already exists." });
  }
}

module.exports = {
  getCustomers,
  addCustomer,
};
