const express = require('express')
const router=express.Router()
const {orderBy} = require("../controllers/order")

router.post("/order",orderBy)

module.exports = router