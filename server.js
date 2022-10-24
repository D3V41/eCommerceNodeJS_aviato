const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path")
const mongoose = require("mongoose");
const cors = require('cors');

const { port, db_uri } = require("./config");
const userRouter = require("./routes/users");
const productRouter = require("./routes/products");
const bannerRouter = require("./routes/banners");
const cartRouter = require("./routes/carts");
const reviewRouter = require("./routes/reviews");
const orderRouter = require("./routes/orders");
const securityRouter = require("./routes/security");


const app = express()

const log = (req,res, next) => {
    console.log("Running middleware");
    next();
}
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json({limit: '50mb'}));
app.use(cookieParser())
app.use(cors())

app.get("/", log, (req, res) => {
    res.status(200).render('index', {message: "Home"});
})

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/carts", cartRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);
app.use("/api", securityRouter);


mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    app.listen(port, () => {
        console.log("Running on port", port)
    })
}).catch((error) => {
    console.log(error)
})