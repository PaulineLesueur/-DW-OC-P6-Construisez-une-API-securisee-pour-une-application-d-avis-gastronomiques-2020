const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authCtrl = require('../controllers/auth');

const authLimit = rateLimit({ //used to prevent brute force attacks
    max: 3,
    windowMs: 5 * 60 * 1000,
    message: "You've sent to many requests (limited to 3), you've been blocked. Please, retry in 5 minutes."
});

router.post('/signup', authCtrl.signup);
router.post('/login', authLimit, authCtrl.login);

module.exports = router;