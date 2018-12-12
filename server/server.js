const express = require('express');
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
})
app.listen(3000, () => {
    console.log('Listening port: ', 3000);
});