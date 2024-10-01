     const User  = require('../Models/user-model.js')
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
    
        } catch (error) {
            console.log(error);
            
        }
       
     }