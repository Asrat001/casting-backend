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
  try {
    const ordern=await  order.find().countDocuments()
  res.status(200).json(ordern)
    
  } catch (error) {
    res.status(400).json({message:'bad requiest'})
  }
  
  });



    // for admin no of pending orders
const countpendingorders = asyncHandler(async (req, res) => {
  const users=await  order.find()
  .or([{status:'pending'}])
  .countDocuments()
  
  res.status(200).json(users)
  
  });

     // for admin no of successful orders
const countsuccessfulorders = asyncHandler(async (req, res) => {
  const users=await  order.find()
  .or([{status:'successful'}])
  .countDocuments()
  
  res.status(200).json(users)
  
  });

  // count today orders
  const counttodayorders = asyncHandler(async (req, res) => {
    var start = new Date();
    start.setHours(0,0,0,0);
    
    var end = new Date();
    end.setHours(23,59,59,999);

    var pipeline = [
      {
          "$match": {
              "createdAt": { "$gte": start, "$lt": end }
          }
      },
      {
          "$group": {
              "_id": null,
              "count": { "$sum": 1 }
          }
      }
  ];
  
  order.aggregate(pipeline).exec()
  .then(results => {
    // Handle the results here
    res.status(200).json(results);
  })
  .catch(error => {
    // Handle any errors here
    res.status(400).json(error)
  });
  })
module.exports={orderBy,getallOrder,countallorders,countpendingorders,countsuccessfulorders,counttodayorders}    