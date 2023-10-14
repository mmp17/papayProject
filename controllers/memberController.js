let memberController = module.exports;

memberController.home = (req, res) => {
  console.log("GET controller.home requested");
  res.send("Welcome to Home Page");
};

memberController.signup = (req, res) => {
  console.log("POST controller.signup requested");
  res.send("Welcome to signup page");
};

memberController.login = (req, res) => {
  console.log("POST controller.login requested");
  res.send("Welcome to login page");
};

memberController.logout = (req, res) => {
  console.log("GET controller.logout requested");
  res.send("Welcome to logout page");
};
