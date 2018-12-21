const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');

const fs = require('fs');
const path = require('path');

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
        // Here the image was uploaded correctly
        // Now we are going to assign it to an user
        userImage(id, res, fileName);
    });
});

// Assign the image uploaded to an user
function userImage(id, res, fileName) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The user does not exist'
                }
            });
        }

        // // Check if the user already has an image
        // let imagePath = path.resolve(__dirname, `../../uploads/users/${userDB.img}`);
        // if (fs.existsSync(imagePath)) {
        //     fs.unlinkSync(imagePath);
        // }

        deleteFile(userDB.img, 'users');

        userDB.img = fileName;
        userDB.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            });
        });
    });
}

function productImage(id, res, fileName) {}

function deleteFile(imageName, type) {
    // Check if the user already has an image
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${imageName}`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}



module.exports = app;