const express = require('express')
const router=express.Router()
const {orderBy,getallOrder,countallorders,countpendingorders,countsuccessfulorders,counttodayorders} = require("../controllers/order")
const { isAuthenticated, isAdminMiddleware } = require("../middleware/auth");

router.post("/setorder",orderBy)
router.get("/getallorder",isAdminMiddleware ,getallOrder)
router.get("/countorders",isAdminMiddleware,countallorders)
router.get("/countpendingorders",isAdminMiddleware,countpendingorders)
router.get("/countsuccessfulorders",isAdminMiddleware,countsuccessfulorders)
router.get("/counttodayorders",isAdminMiddleware,counttodayorders)

module.exports = router