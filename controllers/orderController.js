const Order = require("../models/Order.js");
// function is an asynchronous route handler in a Node.js application for creating an order.

let orderController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");

orderController.createOrder = async (req, res) => {
  // It is designed to create a new order.
  try {
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);
    // It first asserts that the req.member exists, using the assert.ok method with a custom error message

    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);
    // If the assertion passes, it creates a new Order instance and calls createOrderData with req.member and req.body as arguments to create an order.

    res.json({ state: "success", data: result }); // The result is then sent back in a JSON response.
  } catch (err) {
    console.log(`ERROR, cont/createOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

orderController.getMyOrders = async (req, res) => {
  // It retrieves a member's order data and responds with the results.
  try {
    console.log("POST: cont/getMyOrders");
    assert.ok(req.member, Definer.auth_err5);

    // uses an Order instance to call getMyOrdersData with req.member and req.query as arguments,
    const order = new Order();
    // console.log("req.query::::::::", req.query);
    const result = await order.getMyOrdersData(req.member, req.query);
    res.json({ state: "success", data: result });
    // then sends the results in a JSON response.
  } catch (err) {
    console.log(`ERROR, cont/getMyOrders, ${err.message}`);
    res.json({ state: "fail", message: err.message });
    // If an error occurs, it logs the error message and sends a response indicating failure with the error message.
  }
};

orderController.editChosenOrder = async (req, res) => {
  try {
    console.log("POST: cont/editChosenOrder");
    assert.ok(req.member, Definer.auth_err5);
    // console.log("req.body:::", req.body.order_status);

    const order = new Order();
    const result = await order.editChosenOrderData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/editChosenOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
