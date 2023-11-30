var userData = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
var jwtKey = 'QuizAPI'

exports.middledata = async function (req, res, next) {
  try {
    let token = req.headers.token
    if (token) {
      jwt.verify(token, jwtKey, (error, valid) => {
        if (error) {
          throw new Error('Please provide valid token')
        } else {
          next()
        }
      })
    } else {
      throw new Error('Please add token')
    }
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    })
  }
}

exports.signup = async function (req, res, next) {
  try {
    let signupData = req.body
    // console.log(signupData);
    if (!signupData.username || !signupData.email || !signupData.password) {
      throw new Error("Please enter valid fields")
    }
    signupData.password = await bcrypt.hash(signupData.password, 6)
    const newUser = await userData.create(signupData)
    let token = jwt.sign({ id: newUser._id }, jwtKey)
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
    let token = jwt.sign({ id: email._id }, jwtKey)
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