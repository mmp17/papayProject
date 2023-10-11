const http = require("http");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const connectionString = process.env.MONGO_URL; // database name: Papay; Connection string moved to environment file
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
      let PORT = process.env.PORT || 3003;
      server.listen(PORT, function () {
        console.log(
          `server is running on port ${PORT}, http://localhost:${PORT}`
        );
      });
    }
  }
);
