const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    brand: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

const Product = mongoose.model('product', productSchema)

module.exports = Product

