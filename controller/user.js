var userData = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
var speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");

exports.middledata = async function (req, res, next) {
  try {
    let token = req.headers.authorization
    // console.log(token);
    if(!token){
      throw new Error("Please attched token")
    }
    let decode = jwt.verify(token, process.env.JWT_KEY)
    // console.log(decode.id);
    let checkUser = await userData.findById(decode.id)
    if(!checkUser){
      throw new Error("User Not found")
    }
    next()
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    })
  }
}

exports.signup = async function (req, res, next) {
  // console.log(req.body);
  try {
    let signupData = req.body
    if (!signupData.fullname || !signupData.email || !signupData.password) {
      throw new Error("Please enter valid fields")
    }
    let email = await userData.findOne({ email: signupData.email })
    if (email) {
      throw new Error("Email already exists !")
    }
    signupData.password = await bcrypt.hash(signupData.password, 6)
    const newUser = await userData.create(signupData)
    let token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY)
    res.status(201).json({
      status: "success",
      message: "Signup successfully",
      data: newUser,
      token
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

exports.login = async function (req, res, next) {
  try {
    let loginData = req.body
    if (!loginData.email || !loginData.password) {
      throw new Error("Please enter valid fields")
    }
    let email = await userData.findOne({ email: loginData.email })
    // console.log(email.password);
    if (!email) {
      throw new Error("Invalid email or password !")
    }
    let password = await bcrypt.compare(loginData.password, email.password)
    if (!password) {
      throw new Error("Invalid email or password !")
    }
    let token = jwt.sign({ id: email._id }, process.env.JWT_KEY)
    res.status(200).json({
      status: "success",
      message: "Login succesfully",
      data: email,
      token
    })
  }
  catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // `true` for port 465, `false` for all other ports
  auth: {
    user: "hitikro@gmail.com",
    pass: "hmkn wvjs xvmn qerv",
  },
});

async function main(email, otp) {
  const info = await transporter.sendMail({
    from: 'hitikro@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Forgot Password OTP", // Subject line
    text: `Your OTP for password reset is: ${otp}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`, // plain text body
    html: `<p>Your OTP for password reset is: <b>${otp}</b></p><br /><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

exports.forgotPassword = async(req, res) => {
  try {
    let {email} =req.body
    if(!email){
      throw new Error('Please enter valid input')
    }
    let existingUser = await userData.findOne({email})
    if(!existingUser){
      throw new Error('User not found !')
    }
    var otpSecret = speakeasy.generateSecret({length: 20}).base32;
    existingUser.otpSecret = otpSecret
    await existingUser.save();

    var otp = speakeasy.hotp({
      secret: otpSecret,
      encoding: 'base32',
      counter: 123
    });

    main(email, otp)
    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully'
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    })
  }
}

exports.verifyOTP = async(req,res) => {
  try {
    let {email, otp, newPassword} = req.body
    if(!email || !otp || !newPassword){
      throw new Error('Please enter all field')
    }
    let existingUser = await userData.findOne({email})
    if(!existingUser){
      throw new Error('User not found !')
    }

    var isValidOTP = speakeasy.hotp.verify({
      secret: existingUser.otpSecret,
      encoding: 'base32',
      token: otp,
      counter: 123
    });

    if(isValidOTP){
      let hashPassword = await bcrypt.hash(newPassword, 10)
      existingUser.password = hashPassword;
      existingUser.otpSecret = undefined;
      await existingUser.save()
    }
    else{
      throw new Error('Invalid OTP !')
    }
    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    })
  }
}