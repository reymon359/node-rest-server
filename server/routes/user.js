const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = express();



app.get('/user', function(req, res) {
    res.json('get user');
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
    res.json({
        id
    });
})
app.delete('/user', function(req, res) {
    res.json('delete user')
});

module.exports = app;