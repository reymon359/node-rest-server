const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'The description is required']
    },
    // Here we add a reference to another Scheme with the ObjectId
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
module.exports = mongoose.model('Category', categorySchema);