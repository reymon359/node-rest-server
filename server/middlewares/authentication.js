const jwt = require('jsonwebtoken');



// ============================
//  Token verification
// ============================
let verificateToken = (req, res, next) => { // next to continue program execution

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid'
                }
            });
        }
        req.user = decoded.user;
        next();
    });


};





module.exports = {
    verificateToken
}