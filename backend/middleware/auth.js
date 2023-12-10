
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const isAuthenticated = catchAsyncErrors(async(req,res,next) => {
   

try {
   const token = req.cookies["access_token"];
  
  if(!token){
    res.status(400).json({error:"Invalid token"});
}

const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

req.user = await User.findById(decoded.id);

next();
} catch (error) {
  res.status(400).json({message:'errorr'})
}
});


const isAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies["access_token"];

    if(!token){
        res.status(400).json({error:"Invalid token"});
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
  if(user.isAdmin==true)
  {
 return next()
  }

  } catch (error) {
   return res.status(403).json({ error: error,message:'yubibiu' });
  }
 
};
  module.exports={isAdminMiddleware,isAuthenticated};