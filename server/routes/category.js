const express = require('express');
let app = express();

let Category = require('../models/category');
let { verificateToken, verificateAdmin_Role } = require('../middlewares/authentication');


// Return all the categories
app.get('/category', verificateToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });
        });
});

// Return a category for ID
app.get('/category/:id', verificateToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'The id is not valid'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

// Create a new category
app.post('/category', verificateToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    })
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

// Update a category
app.put('/category/:id', verificateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategory = {
        description: body.description
    };
    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});


// Delete a category
app.delete('/category/:id', [verificateToken, verificateAdmin_Role], (req, res) => {
    let id = req.params.id;


    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The id doesnt exists'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Category deleted'
        });
    });

});






module.exports = app;