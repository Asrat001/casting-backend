const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdminMiddleware } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  fetchallUsers,
  updateprofile,
  logout,
  countallusers

} = require("../controllers/user");

router.put("/profile/:id",isAuthenticated , updateprofile);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/alluser", fetchallUsers);
router.post("/logout", logout);
router.get('/countusers',isAdminMiddleware,countallusers )

module.exports = router;
