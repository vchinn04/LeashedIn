const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../auth");

const User = require("../model/user");//docker ../model/user, dev ../model/User

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });

        }

        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, { httpOnly: true });
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

/**
 * @method - POST
 * @description - Login User
 * @param - /user/login
 */
router.post(
    "/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user)
                return res.status(400).json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, { httpOnly: true });
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/get
 */

router.post("/get", async (req, res) => {
    try {
        const { username } = req.body;
        let artist = await User.findOne({
            "username": username
        });
        if (!artist)
            return res.status(400).json({
                message: "Artist Does Not Exist"
            });

        res.json({ username: artist.username, profilePic: artist.profilePic });
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

/**
 * @method - POST
 * @description - Change Email
 * @param - /user/changeEmail
 */

router.post("/changeEmail", [
    check("email", "Please enter a valid email").isEmail()], auth, async (req, res) => {
        try {
            // request.user is getting fetched from Middleware after token authentication
            const user = await User.findById(req.user.id);
            const { email } = req.body;
            user.email = email;
            await user.save(); //this might report unresolved but it lies
            res.json(user);
        } catch (e) {
            res.send({ message: e });
        }
    });

/**
 * @method - POST
 * @description - Change Profile Pic
 * @param - /user/changePic
 */

router.post("/changePic", auth, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await User.findById(req.user.id);
        const { profilePic } = req.body;
        user.profilePic = profilePic;
        await user.save(); //this might report unresolved but it lies
        res.json(user);
    } catch (e) {
        res.send({ message: e });
    }
});

module.exports = router;