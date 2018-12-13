require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/users', function(req, res) {
    res.json('get user')
})
app.post('/users', function(req, res) {
    let body = req.body;
    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'The name is required'
        });
    }
    res.json({ body });
})
app.put('/users/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})
app.delete('/users', function(req, res) {
    res.json('delete user')
});
// Connecting with the database
mongoose.connect('mongodb://localhost:27017/coffee', (err, res) => {
    if (err) throw err;
    console.log('Data base ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log('Listening port: ', process.env.PORT);
});