const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { signup, login, getUser, logout } = require('../controllers/authController');

// @route    POST api/auth/signup
// @desc     Register user
// @access   Public
router.post(
    '/signup',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        signup(req, res);
    }
);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        login(req, res);
    }
);

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, getUser);

// @route    POST api/auth/logout
// @desc     Logout user
// @access   Private
router.post('/logout', auth, logout);


module.exports = router;
