//============================
// Port
//============================
process.env.PORT = process.env.PORT || 3000;
//============================
// Enviroment
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//============================
// Data base
//============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = 'mongodb://coffee-user:password1@ds123224.mlab.com:23224/coffee';
}
process.env.URLDB = urlDB;