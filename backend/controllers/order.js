const asyncHandler = require('express-async-handler')
const order = require("../models/orderModel")

const orderBy = asyncHandler( async (req, res) =>{
    const {phone,name,users} = req.body
     try{
       const orderadded= await order.create({
        phone:phone,
        name:name,
        users:users
       })
       if (orderadded){
        res.status(201).json({
            users:users
        }) }
        else{
            res.status(400);
            throw new Error("Invalid user data");
        } 
      
       }
      catch(err){

        res.status(400).json(err)
      }



    })

    //get all order only for admin
   const getallOrder =asyncHandler(async(req,res)=>{
    try {
      const orders= await order.find().populate("users.userId").exec()
      if (orders){
        res.status(201).json(orders)
      }
    } catch (error) {
      res.status(400).json(error)
    }
 
   })


   // for admin count all order
const countallorders = asyncHandler(async (req, res) => {
  const users=await  order.find().countDocuments()
  res.status(200).json(users)
  
  });

module.exports={orderBy,getallOrder,countallorders}    