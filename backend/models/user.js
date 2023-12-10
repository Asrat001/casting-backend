const mongoose = require('mongoose');
const Schema= mongoose.Schema

const userSchema = new Schema(

    {
        fullname:{
            type: String,
        },
        registrationDate: {
            type: Date,
            default: Date.now  // Set default value to the current date/time when a new user is created
          },
        age:{ type: Number, default:0},
        email:{
            type:String,
            unique:true,
            required:true,
        },
        about:{type:String},
        gender:{type:String},
        password:{
            type:String,   
            required:true, 
        },
        avatar:{
            type:String,
        },
        links:{type:String},
        works:{type:String},
        skintone:{type:String},
        language:{type:String},
        phone:{type:String},
        info:{
          region:{
            type:String,
          },
          city:{
            type:String,
          },
          nationality:{type:String},
          accadamic:{type:String},
         
        },
        expriance:{type:String},
        talent:{
            type:[String],
            enum:["Swimming","Car Driving","Motor","Cycling","Cycling", "Heavy Car Driving","Sket Boarding",
             "Karate","Tenise",  "Foot Ball","Gym", "Runing", "Modeling" ,"Circus",  "Wood Working" ,"Metal Working", 
             "Vocal", " Drum" ," Lead Guitar", "Base Guitar ","Saxphone","Trampet","Violin","Cello" ," Fluet", "Keyboard" ,
             "Piano"]
        },
        isActive:{type:Boolean,default:true},
        isAdmin:{type:Boolean,default:false},
        otp: { type: String },
        forgotpasswordotp:{type: String },
     isVerified: { type: Boolean, default: false },
     otpExpiration: Date,
     forgototpExpiration: Date,
   
    },
    {
        timestamps:true
    }
);

userSchema.methods.getUser = function(){
    return{
        id:this._id,
        fullname:this.fullname,
        age:this.age,
        avatar:this.avatar,
        pictures:this.pictures,
        skintone:this.skintone,
        language:this.language,
        phone:this.phone,
        info:this.info,
        talent:this.talent
    }
}

userSchema.methods.toAdmin = function(){
    return{
        id:this._id,
        email:this.email,
        password:this.password
    }
}


module.exports= mongoose.model("User",userSchema)