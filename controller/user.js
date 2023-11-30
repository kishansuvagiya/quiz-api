var userData = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')

exports.middledata = async function (req, res, next) {
  try {
    let token = req.headers.authorization
    // console.log(token);
    if(!token){
      throw new Error("Please attched token ")
    }
    let decode = jwt.verify(token, process.env.JWT_KEY)
    // console.log(decode.id);
    let checkUser = await userData.findById(decode.id)
    if(!checkUser){
      throw new Error("User Not found")
    }
    // req.userId = decode.id
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
    if (!signupData.username || !signupData.email || !signupData.password) {
      throw new Error("Please enter valid fields")
    }
    signupData.password = await bcrypt.hash(signupData.password, 6)
    const newUser = await userData.create(signupData)
    let token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY)
    res.status(201).json({
      status: "success",
      message: "User signup successfully",
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
      throw new Error("Email is wrong")
    }
    let password = await bcrypt.compare(loginData.password, email.password)
    if (!password) {
      throw new Error("pass is invalid")
    }
    let token = jwt.sign({ id: email._id }, process.env.JWT_KEY)
    res.status(200).json({
      status: "success",
      message: "User login succesfully",
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