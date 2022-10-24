const mongoose = require("mongoose")
const schema = mongoose.Schema


const reviewSchema = schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required:true
    },
    date: {
        type: String,
        required:true
    }, 
    userName: {
        type: String,
        required:true
    }, 
    review: {
        type: String,
        required:true
    }, 
    src: {
        type: String,
        required:true
    }
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review