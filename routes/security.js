const express = require("express");
const jwt = require("jsonwebtoken");

const { secret } = require("../config");

let User = require("../models/users");


const router = express.Router();

router.get("/IsLoggedIn/:email", async (req, res) => {
    try {
        try {
            const email = req.params.email;
            let u = await User.find({ "email": email });
            if (u.length != 0) {
                return res.status(200).json(u);
            } else {
                return res.status(400).json("User not found")
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    } catch (error) {
        return res.status(400).json(error)
    }
});

module.exports = router;