const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("Welcome to The Home Page");
});

router.get("/menu", (req, res) => {
  res.send("Welcome to Menu Page");
});

router.get("/community", (req, res) => {
  res.send("Welcome to Community Page");
});

module.exports = router;
