const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  phone: { type: String },
  name: { type: String },
  users:[{
    type:mongoose.Schema.ObjectId,ref:"User"
  }]
});
