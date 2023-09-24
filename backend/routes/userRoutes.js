const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdminMiddleware } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  fetchallUsers,
  updateprofile,
  castbyageandskincolor,

  skincolor,
  filterwithage,
} = require("../controllers/user");

router.put("/profile/:id", updateprofile);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/profile", isAuthenticated, updateprofile);
router.get("/alluser", fetchallUsers);



module.exports = router;
