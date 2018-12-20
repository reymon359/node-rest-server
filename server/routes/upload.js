const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');

// default options
app.use(fileUpload());
// When we call app.use(fileUpload());  all the files go to req.files


// app.post('/upload', function(req, res) { // The old way
app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // Type validation
    let validTypes = ['products', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The types allowed are: ' + validTypes.join(', '),
                type
            }
        });
    }


    let file = req.files.file;
    let fileNameSplited = file.name.split('.');
    let extension = fileNameSplited[fileNameSplited.length - 1];


    // Allowed extensions for the file
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg', 'PNG', 'JPG', 'GIF', 'JPEG'];

    console.log(extension);

    console.log(validExtensions.indexOf(extension));

    // Check if the extension is valid
    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The extensions allowed are: ' + validExtensions.join(', '),
                ext: extension
            }
        });
    }

    // Change the name of the file
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        res.json({
            ok: true,
            message: 'File uploaded correctly'
        });
    });
});

module.exports = app;