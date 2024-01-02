var express = require('express');
var router = express.Router();
var catController = require('../controller/category')
var quizController = require('../controller/quiz')
var userController = require('../controller/user')
var adminController = require('../controller/admin')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// ------------- admin api----------------------
router.post('/signup', adminController.signUp)
router.post('/login', adminController.login)
router.post('/userdelete', adminController.DeleteUser)

// ------------- user api----------------------
router.post('/user/signup', userController.signup)
router.post('/user/login', userController.login)
router.post('/user/forgot-password', userController.forgotPassword)
router.post('/user/verify-otp', userController.verifyOTP)

// ------------- category api----------------------
router.post('/category', adminController.SECURE, catController.AddCategory)
router.get('/category', userController.middledata, catController.AllCategory)
router.delete('/category', adminController.SECURE, catController.DeleteCategory)
router.put('/category', adminController.SECURE, catController.UpdateCategory)

// ------------- Quiz api----------------------
router.post('/quiz', adminController.SECURE, quizController.AddQuestion)
router.get('/quiz', userController.middledata, quizController.AllQuestion)
router.delete('/quiz', adminController.SECURE, quizController.DeleteQuestion)
router.put('/quiz', adminController.SECURE, quizController.UpdateQuestion)

module.exports = router;
