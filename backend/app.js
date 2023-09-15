const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes")
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

 
app.get('/', (req, res) => {
  res.send('hello world')
})


app.use("/api/user", user);
app.use("/api",order);


// it's for ErrorHandling


module.exports = app;