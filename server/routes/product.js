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
app.post('/products', (req, res) => {

});

// Update a product
app.put('/products/:id', (req, res) => {

});

// Delete a product
app.delete('/products/:id', (req, res) => {

});


module.exports = app;