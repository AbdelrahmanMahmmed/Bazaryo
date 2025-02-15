// api/v1/User

const express = require('express');
const {
    deleteUserValiadtors,
    getUserValiadtors,
    updateUserValidators,
    createUserValidators,
    ChanagesPasswordUserValiadtors
} = require('../utils/validators/UserValidators');
const { upload } = require('../utils/UploadImage');
const { allwedTo, ProtectedRoters } = require('../controllers/authControllers');
const router = express.Router();

const {
    getUsers,
    getUser,
    UpdateUser,
    deleteUser,
    ChangePassword,
    CreateUser,
    activeUser,
    UnactiveUser,
    updatealldataUser,
    getAccount,
    updatePassword,
    Update_Image_For_Any_User
} = require('../controllers/userControiiers');
router.use(ProtectedRoters);


// buyer
router.get('/me', allwedTo('buyer', 'seller' ,'admin'), getAccount, getUser);
router.post('/me/activate', activeUser);
router.delete('/me/deactivate', UnactiveUser);
router.post('/me/profile', updatealldataUser);
router.post('/me/profile/update-image', upload.single('profileImage'), Update_Image_For_Any_User);


// Admin
router.use(allwedTo('admin'));

router.route('/admin')
    .get(getUsers)
    .post(createUserValidators, CreateUser)

router.route('/admin/:id/')
    .put(updateUserValidators, UpdateUser)
    .get(getUserValiadtors, getUser)
    .delete(deleteUserValiadtors, deleteUser)

router.post('/admin/changePassword/:id/', ChanagesPasswordUserValiadtors, ChangePassword);

module.exports = router;