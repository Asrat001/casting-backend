const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("express-async-handler");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const moment = require("moment");
// @desc    Register new user
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
     
    if (!fullname || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }
   
    // Check if user exists
    const userExists = await User.findOne({ email });
   
    if (userExists) {
      
      res.status(400).json({ error: 'User already exists' , userexist:true });
    
      
    }else{
      const otp = speakeasy.totp({
        secret: config.otpSecret,
        digits: 6,
      });
      // Set OTP expiration to 10 minutes from now
      const otpExpiration = moment().add(10, "minutes");
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const registrationDate =Date.now()
      // Create user
      const user = await User.create({
        fullname,
        email,
        otp,
        password: hashedPassword,
        otpExpiration,
        registrationDate
      });
      // Send OTP to the user's email
      const transporter = nodemailer.createTransport(config.email);
      const mailOptions = {
        from: config.email.sender,
        to: email,
        subject: "OTP Verification",
        html: `
      <h1>Email Verification</h1>
      <p>Please use the following OTP to activate your account:</p>
      <h2>${otp}</h2>
    `,
      };
      await transporter.sendMail(mailOptions);
  
      
      res.cookie("access_token", generateToken(user.id), {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        secure:true
       
      } )
      .json({
        message:`you registed sucussfully , we have sent you otp to ${user.email}`,
        _id: user.id,
        fullname: user.fullname,
       
      });
    }

    // Generate a new OTP

    
  } catch (error) {
    
    res.status(500).json({ error: "Internal server error" });
  }
});

// Activate user account
const verifyOTP = async (req, res) => {
  const {otp ,id } = req.body;
  const token = req.cookies["access_token"];
  console.log(token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  

  try {
    // Find the user by email
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the OTP has expired
    if (moment().isAfter(user.otpExpiration)) {
      return res.status(401).json({ message: "OTP has expired" });
    }

    // Check if the OTP matches
    if (user.otp === otp) {
      // Mark the user as verified
      user.isVerified = true;
      user.otp = "";
      user.otpExpiration = null;
      await user.save();

      return res
        .status(200)
        .json({ message: "Account activated successfully",flage: user.isVerified });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    
    return res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json('Please add all fields');
    
  }
  
  // Check for user email
  const user = await User.findOne({ email }).select("+password");
 const pass =await bcrypt.compare(password, user.password)
 console.log(pass)
  if (!user) {
     res.status(404).json({error:'user doesnt exist'})
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    console.log(user)
    res
      .cookie("access_token", generateToken(user.id), {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        secure:true

      } )
      .json({
        _id: user.id,
        fullname: user.fullname,
        isAdmin:user.isAdmin,
      });
  }
   else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// log out user
const logout = asyncHandler(async (req, res, next) => {
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
});

//Update end user profile
const updateprofile = asyncHandler(async (req, res) => {
try {
  const token = req.cookies["access_token"];
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 console.log(req.body)
  if (!decoded.id) {
    res.status(400);
    throw new Error("user profile not found");
  }

  const updatedprofile = await User.findByIdAndUpdate(decoded.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedprofile);
  
} catch (error) {
  res.status(400).json(error)
}
});

// user detail

const userdetail = asyncHandler(async (req, res, next) => {
  try {
    const userinfo = await User.find({ _id: req.params.id });

    res.status(201).json({
      success: true,
      userinfo,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});
//change password

const changepassword = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    // Return success message
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot Password - Send OTP
const forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = speakeasy.totp({
      secret: config.otpSecret,
      digits: 6,
    });
    const forgototpExpiration = moment().add(10, "minutes");
    // Save OTP to user document
    user.forgotpasswordotp = otp;
    user.forgototpExpiration = forgototpExpiration;
    await user.save();

    // Send OTP to user's email
    const transporter = nodemailer.createTransport(config.email);
    const mailOptions = {
      from: config.email.auth.user,
      to: email,
      subject: "Forgot Password - OTP Verification",
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to send OTP" });
      } else {
        return res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, forgotpasswordotp, newpassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the OTP has expired
    if (moment().isAfter(user.forgototpExpiration)) {
      return res.status(401).json({ message: "OTP has expired" });
    }

    // Check if the OTP matches
    if (user.forgotpasswordotp === forgotpasswordotp) {
      // Update the password
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      user.password = hashedPassword;
      user.forgotpasswordotp = "";
      user.forgototpExpiration = null;
      await user.save();

      return res.status(200).json({ message: "Password reset successful" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    
    return res.status(500).json({ error: "Internal server error" });
  }
};

//fetch  all users
const fetchallUsers = asyncHandler(async (req, res) => {
  try {
    const info = req.query.search;
    const limit = parseInt(req.query.limit)||9;
    const page = parseInt(req.query.page) - 1 || 0;
    const sex = req.query.sex || "";
    const minAge = parseInt(req.query.minAge);
    const maxAge = parseInt(req.query.maxAge);

    const query = {};
    let Users;
    if (info) {
      query.expriance = { $in: [info] };
    }
    if (minAge && maxAge) {
      query.age = { $gte: minAge, $lte: maxAge };
    }
    if (sex) {
      query.gender = sex;
    }
    
    Users = await User.find(query, { email: 0, password: 0 })
      .skip(page * limit)
      .limit(limit);
    const total = await User.countDocuments(query);
    const response = {
      error: false,
      total: total,
      page: page + 1,
      limit: limit,
      users: Users,
    };

    if (Users) {
      res.json(response);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// for admin count all users
const countallusers = asyncHandler(async (req, res) => {
try {
  const allcast = await User.find().countDocuments()
  const fm = await User.find({gender:'female'}).countDocuments()
  const male = await User.find({gender:'male'}).countDocuments()
  const monthlyRegisteredUsers = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$registrationDate' },
          month: { $month: '$registrationDate' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1
      }
    }
  ]);
   const response={
    female :fm ,
    male :male,
    allcasts:allcast,
    monthlyRegisteredUsers:monthlyRegisteredUsers
   }
  
  res.status(200).json(response);
  
} catch (error) {
  res.status(400).json({message:'invalid access token'})
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
  logout,
  countallusers,
  userdetail,
  changepassword,
  verifyOTP,
  resetPassword,
  forgotpassword,
};
