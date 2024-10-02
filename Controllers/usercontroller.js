     const User  = require('../Models/user-model.js')
     const bcrypt = require('bcryptjs')
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
       module.exports = {
        RegisterUser
        
       }