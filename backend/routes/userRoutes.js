const express = require('express')
const router = express.Router()
const {isAuthenticated} = require("../middleware/auth")
const {
  registerUser, loginUser,profile
 
} = require('../controllers/user')


router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post('/profile',isAuthenticated,profile)

module.exports = router