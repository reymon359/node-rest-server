const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());
// When we call app.use(fileUpload());  all the files go to req.files
app.post('/upload', function(req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded.'
                }
            });
    }
    let file = req.files.file;

    file.mv('uploads/filename.jpg', (err) => {
        if (err)
            return res.status(500)
                .json({
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