const mongoose= require('mongoose')

const customorderSchema = mongoose.Schema({
   
    fullname: {
        type:String,
        required:[true, 'please add a full name'],
        
    },
    phone: {
        type:String,
        required:[true, 'please add a password']
    },
    age:{ type: Number, 
        default:0
    },
    gender:{
        type:String
    },
    skintone:{
        type:String
    },
    expriance:[String],
    talent:{
        type:[String],
        enum:["Swimming ","Car Driving ","Motor"," Cycling","Cycling", " Heavy Car Driving","  Sket Boarding",
         " Karate","  Tenise",  "Foot Ball","  Gym", " Runing ", " Modeling" ," Circus",  " Wood Working" ," Metal Working", 
         " Vocal", " Drum" ," Lead Guitar", " Base Guitar ","Saxphone","  Trampet"," Violin","Cello" ," Fluet", " Keyboard" ,
         " Piano"]
    },
    status: {
        type: String,
        default: "pending",
      },
    
   
},
{
    timestamps:true
})
module.exports=mongoose.model('Customorder',customorderSchema)