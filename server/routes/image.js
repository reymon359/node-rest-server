const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificateToken } = require('../middlewares/authentication');

let app = express();


app.get('/image/:type/:img', verificateToken, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    console.log(imagePath);

    // I check if the path exists. If it exists the image exists too
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

});


module.exports = app;