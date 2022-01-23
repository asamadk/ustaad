const express = require('express');
const auth = require('../Middleware/auth');
const verifyRole = require('../Middleware/authorization');
const router = express.Router();

const HomeService = require('../Service/HomeService');

router.post('/register',HomeService.registerUser);
router.post('/login',HomeService.loginService);
router.post('/password',HomeService.changePassword);
router.post('/reset',HomeService.resetPassword);

module.exports = router;