// api/v1/Auth

const express = require('express');
const {
    RegisterValidators,
    LoginValidators
} = require('../utils/validators/AuthValidators');

const router = express.Router();

const {
    RegisterUser,
    LoginUser,
    ForgetPassword,
    verifyCode,
    Resetpassword
} = require('../controllers/authControllers');

router
    .route('/register')
    .post(RegisterValidators , RegisterUser);

router
    .route('/login')
    .post(LoginValidators , LoginUser);

router
    .route('/password/forgot')
    .post(ForgetPassword);

router
    .route('/password/verify-code')
    .post(verifyCode);

router
    .route('/password/reset')
    .post(Resetpassword);


module.exports = router;