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


// ============================
//  Admin Role verification
// ============================
let verificateAdmin_Role = (req, res, next) => {

    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'The user is not an admin'
            }
        });
    }
};

// ============================
//  Image Token verification
// ============================
let verificateTokenImg = (req, res, next) => {
    let token = req.query.token;
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
    verificateToken,
    verificateAdmin_Role,
    verificateTokenImg
}