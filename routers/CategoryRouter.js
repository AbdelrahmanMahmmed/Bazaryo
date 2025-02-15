// api/v1/Category
const express = require('express');
const {
    getCategoryValiadtors,
    updateCategoryValiadtors,
    deleteCategoryValiadtors,
    createCategoryValidators,
    UpdateImageValidators
} = require('../utils/validators/CategoryValidators.js');

const { upload } = require('../utils/UploadImage');
const { allwedTo, ProtectedRoters } = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router.use(ProtectedRoters, allwedTo('admin'));

const {
    getCategory,
    getCategorys,
    createCategory,
    UpdateCategory,
    DeleteCategory,
    Update_Image_For_Any_category,
    get_All_Products_On_CatergoryID
} = require('../controllers/categoryControllers.js');


router.put('/update-Image-Category/:id',
    upload.single('image'),
    UpdateImageValidators,
    Update_Image_For_Any_category
);

router.get("/:CategoryId/Products", get_All_Products_On_CatergoryID);


router
    .route('/')
    .get(getCategorys)
    .post(upload.single('image'), createCategoryValidators, createCategory);

router
    .route('/:id')
    .get(getCategoryValiadtors, getCategory)
    .put(updateCategoryValiadtors, UpdateCategory)
    .delete(deleteCategoryValiadtors, DeleteCategory);

module.exports = router;