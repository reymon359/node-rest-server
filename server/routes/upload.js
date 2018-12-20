const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());
// When we call app.use(fileUpload());  all the files go to req.files
app.post('/upload', function(req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
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

    file.mv(`uploads/${file.name}`, (err) => {
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