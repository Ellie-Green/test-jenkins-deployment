const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/default.config.js");
const todoRoutes = require("./src/routes/todo.routes.js");

// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", function (err) {
  console.log(`Could not connect to the database: ${err}`);
  process.exit();
});
mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database");
});

//app.get("/k8s-default-todoapi-d9e96b13b3-49ada706f8b023c2.elb.eu-west-2.amazonaws.com", (req, res) => {
    //res.send("Hello");
//});
app.use("/api/todos", todoRoutes);

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});
