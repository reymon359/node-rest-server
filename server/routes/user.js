const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { verificateToken, verificateAdmin_Role } = require('../middlewares/authentication')

const app = express();



app.get('/user', verificateToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    // In the string after we can choose with fields return
    User.find({ status: true }, 'name email img role status google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // The count condition must be the same as the find({})
            User.count({ status: true }, (err, quantity) => {
                res.json({
                    ok: true,
                    users,
                    quantity
                });
            });

        });
})
app.post('/user', [verificateToken, verificateAdmin_Role], function(req, res) {
    let body = req.body;
    // Here we create a new user with the params given in the request body
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    // Now we save it in to the bbdd
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
})
app.put('/user/:id', [verificateToken, verificateAdmin_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);
    // This is a way to not update certain properties
    // But we used underscore .pick instead 
    // delete body.password;
    // delete body.google;
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });

    });
});
app.delete('/user/:id', [verificateToken, verificateAdmin_Role], function(req, res) {
    let id = req.params.id;
    // This way the user is deleted from DB
    // User.findByIdAndRemove(id, (err, userDeleted) => {
    // This way it just changes it status
    let statusChange = {
        status: false
    };
    User.findByIdAndUpdate(id, statusChange, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }
        res.json({
            ok: true,
            user: userDeleted
        });
    });
});

module.exports = app;