const mongoose = require("mongoose")
const schema = mongoose.Schema


const cartSchema = schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        required:true
    } 
})

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart