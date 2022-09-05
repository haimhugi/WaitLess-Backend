const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mealsRoutes = require('./routes/meals-routes');
const usersRoutes = require('./routes/users-routes');
const ordersRoutes = require('./routes/orders-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/orders', ordersRoutes);



app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' });
});


mongoose.connect('mongodb+srv://HaimHugi:pass1234@cluster0.wsdcptt.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5001);
    })
    .catch(err => {
    });
