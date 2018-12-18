// ============================
//  Port
// ============================
process.env.PORT = process.env.PORT || 3000;
// ============================
//  Enviroment
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ============================
//  Token expiration
// ============================
// 60 sec * 60 min * 24 hours * 30 days
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;
// ============================
//  Authentication seed
// ============================
process.env.SEED = process.env.SEED || 'dev-secret-seed';

// ============================ 
//  Data base
// ============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ============================ 
//  Google Client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '638544373364-609p35tee1v00j2d46og3k298netci7g.apps.googleusercontent.com';