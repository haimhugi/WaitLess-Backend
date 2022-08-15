const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Meal = require('../models/meal');
const Category = require('../models/category');
//const Review = require('../models/review');

const getMeals = async (req, res, next) => {
    let meals;
    let categories;
    try {
        meals = await Meal.find({});
        categories = await Category.find({});

    } catch (err) {
        const error = new HttpError(
            'Fetching meals and categories failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({
        meals: meals.map(meal => meal.toObject({ getters: true })),
        categories: categories.map(category => category.toObject({ getters: true }))
    }
    );
};

const getCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find({});

    } catch (err) {
        const error = new HttpError(
            'Fetching categories failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({
        categories: categories.map(category => category.toObject({ getters: true }))
    }
    );
};

const getMealNameById = async (req, res, next) => {
    const mealId = req.params.mid;

    let meal;
    try {
        meal = await Meal.findById(mealId);
    } catch (err) {
        const error = new HttpError(
            'Fetching user failed, please try again later.',
            500
        );
        return next(error);
    }
    if (!meal) {
        console.log(mealId);
        const error = new HttpError(
            'Invalid credentials, could not find user.',
            401
        );
        return next(error);
    }

    res.json({
        name: meal.name
    });
};


const createMeal = async (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     throw new HttpError('Invalid inputs passed , please check your data', 422);
    // }
    const { image, name, description, price, category } = req.body;
    console.log('image is ' + image + ' ');
    console.log('name is ' + name + ' ');
    console.log('description is ' + description + ' ');
    console.log('price is ' + price + ' ');
    console.log('category is ' + category + ' ');


    const createdMeal = new Meal({
        image,
        name,
        description,
        price,
        review: { numOfReviews: 0, average: 0 },
        category
    });

    try {
        await createdMeal.save();
    } catch (err) {
        // const error = new HttpError('Creating meal failed,please try again', 500);
        // return next(error);
        console.log(err);
    }

    res.status(201).json({ meal: createdMeal });
};


const updateMeal = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { image, name, description, price, category } = req.body;
    const mealId = req.params.pid;

    let meal;
    try {
        meal = await Meal.findById(mealId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update meal.',
            500
        );
        return next(error);
    }

    meal.image = image;
    meal.name = name;
    meal.description = description;
    meal.price = price;
    //meal.reviews = reviews;
    meal.category = category;

    try {
        await meal.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update place.',
            500
        );
        return next(error);
    }

    res.status(200).json({ meal: meal.toObject({ getters: true }) });
};

const deleteMeal = async (req, res, next) => {
    const mealId = req.params.uid;
    let meal;
    try {
        meal = await Meal.findById(mealId);
    } catch (err) {
        const error = new HttpError('Deleting meal failed1,please try again', 500);
        return next(error);
    }

    try {
        await meal.remove();
    } catch (err) {
        const error = new HttpError('Deleting meal failed,please try again', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Deleted meal.' });
};



const createCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed , please check your data', 422);
    }
    const name = req.body;

    const createdCategory = new Category(name);

    try {
        await createdCategory.save();
    } catch (err) {
        const error = new HttpError('Creating category failed,please try again', 500);
        return next(error);
    }

    res.status(201).json({ category: createdCategory });
};

const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.uid;
    let category;
    try {
        category = await Category.findById(categoryId);
    } catch (err) {
        const error = new HttpError('Deleting category failed1,please try again', 500);
        return next(error);
    }

    try {
        await category.remove();
    } catch (err) {
        const error = new HttpError('Deleting category failed,please try again', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Deleted category.' });
};

const updateReview = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const review = +req.body.review;
    const mealId = req.params.pid;
    let meal;
    try {
        meal = await Meal.findById(mealId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update meal.',
            500
        );
        return next(error);
    }
    meal.review.average = ((meal.review.average * meal.review.numOfReviews) + review) / (meal.review.numOfReviews + 1);
    meal.review.numOfReviews += 1;
    try {
        await meal.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update meal.',
            500
        );
        return next(error);
    }

    res.status(200).json({ meal: meal.toObject({ getters: true }) });
};



exports.getMeals = getMeals;
exports.getCategories = getCategories;
exports.getMealNameById = getMealNameById;
exports.createMeal = createMeal;
exports.updateMeal = updateMeal;
exports.deleteMeal = deleteMeal;
exports.createCategory = createCategory;
exports.deleteCategory = deleteCategory;
exports.updateReview = updateReview;





