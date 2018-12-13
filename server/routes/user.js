const express = require('express');
const app = express();



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

module.exports = app;