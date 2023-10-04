const asyncHandler = require('express-async-handler')
const Customeorder = require("../models/customorder")


const customorderBy = asyncHandler( async (req, res) =>{
    const {phone,fullname,gender,skintone,expriance,age,talent} = req.body

    if (!phone|| !phone ) {
        res.status(400)
        throw  Error('you must add full name and phone')
      }
     try{
       const orderadded= await Customeorder.create({
        phone:phone,
        fullname:fullname,
        gender:gender,
        skintone:skintone,
        expriance:expriance,
        age:age,
        talent:talent  
         })
       if (orderadded){
        res.status(201).json({
            orderadded
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



    //fetch  all custom orders
const fetchallcustomorders = asyncHandler(async (req, res) => {
  try{
    const info = req.query.search
    const limit = parseInt( req.query.limit)
    const page = parseInt(req.query.page)-1||0          
    const status =  req.query.status ||""
                   
const query ={}
let Users
if(info){
query.fullname={$in:[info]}
}
if(status){
  query.status=status
 }

console.log(query)
Users =  await Customeorder.find(query,{email:0,password:0}).skip(page*limit).limit(limit)
const total= await Customeorder.countDocuments(query) 
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

    // for admin no of pending customorders
const countpendingcustomorders = asyncHandler(async (req, res) => {
  const users=await  Customeorder.find()
  .or([{status:'pending'}])
  .countDocuments()
  
  res.status(200).json(users)
  
  });

   // for admin count all order
const countallcustomorders = asyncHandler(async (req, res) => {
  const users=await  Customeorder.find().countDocuments()
  res.status(200).json(users)
  
  });


  // today custom orders
  const counttodaycustomorders = asyncHandler(async (req, res) => {
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
  
  Customeorder.aggregate(pipeline).exec()
  .then(results => {
    // Handle the results here
    res.status(200).json(results);
  })
  .catch(error => {
    // Handle any errors here
    res.status(400).json(error)
  });
  })



  // for admin no of successful custom orders
const countsuccessfulcustomorders = asyncHandler(async (req, res) => {
  const users=await  Customeorder.find()
  .or([{status:'successful'}])
  .countDocuments()
  
  res.status(200).json(users)
  
  });
    module.exports={customorderBy,countpendingcustomorders,countallcustomorders,counttodaycustomorders,countsuccessfulcustomorders,fetchallcustomorders}    