const mongoose = require("mongoose");
const validator=require("validator")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Email is invalid")
        //     }
         // }
         validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Invalid email format'
    }
        
    },
    
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough")
            }
        }
    },
    age:{
        type:Number,
        min:18,
        max:100,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender should be either male female or others")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo url is invalid")
            }
        }
    },
    about:{
        type:String,
        default:"default value for about"
    },
    skills:{
        type:[String],
    }

},{timestamps:true});


module.exports =mongoose.model("User",userSchema);