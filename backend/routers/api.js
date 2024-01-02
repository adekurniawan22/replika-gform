const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const jwtAuth = require('../middlewares/jwtAuth');

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh-token', jwtAuth, AuthController.refresh_Token)

module.exports = router;