const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const app = express();



app.get('/user', function(req, res) {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    User.find({})
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
            User.count({}, (err, quantity) => {
                res.json({
                    ok: true,
                    users,
                    quantity
                });
            });

        });
})
app.post('/user', function(req, res) {
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
app.put('/user/:id', function(req, res) {
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
app.delete('/user', function(req, res) {
    res.json('delete user')
});

module.exports = app;