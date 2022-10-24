const mongoose = require("mongoose")
const schema = mongoose.Schema

const bannerSchema = schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    }
})

const Banner = mongoose.model("Banner", bannerSchema)
module.exports = Banner