const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Order = require('../models/order');
const User = require('../models/user');

const getOrders = async (req, res, next) => {
    let orders;
    try {
        orders = await Order.find({});
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ orders: orders.map(order => order.toObject({ getters: true })) });
};


const getOrderById = async (req, res, next) => {
    const orderId = req.params.oid;

    let order;
    try {
        order = await order.findById(orderId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a order.',
            500
        );
        return next(error);
    }

    if (!order) {
        const error = new HttpError(
            'Could not find order for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ order: order.toObject({ getters: true }) });
};

const getOrdersByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithOrders;
    try {
        userWithOrders = await User.findById(userId).populate('orders');
    } catch (err) {
        const error = new HttpError(
            'Fetching orders failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!userWithOrders || userWithOrders.orders.length === 0) {
        return next(
            new HttpError('Could not find orders for the provided user id.', 404)
        );
    }

    res.json({ orders: userWithOrders.orders.map(order => order.toObject({ getters: true })) });
};

const createOrder = async (req, res, next) => {
    //const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return next(
    //         new HttpError('Invalid inputs passed, please check your data.', 422)
    //     );
    // }

    const { orderNumber, mealsNumber, totalPrice, date, meals, onTable, creator } = req.body;



    const createdOrder = new Order({
        orderNumber,
        mealsNumber,
        totalPrice,
        date,
        meals,
        onTable,
        status: 'in preparation',
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            'Creating order failed, please try again 1.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    // console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdOrder.save({ session: sess });
        user.orders.push(createdOrder);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Creating order failed, please try again 2.',
            500
        );
        return next(error);
    }

    res.status(201).json({ order: createdOrder });
};



const deleteOrder = async (req, res, next) => {
    const orderId = req.params.oid;

    let order;
    try {
        order = await Order.findById(orderId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete order.',
            500
        );
        return next(error);
    }

    if (!order) {
        const error = new HttpError('Could not find order for this id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await order.remove({ session: sess });
        order.creator.orders.pull(order);
        await order.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete order.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted order.' });
};


const updateStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const status = req.body.status;
    const orderId = req.params.oid;
    let order;
    try {
        order = await Order.findById(orderId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update order.',
            500
        );
        return next(error);
    }
    order.status = status;

    try {
        await order.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update order.',
            500
        );
        return next(error);
    }

    res.status(200).json({ order: order.toObject({ getters: true }) });
};

exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.getOrdersByUserId = getOrdersByUserId;
exports.createOrder = createOrder;
exports.deleteOrder = deleteOrder;
exports.updateStatus = updateStatus;

