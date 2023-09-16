const express = require('express')
const router = express.Router()
const {isAuthenticated, isAdminMiddleware} = require("../middleware/auth")
const {

 
  registerUser, 
  loginUser,
  fetchallUsers,
  profile


} = require('../controllers/user')


router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post('/profile',isAuthenticated,profile)
router.get("/alluser",isAdminMiddleware, fetchallUsers);

module.exports = router