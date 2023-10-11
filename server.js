const http = require("http");
const mongodb = require("mongodb");

let db;
const connectionString =
  "mongodb+srv://user01:X6fRByv7C1oEjwXb@nodejs.i14q1bn.mongodb.net/todolist_test?retryWrites=true&w=majority"; // database name: todolist_test
// 3)
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) console.log(`Error on connecting to MongoDB`);
    else {
      console.log("MongoDB connection succeeded");

      module.exports = client;

      const app = require("./app");

      const server = http.createServer(app);
      let PORT = 3003;
      server.listen(PORT, function () {
        console.log(
          `server is running on port ${PORT}, http://localhost:${PORT}`
        );
      });
    }
  }
);
