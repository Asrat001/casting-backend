const mongoose = require('mongoose');
const Schema= mongoose.Schema

const userSchema = new Schema(

    {
        fullname:{
            type: String,
        },
        age:{ type: Number, default:0},
        email:{
            type:String,
            unique:true,
            required:true,
        },
        gender:{type:String},
        password:{
            type:String,   
            required:true, 
        },
        avatar:{
            type:String,
        },
        pictures:[String],
        skintone:{type:String},
        language:[String],
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
        expriance:[String],
        talent:{
            type:[String],
            enum:["Swimming ","Car Driving ","Motor"," Cycling","Cycling", " Heavy Car Driving","  Sket Boarding",
             " Karate","  Tenise",  "Foot Ball","  Gym", " Runing ", " Modeling" ," Circus",  " Wood Working" ," Metal Working", 
             " Vocal", " Drum" ," Lead Guitar", " Base Guitar ","Saxphone","  Trampet"," Violin","Cello" ," Fluet", " Keyboard" ,
             " Piano"]
        },
        isActive:{type:Boolean,default:true},
        isAdmin:{type:Boolean,default:false},
        isEmailVarified:{type:Boolean,default:false}
   
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