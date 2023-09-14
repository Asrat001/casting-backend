const express = require('express')
const router = express.Router()
const {
  registerUser, 
  loginUser,
  fetchallUsers,

} = require('../controllers/user')


router.post('/signup', registerUser)
router.post('/login', loginUser)
router.get("/alluser", fetchallUsers);

module.exports = router