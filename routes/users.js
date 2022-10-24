const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require('express-validator');

const { secret } = require("../config");
let User = require("../models/users");

const router = express.Router();

const isUserAuthorize = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json("User is not loggedin");
    }
    try {
        const user = jwt.verify(token, secret);
        if (!user) {
            res.clearCookies("token");
            return res.status(400).json("Authentication failed");
        }
        next();
    } catch (err) {
        return res.status(500).json(err);
    }
}

router.get("/", async (req, res) => {
    try {
        let users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(400).json(error)
    }
});

router.get("/:id", async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json(error)
    }
});

let checkEmail = function (email) {
    let str = email.substr(email.length - 3)
    if (str != "com") {
        throw new Error("Domain should be .com")
    }
    return true
}

router.post("/signin", [
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid").custom(val => checkEmail(val)),
    check("password").notEmpty().withMessage("Password is required").isLength({ min: 5 }).withMessage("Atleast 5 characters")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    try {
        let password = await bcrypt.compare(req.body.password, user.password);
        if (!password) {
            return res.status(400).json({ message: "Not Found" });
        }
        let payload = { email: user.email };
        let token = jwt.sign(payload, secret, { expiresIn: "2h" }); 
        res.cookie("token", token, { httpOnly: true, maxAge: 100000 });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/signup", [
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid").custom(val => checkEmail(val)),
    check("password").notEmpty().withMessage("Password is required").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage("Password must include one lowercase character, one uppercase character, a number, and a special character."),
    check("name").notEmpty().withMessage("Name is required"),
    check("address").notEmpty().withMessage("address is required")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(req.body.password, salt);
        let user = new User({
            email: req.body.email,
            password,
            name: req.body.name,
            address: req.body.address
        });
        user.save().then(usr => {
            let payload = { email: usr.email };
            let token = jwt.sign(payload, secret, { expiresIn: "2h" }); 
            res.cookie("token", token, { httpOnly: true, maxAge: 100000 });
            return res.status(201).json("User with " + usr.email + " registered");
        }).catch(error => {
            return res.status(400).json(error)
        })
    } catch (err) {
        return res.status(400).json(err);
    }
});

router.put("/", [
    check("id").notEmpty().withMessage("Id is required")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    try {
        let user = await User.findById(req.body.id)
        if (user) {
            if (req.body.email) {
                let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
                if (regex.test(req.body.email)) {
                    user.email = req.body.email
                } else {
                    return res.status(400).json("Invalid Email");
                }
            }
            if (req.body.name) {
                user.name = req.body.name
            }
            if (req.body.password) {
                let regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
                if (regex.test(req.body.password)) {
                    user.password = req.body.password
                } else {
                    return res.status(400).json("Password must include one lowercase character, one uppercase character, a number, and a special character.");
                }
            }
            if (req.body.address) {
                if (req.body.address.street) {
                    user.address.street = req.body.address.street
                }
                if (req.body.address.city) {
                    user.address.city = req.body.address.city
                }
                if (req.body.address.province) {
                    user.address.province = req.body.address.province
                }
                if (req.body.address.country) {
                    user.address.country = req.body.address.country
                }
            }
            user.save().then(usr => {
                return res.status(201).json("User updated");
            }).catch(error => {
                return res.status(400).json(error)
            })
        } else {
            res.status(400).json("wrong user id");
        }
    } catch (error) {
        res.status(400).json(error);
    }
    
});

module.exports = router;