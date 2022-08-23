const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
    const userId = req.params.uid.replace(/\r?\n|\r/g, "");
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Fetching user failed, please try again later.',
            500
        );
        return next(error);
    }
    if (!user) {
        console.log(userId);
        const error = new HttpError(
            'Invalid credentials, could not find user.',
            401
        );
        return next(error);
    }

    res.json({
        user: user.toObject({ getters: true })
    });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password,
        orders: [],
        onTable: 0,
        isAdmin: false
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Loggin in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    res.json({
        message: 'Logged in!',
        user: existingUser.toObject({ getters: true })
    });
};

const updateName = async (req, res, next) => {

    const name = req.body.name;
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update table.',
            500
        );
        return next(error);
    }
    user.name = name;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save update onTable.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const updateEmail = async (req, res, next) => {

    const email = req.body.email;
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update table.',
            500
        );
        return next(error);
    }
    user.email = email;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save update onTable.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const updatePassword = async (req, res, next) => {
    const userId = req.params.uid;
    const { oldPassword, newPassword } = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update table.',
            500
        );
        return next(error);
    }

    if (!user || user.password !== oldPassword) {
        const error = new HttpError(
            'Invalid old password, could not change password ',
            401
        );
        return next(error);
    }

    user.password = newPassword;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save update password.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};




const getUserTableById = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Fetching user failed, please try again later.',
            500
        );
        return next(error);
    }
    if (!user) {
        console.log(userId);
        const error = new HttpError(
            'Invalid credentials, could not find user.',
            401
        );
        return next(error);
    }

    res.json({
        onTable: user.onTable
    });
};




const updateTable = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const onTable = req.body.onTable;
    const userId = req.params.pid;
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update table.',
            500
        );
        return next(error);
    }
    user.onTable = onTable;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save update onTable.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Deleting user failed1,please try again', 500);
        return next(error);
    }

    try {
        await user.remove();
    } catch (err) {
        const error = new HttpError('Deleting user failed,please try again', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Deleted user.' });
};


exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateName = updateName;
exports.updateEmail = updateEmail;
exports.updatePassword = updatePassword;
exports.getUserTableById = getUserTableById;
exports.updateTable = updateTable;
exports.deleteUser = deleteUser;
