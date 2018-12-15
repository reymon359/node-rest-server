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
    urlDB = process.env.MLAB_URI;
}
process.env.URLDB = urlDB;