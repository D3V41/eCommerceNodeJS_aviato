const mongoose = require("mongoose")
const schema = mongoose.Schema

const addressSchema = schema({
    street: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
    },
    province: {
        type: String,
        required:true
    },
    country: {
        type: String,
        required:true
    }
})

const userSchema = schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: addressSchema
})

const User = mongoose.model("User", userSchema)
module.exports = User