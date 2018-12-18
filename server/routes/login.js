const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user');

const app = express();


app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password not valid'
                }
            });
        }
        // We will see if the body.password in the request is the same as the userDB 
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password not valid'
                }
            });
        }
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });


        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
});

// Google configurations
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            });
        });
    // After getting the User verified by google we save it in our dataBase 
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // If the user already exists
        if (userDB) {
            // And registered before without google
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'User already exists. Log in with your email and password'
                    }
                });
            } else { // If he loged in with google we just renew the token
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else { // If the user doesnt exists we create it
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = 'salchipapa';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });


});






module.exports = app;