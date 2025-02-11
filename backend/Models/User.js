const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {type : String , required : true} ,
    lastName : {type : String , crequired : true},
    email : {type : String, required : true , unique : true},
    password : {type : String , required : true},
    emailVerified : {type : Boolean , default : false},
    Tasks : [{type : mongoose.Schema.Types.ObjectId , ref : 'Task'}],
    otp : String ,
    otpExpires: Date,
    token : String,
    expiresAt: Date, 
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

const User = mongoose.model("User" , userSchema);
module.exports = User;