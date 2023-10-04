const express = require("express");
const authRouter = express.Router();
const user = require("../model/model.js");
const accountSid = "AC87a8fc73b94fbe3d3c380c0848d31c77";
const authToken = "8407cd232266485cef3d95f193ddcdd8";
const client = require("twilio")(accountSid, authToken);

authRouter.get('/api', function (req, res) {
    res.json({
        status: 'API Works',
        message: 'Welcome to User Signin/Signup API'
    });
});
const User = require('../model/model.js');


let otp; 
let users;

authRouter.post("/signup", async (req, res) => {
    try {
        const { username, number } = req.body;
        const existingUser = await User.findOne({ number });

        if (existingUser) {
            return res.status(400).json({ msg: "User with the same number already exists! Please check" });
        }

        users = new User({
            username,
            number
        });

        let digits = "0123456789";
        otp = "";
        for (let i = 0; i < 4; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }

        await client.messages
            .create({
                body: `Your OTP verification for user ${username}: ${otp}`,
                messagingServiceSid: "MG77a1c244f5147eafde8a3de65fb89a9c",
                to: `+91${number}`
            })
            .then(() => res.status(200).json({ msg: "Message Sent" }))
            .done();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.post("/signup/verify", async (req, res) => {
    try {
        const { otp } = req.body;
        if (otp !== otp) {
            return res.status(400).json({ msg: "Incorrect OTP." });
        }
        await users.save();
        const token = jwt.sign({ id: users._id }, "passwordkey");
        res.status(200).json({ token, ...users._doc });
        otp = "";
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

let signinUser;

authRouter.post("/signin", async (req, res) => {
    try {
        const { number } = req.body;
        signinUser = await user.findOne({ number });
        if (!signinUser) {
            return res.status(400).json({ msg: "This number does not exist!!!" });
        }

        let digits = "0123456789";
        otp = "";
        for (let i = 0; i < 4; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }

        await client.messages
            .create({
                body: `Your OTP verification for user ${signinUser.username} is ${otp}`,
                messagingServiceSid: "MG77a1c244f5147eafde8a3de65fb89a9c",
                to: `+91${number}`
            })
            .then(message => res.status(200).json({ msg: "Message sent successfully" }))
            .done();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.post("/signin/verify", async (req, res) => {
    try {
        const { otp } = req.body;
        if (otp !== otp) {
            return res.status(400).json({ msg: "Incorrect OTP." });
        }
        const token = jwt.sign({ id: signinUser._id }, "passwordKey");
        res.status(200).json({ token, ...signinUser._doc });
        otp = "";
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = authRouter;
