const express = require("express");
const { check, validationResult } = require('express-validator');
const { default: mongoose } = require("mongoose");

let Order = require("../models/orders");
let Cart = require("../models/carts");
let User = require("../models/users");

const router = express.Router();

async function removeCart(id) {
    await Cart.deleteMany({ userId: id });
}

router.get("/", async (req, res) => {
    try {
        let orders = await Order.find()
        return res.status(200).json(orders)
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.get("/:id", async (req, res) => {
    try {
        let order = await Order.findById(req.params.id)
        return res.status(200).json(order);
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        let orders = await Order.find({ "userId": req.params.id });
        return res.status(200).json(orders)
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.post("/", [
    check("product").notEmpty().withMessage("Product is required"),
    check("date").notEmpty().withMessage("Order date is required"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        if (!req.body.userId) {
            userId = mongoose.Types.ObjectId();
            let order = new Order({
                userId: req.body.randomUserId,
                product: req.body.product,
                date: req.body.date,
                address: req.body.address
            });
            order.save().then(ord => {
                removeCart(req.body.randomUserId);
                return res.status(201).json(ord);
            }).catch(error => {
                return res.status(400).json(error)
            })
        }
        else {
            let user = await User.findById(req.body.userId)
            if(!user){
                return res.status(400).json("User not exists")
            }
            order = new Order({
                userId: req.body.userId,
                product: req.body.product,
                date: req.body.date,
                address: user.address
            });
            order.save().then(ord => {
                removeCart(req.body.userId);
                return res.status(201).json(ord);
            }).catch(error => {
                return res.status(400).json(error)
            })
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    let order = await Order.findById(req.params.id)
    if (order == 0) {
        return res.status(400).json("Cannot find order from given Id")
    }
    else {
        try {
            order = await Order.findOneAndDelete(req.params.id)
            return res.status(200).json("Deleted");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

module.exports = router;