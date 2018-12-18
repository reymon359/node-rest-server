const express = require('express');

let { verificateToken } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');









module.exports = app;