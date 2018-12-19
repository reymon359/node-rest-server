const express = require('express');
let app = express();

let Product = require('../models/product');
let { verificateToken, verificateAdmin_Role } = require('../middlewares/authentication');

// Return all the products
app.get('/products', (req, res) => {

});

// Return a product by the id
app.get('/products/:id', (req, res) => {

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
                    message: 'The product doesnt exists'
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
app.delete('/products/:id', (req, res) => {

});


module.exports = app;