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
  },
  profileimg:{
    type:String,
    default:"",
  }

});
 export default  User  = mongoose.model("User",UserSchema)
