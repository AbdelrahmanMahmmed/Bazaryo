const { json } = require('express');
const User = require('../models/Usermodels');
const ApiError = require('../utils/APIError');
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const bcyrpt = require('bcryptjs');
const crypto = require('crypto');
const SendEmail = require('../utils/sendEmail');
const cookieParser = require('cookie-parser');


exports.RegisterUser = asyncHandler(async (req, res, next) => {
    // 1) Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    // Save the user to the database
    await user.save();
    // 2) Generate a Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
    // 3) Save your token on Cookies
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME,
    });
    // 4) Send the token in response
    res.status(201).json({
        user,
        token,
    });
});


exports.LoginUser = asyncHandler(async (req, res, next) => {
    // 1) If User is Existed or Not
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcyrpt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }
    // 2) Generate a Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    //3) save your token on Cookies
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME
    });
    // 4) send the token in response
    res.status(201).json({
        user,
        token
    });
});

exports.ProtectedRoters = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError("You are not logged in", 401));
    }
    // 2- Verify token (no chanage happens , expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 3- check if user is Exist or Not
    const user = await User.findById(decoded.userId);
    if (!user) {
        return next(new ApiError('User no longer exists', 401));
    }
    // 4- check if user chanage is password after token created
    if (user.passwordChanagedAt) {
        const passChanagedTimestamp = parseInt(user.passwordChanagedAt.getTime() / 1000, 10);
        // if password chanaged after token created then return error
        if (passChanagedTimestamp > decoded.iat) {
            return next(new ApiError('Your password has been changed, please login again', 401));
        }
    }
    req.user = user;
    next();
});

exports.allwedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!(roles.includes(req.user.role))) {
        return next(new ApiError('You are not authorized to access this route', 403));
    }
    next();
});

exports.ForgetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`User not found for ${req.body.email}`, 404));
    }
    const GenerateaCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashResertCode = crypto.
        createHash('sha256')
        .update(GenerateaCode)
        .digest('hex');

    user.passwordResetCode = hashResertCode;
    user.passwordResetExpiret = Date.now() + 10 * 6 * 1000;  // 10 minutes
    user.passwordResetVerifed = false;
    await user.save();

    const resetMessage = `
    Hello ${user.name},
    
    You have requested to reset your password. Please use the following code to complete the process:
    
    Reset Code: ${GenerateaCode}
    
    If you did not request this, please ignore this email or contact our support team for assistance.
    
    Thank you,
    BAZARYO Team
    `;
    try {
        await SendEmail({
            to: user.email,
            subject: 'Password Code From BAZARYO',
            text: resetMessage
        });
    } catch (err) {
        user.passwordResetCode = undefined,
            user.passwordResetExpiret = undefined,
            user.passwordResetVerifed = undefined,
            await user.save();
        return next(new ApiError('Failed to send email, please try again later', 500));
    }
    res.status(200).json({
        message: "Password Code sent successfully"
    });
});

exports.verifyCode = asyncHandler(async (req, res, next) => {
    const hashResertCode = crypto.
        createHash('sha256')
        .update(req.body.passwordResetCode)
        .digest('hex');
    const user = await User.findOne({ passwordResetCode: hashResertCode });
    if (!user) {
        return next(new ApiError('Invalid or expired reset password code'));
    }
    user.passwordResetVerifed = true;
    await user.save();
    res.status(200).json({
        message: 'Password reset code verified successfully'
    });
});

exports.Resetpassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError('There is no user with email ' + req.body.email, 404));
    }
    if (!(user.passwordResetVerifed)) {
        return next(new ApiError('Invalid or expired reset password code', 400));
    }

    user.password = req.body.NewPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpiret = undefined;
    user.passwordResetVerifed = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME
    });

    res.status(200).json({
        message: 'Password has been reset successfully',
        token
    });
});