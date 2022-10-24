const express = require("express");
const { check, validationResult } = require('express-validator');
const { default: mongoose } = require("mongoose");

let Cart = require("../models/carts");

const router = express.Router();

router.get("/user/:id", async (req, res) => {
    try {
        let carts = await Cart.find({ "userId": req.params.id });
        return res.status(200).json(carts)
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.get("/:id", async (req, res) => {
    try {
        let cart = await Cart.findById(req.params.id)
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.post("/", [
    check("productId").notEmpty().withMessage("Product is required"),
    check("quantity").notEmpty().withMessage("Quatity is required"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        if (!req.body.userId) {
            userId = mongoose.Types.ObjectId();
            let cart = new Cart({
                userId,
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            cart.save().then(crt => {
                return res.status(201).json(crt);
            }).catch(error => {
                return res.status(400).json(error)
            })
        }
        else {
            let cart = await Cart.find({ "userId": req.body.userId, "productId": req.body.productId });
            if (cart.length != 0) {
                cart[0].quantity = req.body.quantity;
                cart[0].save().then(crt => {
                    return res.status(201).json(crt);
                }).catch(error => {
                    return res.status(400).json(error)
                })
            } else {
                cart = new Cart({
                    userId: req.body.userId,
                    productId: req.body.productId,
                    quantity: req.body.quantity
                });
                cart.save().then(crt => {
                    return res.status(201).json(crt);
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
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let cart = await Cart.find({ "userId": req.body.userId, "productId": req.body.productId });
        if (cart.length != 0) {
            cart[0].quantity = req.body.quantity;
            cart[0].save().then(crt => {
                return res.status(200).json(crt);
            }).catch(error => {
                return res.status(400).json(error)
            })
        } else {
            return res.status(400).json("Cart not exists")
        }
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.delete("/user/:id/product/:pId", async (req, res) => {
    let cart = await Cart.find({ userId: req.params.id, productId: req.params.pId })
    if (cart == 0) {
        return res.status(400).json("Cannot find cart from given Id")
    }
    else {
        try {
            cart = await Cart.findOneAndDelete({ userId: req.params.id, productId: req.params.pId })
            return res.status(200).json("Deleted");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

router.delete("/user/:id", async (req, res) => {
    let cart = await Cart.find({ userId: req.params.id})
    if (cart == 0) {
        return res.status(400).json("Cannot find cart from given userId")
    }
    else {
        try {
            cart = await Cart.deleteMany({ userId: req.params.id})
            return res.status(200).json("Deleted");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

module.exports = router;