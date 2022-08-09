const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById);

router.get('/onTable/:uid', usersController.getUserTableById);


router.post(
    '/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ],
    usersController.signup
);

router.post('/login', usersController.login);

router.patch(
    '/update-name/:uid',
    [
        check('onTable').not().isEmpty(),
    ],
    usersController.updateName
);

router.patch(
    '/update-email/:uid',
    [
        check('onTable').not().isEmpty(),
    ],
    usersController.updateEmail
);

router.patch(
    '/update-table/:pid',
    [
        check('onTable').not().isEmpty(),
    ],
    usersController.updateTable
);

module.exports = router;
