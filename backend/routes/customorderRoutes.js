const express = require('express')
const router=express.Router()
const {customorderBy, countpendingcustomorders,countallcustomorders,counttodaycustomorders,countsuccessfulcustomorders,fetchallcustomorders} = require("../controllers/customorder")
const { isAuthenticated, isAdminMiddleware } = require("../middleware/auth");

router.post("/setcustomorder",customorderBy)
router.get("/countpendingcust",isAdminMiddleware,countpendingcustomorders)
router.get("/countcustomorders",isAdminMiddleware,countallcustomorders)
router.get("/counttodaycust",isAdminMiddleware,counttodaycustomorders)
router.get("/countsuccessfulcust",isAdminMiddleware,countsuccessfulcustomorders)
router.get("/getallcustomorder",isAdminMiddleware ,fetchallcustomorders)

module.exports = router