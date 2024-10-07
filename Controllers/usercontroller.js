const User = require("../Models/user-model.js");
const bcrypt = require("bcryptjs");
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const { authenticator } = require('otplib');
const jwt = require("jsonwebtoken");
const sendOTPEmail = require('../utils/sendOTPEmail.js')
const RegisterUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
  }
};
const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "Strict",
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const LogoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
const SendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address."
      });
    }
    if (user._id.toString() !== req.user.id) {
      console.log(user._id, req.user.id);
      return res.status(401).json({
        success: false,
        message: "Your account is not registered with this email."
      });
    }
    const secret = authenticator.generateSecret();
    const otp = authenticator.generate(secret);
    if (await sendOTPEmail(email, otp)) {
      user.otps.push({ otp, createdAt: Date.now() });
      await user.save();
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
        otp,
        navigate: "naviagate otp form"
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email."
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
const VerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body
    const user = await User.findOne({ _id: req.user.id });
    const latestOtp = user.otps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    console.log(
      "latestOtp",
      latestOtp.otp
    );
    if (otp == latestOtp.otp) {
      return res.status(201).json({
        success: true,
        message: "otp verifying successfully",
        navigate: "chage password form"
      })
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP."
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
const changePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword, retypepassword } = req.body;
    if (!oldpassword || !newpassword || !retypepassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields."
      });
    }
    if (newpassword !== retypepassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match."
      });
    }
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    const isValidPassword = await bcrypt.compare(oldpassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
};
const editProfile = async (req, res) => {
  try {
      const userId  = req.user.id
      const profileimg = req.file;
      if (!req.file) {
          return res.status(400).json({ message: 'No image uploaded' });
      }
      const optimizedImageBuffer = await sharp(profileimg.buffer)
          .resize(800, 600, { fit: 'inside' })
          .toFormat('jpeg', { quality: 80 })   
          .toBuffer();
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      const updatedUser = await User.findByIdAndUpdate(userId, {
        profileimg: cloudResponse.secure_url
      }, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({
          message: 'Profile updated successfully',
          user: updatedUser
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = {
  RegisterUser,
  LoginUser,
  LogoutUser,
  SendOtp,
  VerifyOtp,
  changePassword,
  editProfile
};
