const express = require('express')
const router=express.Router()
const {orderBy,getallOrder,countallorders} = require("../controllers/order")
const { isAuthenticated, isAdminMiddleware } = require("../middleware/auth");

router.post("/setorder",orderBy)
router.get("/getallorder",isAdminMiddleware ,getallOrder)
router.get("/countorders",isAdminMiddleware,countallorders)

module.exports = router