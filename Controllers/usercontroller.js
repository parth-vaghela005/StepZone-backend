     const User  = require('../Models/user-model.js')
     const bcrypt = require('bcryptjs');
     const jwt = require('jsonwebtoken');
     const RegisterUser = async(req,res) =>{
        const {name,email,phone,password,role} = req.body;
        try {
            if(!name|| !email || !phone ||!password || !role){
                return res.status(400).json({
                    success:false,
                    message:"Please fill all the fields"
                })
            }
            const user = await User.findOne({email})
            if(user){
                return res.status(400).json({
                    success: false,
                    message: 'User already registered with this email',
                  });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name,
                email,
                phone,
                password:hashedPassword,
                role
            })
            await newUser.save()
            res.status(201).json({
                success:true,
                message:"User created successfully",
                data:newUser
                })
        } catch (error) {
            console.log(error);
        }
       }


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
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
        httpOnly: true, // This flag prevents client-side scripts from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Set to true in production to send cookie over HTTPS only
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: 'Strict', // Helps protect against CSRF
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

       module.exports = {
        RegisterUser,
        LoginUser
       }