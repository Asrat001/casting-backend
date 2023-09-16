const express = require('express')
const router=express.Router()
const {orderBy,getallOrder} = require("../controllers/order")

router.post("/setorder",orderBy)
router.get("/getallorder",getallOrder)

module.exports = router