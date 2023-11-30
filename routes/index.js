var express = require('express');
var router = express.Router();
var catController = require('../controller/category')
var quizController = require('../controller/quiz')
var userController = require('../controller/user')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// ------------- user api----------------------
router.post('/signup', userController.signup)
router.post('/login', userController.login)

// ------------- category api----------------------
router.post('/category', catController.AddCategory)
router.get('/category', catController.AllCategory)
router.delete('/category', catController.DeleteCategory)
router.put('/category', catController.UpdateCategory)

// ------------- Quiz api----------------------
router.post('/quiz', quizController.AddQuestion)
router.get('/quiz', userController.middledata, quizController.AllQuestion)
router.delete('/quiz', quizController.DeleteQuestion)
router.put('/quiz', quizController.UpdateQuestion)

module.exports = router;
