const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "seller"],
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default:""
  },
  profileimg:{
    type:String,
    default:"",
  },
  otps: [{
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now, 
        },
}]

});
 const  User  = mongoose.model("User",UserSchema)
 module.exports = User
