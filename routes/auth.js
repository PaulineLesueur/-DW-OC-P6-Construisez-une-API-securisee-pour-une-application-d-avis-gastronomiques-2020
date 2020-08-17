const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authCtrl = require('../controllers/auth');
const authLimit = rateLimit({
    max: 3,
    windowMs: 5 * 60 * 1000,
    message: "Nombre maximal d'essais atteint, merci de patienter 5 minutes avant de réessayer"
});

router.post('/signup', authCtrl.signup);
router.post('/login', authLimit, authCtrl.login);

module.exports = router;