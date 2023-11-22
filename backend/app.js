const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes")
const User = require('../backend/models/user')
const customorder = require("./routes/customorderRoutes")

const bodyParser = require("body-parser");
const cors= require("cors")

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:["https://energycasting.netlify.app","http://localhost:5173"],
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
app.use("/api/order",order);
app.use("/api/customorder", customorder);
//user seed





const seedUsers = async () => {
  try {
    await User.deleteMany(); // Clear existing users (optional)

    const createdUsers = await User.create(Data);
    console.log('Users seeded:', createdUsers);
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    process.exit(); // Terminate the script after seeding
  }
};

// it's for ErrorHandling


module.exports = app;