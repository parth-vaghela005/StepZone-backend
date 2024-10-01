     const User  = require('../Models/user-model.js')
     const bcrypt = require('bcryptjs')
     const RegisterUser = async(req,res) =>{
        const {name,email,phone,password} = req.body;
        try {
            if(!name|| !email || !phone ||!password){
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
                password:hashedPassword
            })
        } catch (error) {
            console.log(error);
            
        }
       
     }