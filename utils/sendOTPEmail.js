const nodemailer = require('nodemailer');
const sendOTPEmail = async (email, otp,res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "vaghelaparth693@gmail.com",
            pass: "qpeb glle xovz pguu",
          },
    });
    const mailOptions = {
        from: 'vaghelaparth300@gmail.com',
        to: email,
        subject: 'Your OTP for Password Change',
        text: `Your OTP is: ${otp}`,
    };
    if( await transporter.sendMail(mailOptions))
    return true
};
module.exports = sendOTPEmail