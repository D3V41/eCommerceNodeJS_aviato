const express = require("express");
const { check, validationResult } = require('express-validator');

let Product = require("../models/products");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let products = await Product.find()
        return res.status(200).json(products)
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.get("/:id", async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.post("/", [
    check("type").notEmpty().withMessage("Type is required"),
    check("title").notEmpty().withMessage("Title is required"),
    check("details").notEmpty().withMessage("Details is required"),
    check("oldPrice").notEmpty().withMessage("old price is required").isFloat().withMessage("old price should be numeric"),
    check("newPrice").notEmpty().withMessage("new price is required").isFloat().withMessage("new price should be numeric"),
    check("src").notEmpty().withMessage("src is required").isBase64().withMessage("image must be in base64 from"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let p = await Product.find({ "type": req.body.type, "title": req.body.title });
        if (p.length != 0) {
            return res.status(400).json("Product already exists")
        } else {
            let product = new Product({
                type: req.body.type,
                title: req.body.title,
                details: req.body.details,
                oldPrice: req.body.oldPrice,
                newPrice: req.body.newPrice,
                src: req.body.src,
            });
            product.save().then(pdr => {
                return res.status(201).json(pdr);
            }).catch(error => {
                return res.status(400).json(error)
            })
        }
        
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.put("/", [
    check("id").notEmpty().withMessage("Id is required"),
    check("oldPrice").optional().isFloat().withMessage("old price should be numeric"),
    check("newPrice").optional().isFloat().withMessage("new price should be numeric"),
    check("src").optional().isBase64().withMessage("image must be in base64 from"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let product = await Product.findById(req.body.id);
        if (product) {
            if (req.body.type) {
                product.type = req.body.type
            }
            if (req.body.title) {
                product.title = req.body.title
            }
            if (req.body.details) {
                product.details = req.body.details
            }
            if (req.body.oldPrice) {
                product.oldPrice = req.body.oldPrice
            }
            if (req.body.newPrice) {
                product.newPrice = req.body.newPrice
            }
            if (req.body.src) {
                product.src = req.body.src
            }
            product.save().then(pdr => {
                return res.status(201).json(pdr);
            }).catch(error => {
                return res.status(400).json(error)
            })
        } else {
            return res.status(400).json("Product not exists")
        }        
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    let product = await Product.findById(req.params.id)
    if (product == 0) {
        return res.status(400).json("Cannot find product from given Id")
    }
    else {
        try {
            product = await Product.findOneAndDelete(req.params.id)
            return res.status(200).json("Deleted");
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

module.exports = router;