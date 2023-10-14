console.log("Server started");
const express = require("express");
const app = express();
const router = require("./router");

// MonGoDB connect
const db = require("./server").db();
const mongodb = require("mongodb");

//1 Entry codes
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//2 Session codes

//3 View codes
app.set("views", "views");
app.set("view engine", "ejs");

//4 Routing codes - BSSR
app.use("/", router);

module.exports = app;
