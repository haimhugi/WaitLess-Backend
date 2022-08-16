const express = require('express');
const { check } = require('express-validator');

const mealsController = require('../controllers/meals-controller');

const router = express.Router();

router.get('/', mealsController.getMeals);

router.get('/categories', mealsController.getCategories);


router.get('/:mid', mealsController.getMealNameById);


router.post(
    '/add-meal',
    [
        check('image').not().isEmpty(),
        check('name').not().isEmpty(),
        check('description').not().isEmpty(),
        check('price').not().isEmpty(),
        check('category').not().isEmpty(),
    ],
    mealsController.createMeal);

router.post(
    '/add-category',
    [check('name').not().isEmpty()
    ],
    mealsController.createCategory);

router.patch(
    '/:pid',
    [
        check('image').not().isEmpty(),
        check('name').not().isEmpty(),
        check('description').not().isEmpty(),
        check('price').not().isEmpty(),
        check('category').not().isEmpty(),
    ],
    mealsController.updateMeal
);

router.patch(
    '/update-review/:pid',
    [
        check('review').not().isEmpty(),
    ],
    mealsController.updateReview
);




router.delete('/deleteMeal/:uid', mealsController.deleteMeal);
router.delete('/deleteCategory/:cname', mealsController.deleteCategory);



module.exports = router;
