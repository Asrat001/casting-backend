const express = require('express')
const router=express.Router()
const {customorderBy, countpendingcustomorders,countallcustomorders,counttodaycustomorders} = require("../controllers/customorder")
const { isAuthenticated, isAdminMiddleware } = require("../middleware/auth");

router.post("/setcustomorder",customorderBy)
router.get("/countpendingcust",isAdminMiddleware,countpendingcustomorders)
router.get("/countcustomorders",isAdminMiddleware,countallcustomorders)
router.get("/counttodaycust",isAdminMiddleware,counttodaycustomorders)

module.exports = router