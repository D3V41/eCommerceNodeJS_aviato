const express = require("express");
const { check, validationResult } = require('express-validator');

let Banner = require("../models/banners");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let banners = await Banner.find()
        return res.status(200).json(banners)
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.get("/:id", async (req, res) => {
    try {
        let banner = await Banner.findById(req.params.id)
        return res.status(200).json(banner);
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.post("/", [
    check("name").notEmpty().withMessage("Name is required"),
    check("title").notEmpty().withMessage("Title is required"),
    check("subtitle").notEmpty().withMessage("Subtitle is required"),
    check("src").notEmpty().withMessage("src is required").isBase64().withMessage("image must be in base64 from")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let b = await Banner.find({ "name": req.body.name, "title": req.body.title });
        if (b.length != 0) {
            return res.status(400).json("Banner already exists")
        } else {
            let banner = new Banner({
                name: req.body.name,
                title: req.body.title,
                subtitle: req.body.subtitle,
                src: req.body.src,
            });
            banner.save().then(bnr => {
                return res.status(201).json(bnr);
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
    check("src").optional().isBase64().withMessage("image must be in base64 from"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let banner = await Banner.findById(req.body.id);
        if (banner) {
            if (req.body.name) {
                banner.name = req.body.name
            }
            if (req.body.title) {
                banner.title = req.body.title
            }
            if (req.body.subtitle) {
                banner.subtitle = req.body.subtitle
            }
            if (req.body.src) {
                banner.src = req.body.src
            }
            banner.save().then(bnr => {
                return res.status(201).json(bnr);
            }).catch(error => {
                return res.status(400).json(error)
            })
        } else {
            return res.status(400).json("Banner not exists")
        }        
    } catch (err) {
        return res.status(400).json(err);
    }
});

module.exports = router;