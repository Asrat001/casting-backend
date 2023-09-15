
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const token = req.cookies["access_token"];

    if(!token){
        res.status(400).json({error:"Invalid token"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});

module.exports={isAuthenticated};



