const express = require("express");
const router_bssr = express.Router();
const restaurantController = require("./controllers/restaurantController");

/********************************
 *            BSSR EJS         *
 * ******************************/

// member related routers (methods)
router_bssr
  .get("/signup", restaurantController.getSignupMyRestaurant)
  .post("/signup", restaurantController.signupProcess);

router_bssr
  .get("/login", restaurantController.getLoginMyRestaurant)
  .post("/login", restaurantController.loginProcess);

router_bssr.get("/logout", restaurantController.logout);

// other routers (methods)

module.exports = router_bssr;
