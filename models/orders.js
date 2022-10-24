const mongoose = require("mongoose")
const schema = mongoose.Schema

const productSchema = schema({
    productId: {
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        required:true
    },
    price: {
        type: Number,
        required:true
    }
})

const orderSchema = schema({
    userId: {
        type: String,
        required: true
    },
    product: [productSchema],
    date: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order