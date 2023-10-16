let memberController = module.exports;
const Member = require("../models/Member");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: controller.signup requested");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);
    res.json({ state: "succeed", data: new_member });
  } catch (error) {
    console.log(`Error, controller/signup ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.login = (req, res) => {
  console.log("POST controller.login requested");
  res.send("Welcome to login page");
};

memberController.logout = (req, res) => {
  console.log("GET controller.logout requested");
  res.send("Welcome to logout page");
};
