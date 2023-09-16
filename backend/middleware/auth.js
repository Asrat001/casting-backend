
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


const isAdminMiddleware = async (req, res, next) => {
  
  const token = req.cookies["access_token"];

  if(!token){
      res.status(400).json({error:"Invalid token"});
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  user = await User.findById(decoded.id);
if(user.isAdmin==true)
{
next()
}
else {
  res.status(403).json({ error: 'Unauthorized' }); // User is not an admin, return an error response
}
};
  module.exports={isAdminMiddleware,isAuthenticated};