const express = require('express')
const { getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController')
const verifyToken = require('../middlewares/verifyToken')
const orderRouter = express.Router()

orderRouter.get("/", verifyToken, getOrders)
orderRouter.get("/:id", verifyToken, getOrderById)
orderRouter.put("/:id/status", verifyToken, updateOrderStatus)

module.exports = orderRouter

