const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  phone: { type: String },
  name: { type: String },
  users:[{
    userId:{ type:mongoose.Schema.ObjectId,ref:"User"}
   
  }]
});
orderSchema.index({name:"text"})
module.exports= mongoose.model("Order",orderSchema)