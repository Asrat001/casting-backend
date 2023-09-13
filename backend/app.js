const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors= require("cors")

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));


//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
// import routes
const user = require("./routes/userRoutes");
 

app.use("/api/user", user);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;