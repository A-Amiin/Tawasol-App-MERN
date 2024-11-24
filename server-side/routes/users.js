// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require("express-validator");
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const config = require('config');

// // @route   POST /
// // @desc    Example user registration
// // @access  Public
// router.post(
//     '/',
//     [
//         // Define validation rules
//         check("name", "Name is required").notEmpty(),
//         check("email", "Please enter a valid email").isEmail(),
//         check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
//     ],
//     async (req, res) => {
//         // Use validationResult to check for errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         try {
//             let user = await User.findOne({ email });
//             if (user) {
//                 return res.status(400).json({ errors: [{ msg: "Email already exists" }] });
//             }
//             user = new User({
//                 name,
//                 email,
//                 password,
//             });
//             // Hash the password before saving it to the database
//             const salt = await bcrypt.genSalt(10);
//             user.password = await bcrypt.hash(password, salt);
//             await user.save();

//             const payload = {
//                 user: {
//                     id: user.id,
//                 }
//             };
//             jwt.sign(
//                 payload, config.get("secrett")), { expireIn: "3 days" }, (err, token) => {
//                     if (err) throw err;
//                     res.json({ token });
//                 }
//         } catch (err) {
//             console.error(err.message);
//             res.status(500).send("Server error");
//             return;
//         }

//         // Extract validated data
//         const { name, email, password } = req.body;

//         // Temporary response for successful validation
//         res.status(200).json({ msg: "Validation passed!", name, email, password });
//     }
// );

// module.exports = router;

const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');

// @route   POST /
// @desc    Example user registration
// @access  Public
router.post(
    '/',
    [
        // Define validation rules
        check("name", "Name is required").notEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: "Email already exists" }] });
            }

            user = new User({
                name,
                email,
                password,
            });

            // Hash the password before saving it to the database
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: {
                    id: user.id,
                }
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: "3 days" },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }
);

module.exports = router;
