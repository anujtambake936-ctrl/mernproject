const Order = require("../models/order")

const getOrders = async (req, res) => {
    try {
        const userId = req.id

        const orders = await Order.find({ userId })
            .sort({ orderDate: -1 })
            .select("-__v")

        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const userId = req.id
        const orderId = req.params.id

        const order = await Order.findOne({ _id: orderId, userId })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            })
        }

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const userId = req.id
        const orderId = req.params.id
        const { status } = req.body

        const order = await Order.findOne({ _id: orderId, userId })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            })
        }

        order.status = status
        await order.save()

        res.status(200).json({
            success: true,
            message: "Order status updated.",
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getOrders,
    getOrderById,
    updateOrderStatus
}

