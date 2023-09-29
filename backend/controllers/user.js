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


// log out user
const logout=asyncHandler (async(req, res, next) => {
  try {
    res.cookie("access_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}
);

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

// user detail


const userdetail=asyncHandler(async (req, res, next) => {
    try {
      const userinfo = await User.find({ _id: req.params.id });

      res.status(201).json({
        success: true,
      userinfo,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
//change password


  const changepassword=asyncHandler(async (req, res, next) => {
   
      try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
    
        // Find the user by ID
        const user = await User.findById(id);
    
        // Check if the user exists
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid old password' });
        }
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Update the password
        user.password = hashedPassword;
        await user.save();
    
        // Return success message
        res.json({ message: 'Password changed successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    })



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

// for admin count all users
const countallusers = asyncHandler(async (req, res) => {
  const users=await  User.find().countDocuments()
  res.status(200).json(users)
  
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
  logout,
  countallusers,
  userdetail,
  changepassword
};
