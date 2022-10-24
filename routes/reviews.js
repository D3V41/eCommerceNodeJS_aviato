const express = require("express");
const { check, validationResult } = require('express-validator');
const { default: mongoose } = require("mongoose");

let Review = require("../models/reviews");
let User = require("../models/users");
let Product = require("../models/products");

const router = express.Router();

router.get("/product/:id", async (req, res) => {
    try {
        let reviews = await Review.find({ "productId": req.params.id });
        return res.status(200).json(reviews)
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.get("/:id", async (req, res) => {
    try {
        let review = await Review.findById(req.params.id)
        return res.status(200).json(review);
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.post("/", [
    check("productId").notEmpty().withMessage("productId is required"),
    check("date").notEmpty().withMessage("date is required"),
    check("review").notEmpty().withMessage("review is required"),
    check("src").notEmpty().withMessage("src is required").isBase64().withMessage("image must be in base64 from"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        if (!req.body.userId) {
            const userId = mongoose.Types.ObjectId();
            let r2 = await Product.findById(req.body.productId);
            if (!r2) {
                return res.status(400).json("Product not exists")
            }
            let r = await Review.find({ "userId": userId, "productId": req.body.productId });
            if (r.length != 0) {
                return res.status(400).json("Review already exists")
            } else {
                let review = new Review({
                    userId: userId,
                    productId: req.body.productId,
                    date: req.body.date,
                    userName: req.body.userName,
                    review: req.body.review,
                    src: req.body.src,
                });
                review.save().then(rv => {
                    return res.status(201).json(rv);
                }).catch(error => {
                    return res.status(400).json(error)
                })
            }
        }else{
            let r1 = await User.findById(req.body.userId);
        if (!r1) {
            return res.status(400).json("User not exists")
        }
        let r2 = await Product.findById(req.body.productId);
        if (!r2) {
            return res.status(400).json("Product not exists")
        }
        let r = await Review.find({ "userId": req.body.userId, "productId": req.body.productId });
        if (r.length != 0) {
            return res.status(400).json("Review already exists")
        } else {
            let review = new Review({
                userId: req.body.userId,
                productId: req.body.productId,
                date: req.body.date,
                userName: req.body.userName,
                review: req.body.review,
                src: req.body.src,
            });
            review.save().then(rv => {
                return res.status(201).json(rv);
            }).catch(error => {
                return res.status(400).json(error)
            })
        }
        }
        

    } catch (err) {
        return res.status(400).json(err);
    }
});

router.put("/", [
    check("productId").notEmpty().withMessage("ProductId is required"),
    check("userId").notEmpty().withMessage("UserId is required"),
    check("review").notEmpty().withMessage("Review is required"),
    check("date").notEmpty().withMessage("Date is required"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let review = await Review.find({ "userId": req.body.userId, "productId": req.body.productId });
        if (review.length != 0) {
            review[0].review = req.body.review;
            review[0].date = req.body.date;
            if (req.body.src) {
                review[0].src = req.body.src;
            }
            review[0].save().then(crt => {
                return res.status(200).json(crt);
            }).catch(error => {
                return res.status(400).json(error)
            })
        } else {
            return res.status(400).json("Review not exists")
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    let review = await Review.findById(req.params.id)
    if (review == 0) {
        return res.status(400).json("Cannot find Review")
    }
    else {
        try {
            review = await Review.findOneAndDelete(req.params.id)
            return res.status(200).json("Deleted");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

module.exports = router;