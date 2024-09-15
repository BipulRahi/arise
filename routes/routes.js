const express = require('express');
const router = express.Router();
const {getUsers,register, register_verification, login, login_veri} = require('../controllers/userController');
// const passkeyController = require('./controllers/passkeyController');

// User routes
router.get('/users', getUsers);
router.post('/register',register);
router.post('/register-verify',register_verification);
router.post('/login',login);
router.post('/login-verify',login_veri);



// router.post('/users', userController.createUser);
// router.get('/users/:id', userController.getUserById);
// router.put('/users/:id', userController.updateUser);
// router.delete('/users/:id', userController.deleteUser);

// Passkey routes
// router.post('/passkeys', passkeyController.createPasskey);
// router.get('/passkeys/:userId', passkeyController.getUserPasskeys);

module.exports = router;