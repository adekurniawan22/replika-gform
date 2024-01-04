const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const FormController = require('../controllers/FormController');
const jwtAuth = require('../middlewares/jwtAuth');

// AuthController
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh-token', jwtAuth, AuthController.refresh_Token)

// FormController
router.get('/forms', jwtAuth, FormController.index)
router.post('/forms', jwtAuth, FormController.store)
router.get('/forms/:id', jwtAuth, FormController.show)
router.put('/forms/:id', jwtAuth, FormController.update)
router.delete('/forms/:id', jwtAuth, FormController.destroy)


module.exports = router;