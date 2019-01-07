var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { type: String, required: [true, 'The name is required'] },
    unitPrice: { type: Number, required: [true, 'The unit price is required'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    avaliable: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Product', productSchema);

// // To generate token later
// function rand() {
//     return Math.random().toString(36).substr(2); // remove `0.`
//   }

//   //
//   function token() {
//     return rand() + rand(); // To make it longer
//   }

//   admin.token = Math.random().toString(20).substr(2);