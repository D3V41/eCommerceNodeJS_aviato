const mongoose = require("mongoose")
const schema = mongoose.Schema

const productSchema = schema({
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    oldPrice: {
        type: Number,
        required: true
    },
    newPrice: {
        type: Number,
        required: true
    },
    src: {
        type: String,
        required: true
    },
})

const Product = mongoose.model("Product", productSchema)
module.exports = Product