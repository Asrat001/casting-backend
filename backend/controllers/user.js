const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("express-async-handler");



// @desc    Register new user
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.cookie('access_token', generateToken(user.id),{maxAge:60*60*24*30*1000}).json({
      _id: user.id,
      email: user.email,
      fullname: user.fullname,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  // Check for user email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User doesn't exists!", 400));
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res
      .cookie("access_token", generateToken(user.id), {
        maxAge: 60 * 60 * 24 * 30 * 1000,
      })
      .json({
        _id: user.id,
        email: user.email,
        fullname: user.fullname,
        token: generateToken(user._id),
      });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});



//Update end user profile
const updateprofile = asyncHandler(async (req, res) => {
  const token = req.cookies["access_token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decoded.id) {
    res.status(400);
    throw new Error("user profile not found");
  }

  const updatedprofile = await User.findByIdAndUpdate(decoded.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedprofile);


});

//get cast by skin color  catagory


//fetch  all users
const fetchallUsers = asyncHandler(async (req, res) => {
            try{
              const info = req.query.search
              const limit = parseInt( req.query.limit)
              const page = parseInt(req.query.page)-1||0          
              const sex =  req.query.sex ||""   
              const minAge= parseInt( req.query.minAge)           
              const maxAge =parseInt(req.query.maxAge)
                             
       const query ={}
       let Users
        if(info){
          query.expriance={$in:[info]}
        }
       if(minAge&&maxAge){
        query.age={$gte:minAge,$lte:maxAge}
       }
       if(sex){
        query.gender=sex
       }
    console.log(query)
        Users =  await User.find(query,{email:0,password:0}).skip(page*limit).limit(limit)
        const total= await User.countDocuments(query) 
        const response ={
        error:false,
        total:total,
        page:page+1,
        limit:limit,
        users: Users
        }
      
         if(Users){
          res.json(response )
         }
        
       
        
            }catch(err){
              res.status(500).json(err)
            }

});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  updateprofile,
  fetchallUsers,
};
