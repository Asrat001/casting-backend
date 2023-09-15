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

module.exports={orderBy}    