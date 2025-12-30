const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
            id: String,
            title: String,
            description: String,
            image: String,
            price: Number,
            category: String,
            quantity: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    stripeSessionId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Order = mongoose.model('order', orderSchema)

module.exports = Order

