const { json } = require('express');
const User = require('../models/Usermodels');
const ApiError = require('../utils/APIError');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs');
const { uploadImage } = require('../utils/UploadImage')

// @desc   Find All Users
// @router Get   api/v1/Users
// @access   Private/protected
exports.getUsers = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.query.role) {
        filter = { role: req.query.role }
    }
    const Users = await User.find(filter);
    res.status(200).json({
        NumbersOfUsers: Users.length,
        data: Users
    });
});

// @desc   Find User
// @router Get   api/v1/Users
// @access   Private/protected
exports.getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let selectFields = '-__v -password';
    if (req.user.role === "buyer") {
        selectFields += ' -storeName -storeDescription -rating -Products -permissions -isVerified';
    }
    else if (req.user.role === "seller") {
        selectFields += ' -permissions -Wishlists -Cart -isVerified';
    }
    else if (req.user.role === "admin") {
        selectFields += ' -storeName -Wishlists -Cart -storeDescription -rating -Products -isVerified';
    }
    const user = await User.findById(id).select(selectFields);
    if (!user) {
        return next(new ApiError(`User not found for ID: ${id}`, 404));
    }

    res.status(200).json({
        data: user
    });
});

// @desc   Update User
// @router PUT   api/v1/Users/:id
// @access   Private/protected
exports.UpdateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        storeName: req.body.storeName,
        storeDescription: req.body.storeDescription
    }, { new: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        message: 'Data updated successfully',
        data: user,
    });
});

// @desc   Delete User
// @router DELETE   api/v1/Users/:id
// @access   Private/protected
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const User = await User.findByIdAndDelete(id);
    if (!User) {
        return next(new ApiError(`User not found for ${id}`, 404));
    }
    res.status(200).json({
        message: "Deleted successflly..."
    });
});


// @desc   ChangePassword User
// @router POST   api/v1/Users/:id
// @access   Private/protected
exports.ChangePassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new ApiError(`User not found for ${id}`, 404));
    }
    user.password = await bcrypt.hash(req.body.password, 12);
    user.passwordChanagedAt = Date.now();
    await user.save();
    res.status(200).json({
        message: "Password Updated successfully...",
    });
});


// @desc   Create New User
// @router POST   api/v1/Users/:id
// @access   Private/protected
exports.CreateUser = asyncHandler(async (req, res, next) => {
    const { name, email, password  ,  phoneNumber , profileImage , role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    const USER = await User.create({
        name,
        email,
        profileImage: profileImage || 'default.jpg',
        password: await bcrypt.hash(password, 12),
        passwordChangedAt: Date.now(),
        role,
        phoneNumber
    });
    res.status(201).json({ data: USER });
});

// @desc   get Current User
// @router POST   api/v1/Users/
// @access   Private/protected
exports.getAccount = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})

// @desc   Update All data for current user
// @router PUT   api/v1/User/:id
// @access   Private/protect
exports.updatealldataUser = asyncHandler(async (req, res, next) => {
    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    };
    const USER = await User.findByIdAndUpdate(
        req.user._id,
        updatedData,
        { new: true }
    );
    res.status(200).json({
        message: 'Data updated successfully',
        data: USER,
    });
});

// @desc   UnActive for current user
// @router POST   api/v1/User/:id
// @access   Private/protect
exports.UnactiveUser = asyncHandler(async (req, res, next) => {
    const updatedData = {
        IsActive: false,
    };
    const USER = await User.findByIdAndUpdate(
        req.user._id,
        updatedData,
        { new: true }
    );
    res.status(200).json({
        message: 'You Unactive Now',
    });
});

// @desc   Active for current user
// @router POST   api/v1/User/:id
// @access   Private/protect
exports.activeUser = asyncHandler(async (req, res, next) => {
    const updatedData = {
        IsActive: true,
    };
    const USER = await User.findByIdAndUpdate(
        req.user._id,
        updatedData,
        { new: true }
    );
    res.status(200).json({
        message: 'You Active Now',
    });
});

// @desc    Update_Image_For_Any_User
// @router POST   api/v1/User/update-image
// @access   Private/protect
exports.Update_Image_For_Any_User = asyncHandler(async (req, res, next) => {
    try {
        let imageUrl = '';
                if (req.file) {
            const result = await uploadImage(req.file);
            imageUrl = result.secure_url;
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.profileImage = imageUrl;
        await user.save();
        res.status(200).json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
