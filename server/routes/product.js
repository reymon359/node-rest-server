const express = require('express');
let app = express();

let Product = require('../models/product');
let { verificateToken, verificateAdmin_Role } = require('../middlewares/authentication');

// Return all the products
app.get('/products', verificateToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    Product.find({ avaliable: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            });
        });
});

// Return a product by the id
app.get('/products/:id', verificateToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'that product ID doesnt exist'
                    }
                });
            }
            res.json({
                ok: true,
                product: productDB
            });
        });



});

// Create a new product
app.post('/products', verificateToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        user: req.user._id,
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        avaliable: body.avaliable,
        category: body.category,
    });
    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The product doesnt exist'
                }
            });
        }
    });
});

// Update a product
app.put('/products/:id', verificateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        productDB.name = body.name;
        productDB.unitPrice = body.unitPrice;
        productDB.description = body.description;
        productDB.avaliable = body.avaliable;
        productDB.category = body.category;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: productSaved
            });
        });
    });

});

// Delete a product
app.delete('/products/:id', verificateToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'that product ID doesnt exist'
                }
            });
        }
        productDB.avaliable = false;
        productDB.save((err, productDeleted) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: productDeleted,
                message: 'Product deleted'
            });
        });
    });
});


module.exports = app;